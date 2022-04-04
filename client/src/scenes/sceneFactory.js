/* globals window:true */
/* globals localStorage:true */
/* globals document:true */
/* globals crypto:true */
import Phaser from 'phaser';
import playerObject from '../objects/playerObject.js';
import textObject from '../objects/textObject.js';
import handleKeyboardInput from '../handleKeyboardInput.js';
import updateInGameDomElements from '../updateInGameDomElements.js';
import sendDataToServer from '../sendDataToServer.js';
import spriteSheetList from '../objects/spriteSheetList.js';
import hadrons from '../objects/hadrons.js';
import getSpriteData from '../utilities/getSpriteData.js';
import validateHadronData from './sceneFactoryHelpers/validateHadronData.js';

import fullscreen from '../assets/spriteSheets/fullscreen.png';

// Example of adding sound.
import sunriseMp3 from '../assets/sounds/sunrise.mp3';
import sunriseOgg from '../assets/sounds/sunrise.ogg';

let didThisOnce = false; // For the sound example.

/**
 * @name sceneFactory
 * @type {function({sceneName?: String, tileMap?: JSON, tileSet: Object, gameSize: Object, htmlElementParameters?: Object}): Phaser.Scene}
 */
const sceneFactory = ({
  sceneName, // Every scene needs a name
  tileMap, // The tileMap is the layout of the tiles as set in Tiled.
  tileSet, // An object containing the actual image and the name to reference it by
  gameSize, // TODO: Is this required if the camera always covers the entire scene?
  htmlElementParameters = {},
}) => {
  const scene = new Phaser.Scene(sceneName);
  let map;
  let tileset; // TODO: Bad form having both a tileSet and tileset variable!
  let collisionLayer;

  // eslint-disable-next-line func-names
  scene.preload = function () {
    // Runs once, loads up assets like images and audio
    // All of these text based "keys" are basically global variables in Phaser.
    // You can reuse the same name, but phaser will just reuse the first thing you
    // assigned to it.
    // NOTE: This also means we are not wasting memory by loading the same tileSet over and over,
    // because phaser just overwrites them.
    this.load.image(`${tileSet.name}-tiles`, tileSet.image);
    // NOTE: The key must be different for each tilemap,
    // otherwise Phaser will get confused and reuse the same tilemap
    // even though you think you loaded another one.
    // https://www.html5gamedevs.com/topic/40710-how-do-i-load-a-new-scene-with-phaser-3-and-webpack/
    this.load.tilemapTiledJSON(`${sceneName}-map`, tileMap);

    // Spritesheet example: https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
    // The sprites can be added in this preload phase,
    // but the animations have to be added in the create phase later.
    spriteSheetList.forEach((spriteSheet) => {
      this.load.spritesheet(spriteSheet.name, spriteSheet.file, {
        frameWidth: spriteSheet.frameWidth,
        frameHeight: spriteSheet.frameHeight,
        endFrame: spriteSheet.endFrame,
      });
    });

    // Fullscreen button
    // TODO: Color and size should be configured per scene.
    this.load.spritesheet('fullscreen', fullscreen, {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.audio('sunrise', [sunriseOgg, sunriseMp3]);
  };

  function cleanUpScene() {
    // Mark all scene text objects as not currently displayed so the new scene can display them again
    // eslint-disable-next-line no-unused-vars
    for (const [, value] of Object.entries(textObject)) {
      value.hasBeenDisplayedInThisScene = false;
    }

    // Reset cameraScaleFactor for next scene.
    playerObject.cameraScaleFactor = 0;
  }

  function cleanUpSceneAndTeleport(
    destinationSceneName,
    destinationSceneEntrance,
  ) {
    if (destinationSceneName !== sceneName) {
      cleanUpScene();
      if (this.scene.getIndex(destinationSceneName) === -1) {
        console.log(
          `Switching to scene: ${destinationSceneName} does not exist.`,
        );
        // eslint-disable-next-line no-param-reassign
        destinationSceneName = playerObject.defaultOpeningScene;
      }
      playerObject.destinationEntrance = destinationSceneEntrance;
      if (playerObject.destinationEntrance) {
        console.log(
          `Switching to scene: ${destinationSceneName} entrance ${playerObject.destinationEntrance}.`,
        );
      } else {
        console.log(
          `Switching to scene: ${destinationSceneName} at default spawn point.`,
        );
      }

      if (playerObject.dotTrailRenderTexture) {
        playerObject.dotTrailRenderTexture.destroy();
        playerObject.dotTrailRenderTexture = null;
      }

      if (playerObject.pixelHighlightTexture) {
        playerObject.pixelHighlightTexture.destroy();
        playerObject.pixelHighlightTexture = null;
      }

      this.scene.start(destinationSceneName);
    }
  }

  function setCameraZoom() {
    if (!playerObject.disableCameraZoom) {
      const widthScaleFactor = window.innerWidth / gameSize.width;
      const heightScaleFactor = window.innerHeight / gameSize.height;
      const cameraScaleFactor =
        widthScaleFactor < heightScaleFactor // > - Zoomed < - fit screen
          ? widthScaleFactor
          : heightScaleFactor;
      if (cameraScaleFactor !== playerObject.cameraScaleFactor) {
        playerObject.cameraScaleFactor = cameraScaleFactor;
        // Use camera zoom to fill screen.
        this.cameras.main.setZoom(cameraScaleFactor);
        const gameWidth = Math.trunc(gameSize.width * cameraScaleFactor);
        const gameHeight = Math.trunc(gameSize.height * cameraScaleFactor);

        // Make sure the canvas is big enough to show the camera.
        this.scale.setGameSize(gameWidth, gameHeight);

        this.cameras.main
          .setBounds(
            tileset.tileWidth,
            tileset.tileHeight,
            gameSize.width,
            gameSize.height,
          )
          .setOrigin(0.5, 0.5);
      }
    }
    playerObject.cameraOffset = {
      x: this.cameras.main.worldView.x,
      y: this.cameras.main.worldView.y,
    };
  }

  async function returnToIntroScreen() {
    console.log('Display intro screen.');
    let existingHelpTextVersion = Number(
      localStorage.getItem('helpTextVersion'),
    );
    existingHelpTextVersion--;
    localStorage.setItem('helpTextVersion', existingHelpTextVersion.toString());

    cleanUpScene();

    window.location.reload();
  }

  function sceneFactoryRelatedCommandHandler() {
    if (playerObject.teleportToSceneNow) {
      const destinationScene = playerObject.teleportToSceneNow;
      playerObject.teleportToSceneNow = null;
      cleanUpSceneAndTeleport.call(this, destinationScene, null);
    }
  }

  // TODO: This is the first sprite to be inserted into the new game!
  //       Use this as an example/template!
  function castSpell() {
    // TODO: There should be some way to pick what spell/sprite is used.
    //       probably from an object with setting that are easy to edit.
    const newHadronId = crypto.randomUUID();
    const direction = playerObject.playerDirection;
    const velocity = 150;
    let velocityX = 0;
    let velocityY = 0;
    if (direction === 'left') {
      velocityX = -velocity;
    } else if (direction === 'right') {
      velocityX = velocity;
    } else if (direction === 'up') {
      velocityY = -velocity;
    } else if (direction === 'down') {
      velocityY = velocity;
    }

    hadrons.set(newHadronId, {
      id: newHadronId, // Unfortunately each hadron must also hold it's ID internally.
      owner: playerObject.playerId,
      sprite: 'fireball',
      x: playerObject.player.x,
      y: playerObject.player.y,
      direction,
      scene: sceneName,
      velocityX,
      velocityY,
    });
  }

  function hotKeyHandler() {
    // Return to intro text
    if (playerObject.keyState.p === 'keydown') {
      playerObject.keyState.p = null;
      returnToIntroScreen();
    }

    // Hot key scene switch for testing.
    if (playerObject.keyState.h === 'keydown') {
      playerObject.keyState.h = null;
      if (sceneName !== playerObject.defaultOpeningScene) {
        // Don't teleport here if we ARE here.
        playerObject.dotTrailsOn = false; // Game crashes if this is on during this operation.
        cleanUpSceneAndTeleport.call(
          this,
          playerObject.defaultOpeningScene,
          null,
        );
      }
    }

    // Hot key to display/hide chat log
    if (playerObject.keyState.l === 'keydown') {
      playerObject.keyState.l = null;
      playerObject.scrollingTextBox.display(false);
    }

    // Hot key to turn dot trails on/off
    if (playerObject.keyState.t === 'keydown') {
      playerObject.keyState.t = null;
      playerObject.dotTrailsOn = !playerObject.dotTrailsOn;
    }

    // Send default Spell with spacebar
    if (playerObject.keyState[' '] === 'keydown') {
      playerObject.keyState[' '] = null;
      castSpell.call(this);
    }
  }

  function handlePlayerMovement(maxSpeed, useAcceleration) {
    // Stop any previous movement from the last frame
    const previousVelocityX = playerObject.player.body.velocity.x;
    const previousVelocityY = playerObject.player.body.velocity.y;
    playerObject.player.body.setVelocity(0);
    let fullSpeed = true;

    // Horizontal movement
    if (
      playerObject.keyState.ArrowLeft === 'keydown' ||
      playerObject.keyState.a === 'keydown' ||
      playerObject.joystickDirection.left
    ) {
      let newSpeed = -maxSpeed;
      if (useAcceleration) {
        if (previousVelocityX === 0) {
          newSpeed = -1;
          fullSpeed = false;
        } else if (previousVelocityX > -maxSpeed) {
          newSpeed = previousVelocityX - playerObject.acceleration;
          fullSpeed = false;
        }
      }
      playerObject.player.body.setVelocityX(newSpeed);
    } else if (
      playerObject.keyState.ArrowRight === 'keydown' ||
      playerObject.keyState.d === 'keydown' ||
      playerObject.joystickDirection.right
    ) {
      let newSpeed = maxSpeed;
      if (useAcceleration) {
        if (previousVelocityX === 0) {
          newSpeed = 1;
          fullSpeed = false;
        } else if (previousVelocityX < maxSpeed) {
          newSpeed = previousVelocityX + playerObject.acceleration;
          fullSpeed = false;
        }
      }
      playerObject.player.body.setVelocityX(newSpeed);
    }

    // Vertical movement
    if (
      playerObject.keyState.ArrowUp === 'keydown' ||
      playerObject.keyState.w === 'keydown' ||
      playerObject.joystickDirection.up
    ) {
      let newSpeed = -maxSpeed;
      if (useAcceleration) {
        if (previousVelocityY === 0) {
          newSpeed = -1;
          fullSpeed = false;
        } else if (previousVelocityY > -maxSpeed) {
          newSpeed = previousVelocityY - playerObject.acceleration;
          fullSpeed = false;
        }
      }
      playerObject.player.body.setVelocityY(newSpeed);
    } else if (
      playerObject.keyState.ArrowDown === 'keydown' ||
      playerObject.keyState.s === 'keydown' ||
      playerObject.joystickDirection.down
    ) {
      let newSpeed = maxSpeed;
      if (useAcceleration) {
        if (previousVelocityY === 0) {
          newSpeed = 1;
          fullSpeed = false;
        } else if (previousVelocityY < maxSpeed) {
          newSpeed = previousVelocityY + playerObject.acceleration;
          fullSpeed = false;
        }
      }
      playerObject.player.body.setVelocityY(newSpeed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    if (fullSpeed) {
      playerObject.player.body.velocity.normalize().scale(maxSpeed);
    }
  }

  function checkIfLayerExists(layer) {
    const tilemapList = map.getTileLayerNames();
    return tilemapList.findIndex((entry) => entry === layer) > -1;
  }

  function checkThatPlayerIsOnTeleportTile(camera) {
    // Check if we are on a Teleport tile, and Teleport!
    const tilemapList = map.getTileLayerNames();
    const teleportTileMapLayers = tilemapList.filter((entry) => {
      const splitLayerName = entry.split('/');
      return splitLayerName.length > 1 && splitLayerName[0] === 'Teleport';
    });
    let destinationSceneName;
    let destinationSceneEntrance = null;
    teleportTileMapLayers.forEach((entry) => {
      const tile = map.getTileAtWorldXY(
        playerObject.player.x,
        playerObject.player.y,
        false,
        camera,
        entry,
      );
      if (tile && tile.hasOwnProperty('index') && tile.index > -1) {
        // Use the Teleport layer's "Custom Properties" array to get the destination Scene and Entrance
        if (Array.isArray(tile.layer.properties)) {
          // Get Destination Scene
          const destinationSceneNameIndex = tile.layer.properties.findIndex(
            (x) => x.name === 'DestinationScene',
          );
          if (destinationSceneNameIndex > -1) {
            destinationSceneName =
              tile.layer.properties[destinationSceneNameIndex].value;
          }
          // Get Destination Entrance
          const entrancePropertyIndex = tile.layer.properties.findIndex(
            (x) => x.name === 'Entrance',
          );
          if (entrancePropertyIndex > -1) {
            destinationSceneEntrance =
              tile.layer.properties[entrancePropertyIndex].value;
          }
        }
      }
    });
    if (destinationSceneName) {
      cleanUpSceneAndTeleport.call(
        this,
        destinationSceneName,
        destinationSceneEntrance,
      );
      return true;
    }
    return false;
  }

  function updateAnimation() {
    // Update the animation last and give left/right animations precedence over up/down animations
    if (
      playerObject.keyState.ArrowLeft === 'keydown' ||
      playerObject.keyState.a === 'keydown' ||
      playerObject.joystickDirection.left
    ) {
      playerObject.player.setFlipX(playerObject.spriteData.faces === 'right');
      playerObject.player.anims.play(
        `${playerObject.spriteData.name}-move-left`,
        true,
      );
      playerObject.playerDirection = 'left';
      playerObject.playerStopped = false;
    } else if (
      playerObject.keyState.ArrowRight === 'keydown' ||
      playerObject.keyState.d === 'keydown' ||
      playerObject.joystickDirection.right
    ) {
      playerObject.player.setFlipX(playerObject.spriteData.faces === 'left');
      playerObject.player.anims.play(
        `${playerObject.spriteData.name}-move-right`,
        true,
      );
      playerObject.playerDirection = 'right';
      playerObject.playerStopped = false;
    } else if (
      playerObject.keyState.ArrowUp === 'keydown' ||
      playerObject.keyState.w === 'keydown' ||
      playerObject.joystickDirection.up
    ) {
      playerObject.player.anims.play(
        `${playerObject.spriteData.name}-move-back`,
        true,
      );
      playerObject.playerDirection = 'up';
      playerObject.playerStopped = false;
    } else if (
      playerObject.keyState.ArrowDown === 'keydown' ||
      playerObject.keyState.s === 'keydown' ||
      playerObject.joystickDirection.down
    ) {
      playerObject.player.anims.play(
        `${playerObject.spriteData.name}-move-front`,
        true,
      );
      playerObject.playerDirection = 'down';
      playerObject.playerStopped = false;
    } else {
      playerObject.player.anims.stop();
      playerObject.playerStopped = true;
    }
  }

  function renderDebugDotTrails(hadron, key) {
    if (playerObject.dotTrailsOn) {
      // Use this to track the server location of objects on the screen across time.
      // It is activated with 't'
      // Render Texture
      // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.RenderTexture.html
      // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/rendertexture/
      // Rectangles:
      // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Rectangle.html
      if (!playerObject.dotTrailRenderTexture) {
        playerObject.dotTrailRenderTexture = scene.add.renderTexture(
          0,
          0,
          640,
          480,
        );
      }
      let fillColor = 0x00ff00;
      let width = 1;
      let height = 1;
      if (['carrot'].indexOf(hadron.type) > -1) {
        fillColor = 0x0000ff;
        width = 5;
        height = 5;
      } else if (['slime'].indexOf(hadron.type) > -1) {
        fillColor = 0xff0000;
      } else if (['fireball'].indexOf(hadron.type) > -1) {
        fillColor = 0xffa500;
      } else if (['teleball'].indexOf(hadron.type) > -1) {
        fillColor = 0xffa500;
      } else if (['push'].indexOf(hadron.type) > -1) {
        fillColor = 0xffa500;
      } else if (key === playerObject.playerId) {
        // it me
        fillColor = 0x00a500;
      } else if (['player'].indexOf(hadron.type) > -1) {
        // it !me
        fillColor = 0x6a0dad;
      }
      playerObject.dotTrailRenderTexture.draw(
        new Phaser.GameObjects.Rectangle(
          scene,
          hadron.x,
          hadron.y,
          width,
          height,
          fillColor,
          1,
        ).setOrigin(0.5, 0.5),
      );
      // this.add
      //   .rectangle(hadron.x, hadron.y, 1, 1, 0xff0000, 1)
      //   .setOrigin(0, 0);
    } else if (playerObject.dotTrailRenderTexture) {
      playerObject.dotTrailRenderTexture.destroy();
      playerObject.dotTrailRenderTexture = null;
    }
  }

  function spriteCollisionHandler({
    spriteKey,
    sprite,
    obstacleLayerName,
    obstacleLayer,
    obstacleSpriteKey,
    obstacleSprite,
  }) {
    if (obstacleSpriteKey === playerObject.playerId) {
      // Ignore things that I created that hit myself. For now.
      // Because of how things spawn, they all hit me when launched,
      // so if we want to do otherwise we have more work to do.
      return;
      // TODO: At some point these will matter, such as if I make a boss that shoots at me.
    }
    if (obstacleLayer) {
      // for now despawning silently if we hit a "layer"
      // TODO: More sophisticated collision detection. i.e. Maybe fireballs cross over water?
      sendDataToServer.destroyHadron(spriteKey);
      hadrons.delete(spriteKey);
    } else if (
      obstacleSpriteKey &&
      hadrons.has(obstacleSpriteKey) &&
      hadrons.get(obstacleSpriteKey).name
    ) {
      // If the obstacle is a hadron, and it has a name, it is a player,
      // so make them say "Oof!"
      // TODO: Player hadrons should have a better "tag" and we should tag other "things" too to thelp with this.
      sendDataToServer.destroyHadron(spriteKey);
      hadrons.delete(spriteKey);
      sendDataToServer.makePlayerSayOff(obstacleSpriteKey);
    } else if (obstacleSpriteKey) {
      // Any sprite collision that wasn't a player
      // TODO: Obviousy this needs to be more sophisticated.
      sendDataToServer.destroyHadron(spriteKey);
      hadrons.delete(spriteKey);
    } else {
      // I don't think that we will ever get here, but if so, now what? :)
      // Also this is a good example of how to log out collision events.
      console.log(
        spriteKey,
        sprite,
        obstacleLayerName,
        obstacleLayer,
        obstacleSpriteKey,
        obstacleSprite,
      );
    }
  }

  function addNewSprites(hadron, key) {
    let spriteData; // Convenient short variable to hold some data.

    // If no `sprite` key is given, no sprite is displayed.
    // This also prevents race conditions with remote players during reload
    // If a remote player changes their sprite, we won't know about it,
    //       although currently they have to disconnect to do this, so
    //       the game piece is removed and resent anyway.

    // Add new Sprites for new objects.
    if (!playerObject.spawnedObjectList[key]) {
      // Add new sprites to the scene
      playerObject.spawnedObjectList[key] = {};

      playerObject.spawnedObjectList[key].spriteData = getSpriteData(
        hadron.sprite,
      );

      // Use different carrot colors for different genetic code
      if (hadron.type === 'carrot') {
        // hadron.genes.color range 0 to 255
        // Currently carrot options are 01 to 28
        const carrotSpriteId = Math.floor(28 * (hadron.genes.color / 255));
        const alternateCarrotSpriteName = `carrot${
          carrotSpriteId < 10 ? 0 : ''
        }${carrotSpriteId}`;
        // console.log(
        //   hadron.genes.color,
        //   hadron.genes.color / 255,
        //   carrotSpriteId,
        //   alternateCarrotSpriteName,
        //   hadron.energy,
        // );
        const newSprite = getSpriteData(alternateCarrotSpriteName);
        if (newSprite.name !== playerObject.defaultSpriteName) {
          playerObject.spawnedObjectList[key].spriteData = newSprite;
        }
      }

      // To shorten variable names and make code more consistent
      spriteData = playerObject.spawnedObjectList[key].spriteData;

      playerObject.spawnedObjectList[key].sprite = this.physics.add
        .sprite(hadron.x, hadron.y, spriteData.name)
        .setSize(spriteData.physicsSize.x, spriteData.physicsSize.y);

      if (
        hadron.owner === playerObject.playerId &&
        key !== playerObject.playerId
      ) {
        // Track collisions for owned sprites.
        // Collisions with tilemap layer
        this.physics.add.collider(
          playerObject.spawnedObjectList[key].sprite,
          collisionLayer,
          (sprite, obstacle) => {
            spriteCollisionHandler({
              spriteKey: key,
              sprite,
              obstacleLayerName: 'collisionLayer',
              obstacleLayer: obstacle,
            });
          },
        );

        // Collisions with other sprites
        for (const otherSpriteKey in playerObject.spawnedObjectList) {
          if (
            playerObject.spawnedObjectList.hasOwnProperty(otherSpriteKey) &&
            playerObject.spawnedObjectList[otherSpriteKey] &&
            playerObject.spawnedObjectList[otherSpriteKey].sprite
          ) {
            this.physics.add.collider(
              playerObject.spawnedObjectList[key].sprite,
              playerObject.spawnedObjectList[otherSpriteKey].sprite,
              (sprite, obstacle) => {
                spriteCollisionHandler({
                  spriteKey: key,
                  sprite,
                  obstacleSpriteKey: otherSpriteKey,
                  obstacleSprite: obstacle,
                });
              },
            );
          }
        }

        // Set velocity on owned sprites
        playerObject.spawnedObjectList[key].sprite.body.setVelocityX(
          hadron.velocityX,
        );
        playerObject.spawnedObjectList[key].sprite.body.setVelocityY(
          hadron.velocityY,
        );
      }

      // Set the "shadow" of my own player to black.
      if (key === playerObject.playerId) {
        playerObject.spawnedObjectList[key].sprite.tint = 0x000000;
      }

      // Some sprites don't line up well with their physics object,
      // so this allows for offsetting that in the config.
      if (spriteData.physicsOffset) {
        playerObject.spawnedObjectList[key].sprite.body.setOffset(
          spriteData.physicsOffset.x,
          spriteData.physicsOffset.y,
        );
      }

      playerObject.spawnedObjectList[key].sprite.displayHeight =
        spriteData.displayHeight;
      playerObject.spawnedObjectList[key].sprite.displayWidth =
        spriteData.displayWidth;
    }

    if (!spriteData) {
      spriteData = playerObject.spawnedObjectList[key].spriteData;
    }

    return spriteData;
  }

  // TODO: We need to SEND data for all of our sprites.
  // TODO: We need to UPDATE location for all of our sprites, even if they aren't in our scene?
  // TODO: How do we deal with collisions for sprites not in our scene, but that we own? Perhaps others can help with that? Group collision detection and consensus handling?
  function updateHadrons() {
    // Deal with game pieces from server.
    const activeObjectList = [];

    hadrons.forEach((hadron, key) => {
      // Sometimes a game piece is not something we can use
      if (validateHadronData(hadron, key)) {
        activeObjectList.push(key);

        // Only render game pieces for THIS scene, and only if they have a hadron key
        if (hadron.scene === sceneName && hadron.sprite) {
          // This is used for debugging
          renderDebugDotTrails(hadron, key);

          // Is this ME?
          if (key === playerObject.playerId) {
            // If so, act on special keys.

            // The force key lets the server change the player's position.
            // TODO: Should this be removed or is there some use for this still?
            if (hadron.force) {
              playerObject.force = true; // This tells the data sender to update this to false;
              // The player has now been forced to a new location by the server,
              // this location needs to be set and player input ignored
              // Stop player if they are moving
              playerObject.player.body.setVelocity(0);
              playerObject.player.body.reset(hadron.x, hadron.y);
            }
          }

          const spriteData = addNewSprites.call(this, hadron, key);

          // Sometimes they go inactive.
          playerObject.spawnedObjectList[key].sprite.active = true;

          // Use health to adjust size for veggies
          if (hadron.type === 'carrot' && spriteData) {
            playerObject.spawnedObjectList[key].sprite.displayHeight =
              spriteData.displayHeight * (hadron.energy / 100);
            playerObject.spawnedObjectList[key].sprite.displayWidth =
              spriteData.displayWidth * (hadron.energy / 100);
          }

          // Use Game Piece direction to set hadron rotation or flip it
          if (playerObject.spawnedObjectList[key].spriteData.rotatable) {
            // Rotate hadron to face requested direction.
            if (hadron.direction === 'left' || hadron.direction === 'west') {
              playerObject.spawnedObjectList[key].sprite.setAngle(180);
            } else if (
              hadron.direction === 'right' ||
              hadron.direction === 'east'
            ) {
              playerObject.spawnedObjectList[key].sprite.setAngle(0);
            } else if (
              hadron.direction === 'up' ||
              hadron.direction === 'north'
            ) {
              playerObject.spawnedObjectList[key].sprite.setAngle(-90);
            } else if (
              hadron.direction === 'down' ||
              hadron.direction === 'south'
            ) {
              playerObject.spawnedObjectList[key].sprite.setAngle(90);
            }
          } else if (
            hadron.direction === 'left' ||
            hadron.direction === 'west'
          ) {
            // For non rotatable sprites, only flip them for left/right
            playerObject.spawnedObjectList[key].sprite.setFlipX(
              playerObject.spawnedObjectList[key].spriteData.faces === 'right',
            );
          } else if (
            hadron.direction === 'right' ||
            hadron.direction === 'east'
          ) {
            playerObject.spawnedObjectList[key].sprite.setFlipX(
              playerObject.spawnedObjectList[key].spriteData.faces === 'left',
            );
          }

          // The only way to know if the remote item is in motion is for the server to tell us
          //       We cannot divine it, because the local tick is always faster than the server update.
          let objectInMotion = true; // Default to animate if server does not tell us otherwise.
          if (hadron.moving === false) {
            objectInMotion = false;
          }
          if (!objectInMotion) {
            playerObject.spawnedObjectList[key].sprite.anims.stop();
          } else if (
            playerObject.spawnedObjectList[
              key
            ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-left`,
            ) &&
            (hadron.direction === 'left' || hadron.direction === 'west')
          ) {
            playerObject.spawnedObjectList[key].sprite.anims.play(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-left`,
              true,
            );
          } else if (
            playerObject.spawnedObjectList[
              key
            ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-right`,
            ) &&
            (hadron.direction === 'right' || hadron.direction === 'east')
          ) {
            playerObject.spawnedObjectList[key].sprite.anims.play(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-right`,
              true,
            );
          } else if (
            playerObject.spawnedObjectList[
              key
            ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-back`,
            ) &&
            (hadron.direction === 'up' || hadron.direction === 'north')
          ) {
            playerObject.spawnedObjectList[key].sprite.anims.play(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-back`,
              true,
            );
          } else if (
            playerObject.spawnedObjectList[
              key
            ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-front`,
            ) &&
            (hadron.direction === 'down' || hadron.direction === 'south')
          ) {
            playerObject.spawnedObjectList[key].sprite.anims.play(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-front`,
              true,
            );
          } else if (
            playerObject.spawnedObjectList[
              key
            ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-stationary`,
            )
          ) {
            playerObject.spawnedObjectList[key].sprite.anims.play(
              `${playerObject.spawnedObjectList[key].spriteData.name}-move-stationary`,
              true,
            );
          }

          // Easing demonstrations:
          // https://labs.phaser.io/edit.html?src=src\tweens\ease%20equations.js

          // TODO: I think this needs to actually move now, but it works.
          // Only do this for other player's objects,
          // and my shadow.
          if (
            hadron.owner !== playerObject.playerId ||
            key === playerObject.playerId
          ) {
            this.tweens.add({
              targets: playerObject.spawnedObjectList[key].sprite,
              x: hadron.x,
              y: hadron.y,
              duration: 1, // Adjust this to be smooth without being too slow.
              ease: 'Linear', // Anything else is wonky when tracking server updates.
            });
          }
        } else if (
          playerObject.spawnedObjectList[key] &&
          playerObject.spawnedObjectList[key].sprite
        ) {
          // Destroy any sprites left over from incorrect scenes
          if (playerObject.spawnedObjectList[key].sprite) {
            playerObject.spawnedObjectList[key].sprite.destroy();
          }
          // and wipe their data so we do not see it anymore.
          playerObject.spawnedObjectList[key] = null;
        }

        // Add game piece data to object for use elsewhere later
        // (I'm not 100% sure what this is for anymore.
        if (
          playerObject.spawnedObjectList.hasOwnProperty(key) &&
          playerObject.spawnedObjectList[key]
        ) {
          playerObject.spawnedObjectList[key].hadron = hadron;
        }

        // TODO: I think this is where to send data to the server.
        if (
          hadron.owner === playerObject.playerId &&
          key !== playerObject.playerId
        ) {
          // Update all data on owned hadrons.
          const newHadronData = { ...hadron };
          newHadronData.x = playerObject.spawnedObjectList[key].sprite.x;
          newHadronData.y = playerObject.spawnedObjectList[key].sprite.y;
          // TODO: I'm not sure how to handle other sprites that we own when we leave the scene.
          newHadronData.scene = sceneName;
          if (key === playerObject.playerId) {
            newHadronData.scene = sceneName;
            newHadronData.chatOpen = playerObject.chatOpen;
            newHadronData.moving = !playerObject.playerStopped;
          }
          hadrons.set(key, newHadronData);

          // TODO: Anything from here that we are missing?
          // const obj = {
          //   id: playerObject.playerId,
          //   direction: playerObject.playerDirection,
          //   sprite: playerObject.spriteName,
          // };

          // Send owned hadron data to server.
          sendDataToServer.hadronData(key);
        }
      }
    });
    return activeObjectList;
  }

  function removeDespawnedObjects(activeObjectList) {
    // Remove de-spawned objects
    for (const key in playerObject.spawnedObjectList) {
      if (
        playerObject.spawnedObjectList.hasOwnProperty(key) &&
        playerObject.spawnedObjectList[key] &&
        activeObjectList.indexOf(key) === -1
      ) {
        if (playerObject.spawnedObjectList[key].sprite) {
          playerObject.spawnedObjectList[key].sprite.destroy();
        }
        playerObject.spawnedObjectList[key] = null;
      }
    }
  }

  // eslint-disable-next-line func-names
  scene.create = function () {
    // Runs once, after all assets in preload are loaded

    if (!didThisOnce && playerObject.enableSound) {
      didThisOnce = true; // So it doesn't get annoying . . . more annoying.
      this.sound.play('sunrise');
    }

    // The sprites can be added in the preload phase above,
    // but the animations have to be added in the create phase.
    spriteSheetList.forEach((spriteSheet) => {
      if (spriteSheet.animations) {
        spriteSheet.animations.forEach((animation) => {
          this.anims.create({
            key: `${spriteSheet.name}-${animation.keyName}`,
            frames: this.anims.generateFrameNumbers(spriteSheet.name, {
              start: animation.start,
              end: animation.end,
              zeroPad: animation.zeroPad,
              frames: animation.frames,
            }),
            frameRate: spriteSheet.animationFrameRate,
            repeat: animation.repeat,
          });
        });
      }
    });

    map = this.make.tilemap({ key: `${sceneName}-map` });

    // Arguments for addTilesetImage are:
    // the name you gave the tileset in Tiled and
    // the key of the tileset image in Phaser's cache (i.e. the name you used in preload)
    tileset = map.addTilesetImage(tileSet.name, `${tileSet.name}-tiles`);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    map.createLayer('Ground', tileset, 0, 0);
    map.createLayer('Stuff on the Ground You Can Walk On', tileset, 0, 0);

    // We collide with EVERYTHING in this layer. Collision isn't based on tiles themselves,
    // but the layer they are in.
    collisionLayer = map
      .createLayer('Stuff You Run Into', tileset, 0, 0)
      .setCollisionByExclusion([-1]);
    let waterLayer;
    if (checkIfLayerExists('Water')) {
      waterLayer = map
        .createLayer('Water', tileset, 0, 0)
        .setCollisionByExclusion([-1]);
    }
    const overheadLayer = map.createLayer(
      'Stuff You Walk Under',
      tileset,
      0,
      0,
    );

    // If you want to verify that you’ve got the right tiles marked as colliding, use the layer’s debug rendering:
    // https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // collisionLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    // Set camera background to white for areas where no tiles were placed
    // NOTE: If all tile maps had 100% coverage, this would not be needed.
    this.cameras.main.setBackgroundColor('#ffffff');

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    overheadLayer.setDepth(2);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the .json file, there's an object layer with a point named "Spawn Point"
    let spawnPoint = map.findObject(
      'Objects',
      (obj) => obj.name === 'Default Spawn Point',
    );
    if (playerObject.destinationEntrance) {
      const entranceList = map.filterObjects(
        'Objects',
        (obj) => obj.type === 'Entrance',
      );
      if (entranceList && entranceList.length > 0) {
        const requestedEntranceIndex = entranceList.findIndex(
          (x) => x.name === playerObject.destinationEntrance,
        );
        if (requestedEntranceIndex > -1) {
          spawnPoint = entranceList[requestedEntranceIndex];
        }
      }
    }

    setCameraZoom.call(this);

    // Use scene from server. Switch to different scene if this is not it
    // NOTE: Remember to do this BEFORE setting the position from the server.
    // HOWEVER: This MUST be done after setCameraZoom, or the scene
    // will load unzoomed. I'm not sure why.
    if (!playerObject.initialSceneFromServerAlreadyUsed) {
      playerObject.initialSceneFromServerAlreadyUsed = true;
      if (playerObject.initialScene !== sceneName) {
        cleanUpScene(playerObject.initialScene);
        this.scene.start(playerObject.initialScene);
        return; // We left this scene, we do not need to continue creating it now.
      }
    }

    // Create a sprite with physics enabled via the physics system.
    // You can use the setSize and setOffset to allow the character to overlap the
    // collision blocks slightly. This often makes the most sense for the head to overlap a bit so that "background" blocks (above player) seem more "background"
    // Also use the setSize to allow the character to fit in the spaces it should, even if the
    // sprite is too big for them.
    playerObject.spriteData = getSpriteData(playerObject.spriteName);

    // Use the player's last position from the server if it exists
    if (!playerObject.initialPositionFromServerAlreadyUsed) {
      playerObject.initialPositionFromServerAlreadyUsed = true;
      // 0,0 is assumed to be an empty position from a new player.
      // NOTE: This could be a bug if 0,0 is ever a legitimate last position.
      if (
        !(
          playerObject.initialPosition.x === 0 &&
          playerObject.initialPosition.x === 0
        )
      ) {
        spawnPoint = {
          x: playerObject.initialPosition.x,
          y: playerObject.initialPosition.y,
        };
      } else {
        // Presumably this is a new user.
        console.log(
          'Using scene spawn point, as initial position from server was 0,0.',
        );
      }
    }

    playerObject.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, playerObject.spriteData.name)
      .setSize(
        playerObject.spriteData.physicsSize.x,
        playerObject.spriteData.physicsSize.y,
      );

    playerObject.player.setDepth(1);

    if (playerObject.spriteData.physicsOffset) {
      playerObject.player.body.setOffset(
        playerObject.spriteData.physicsOffset.x,
        playerObject.spriteData.physicsOffset.y,
      );
    }

    // If sprite is out of scale with tiles, adjusting here
    playerObject.player.displayHeight = playerObject.spriteData.displayHeight;
    playerObject.player.displayWidth = playerObject.spriteData.displayWidth;

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(playerObject.player, collisionLayer);
    if (waterLayer) {
      this.physics.add.collider(playerObject.player, waterLayer);
    }
    // This section finds the Objects in the Tilemap that trigger features
    // Useful info on how this works:
    // https://www.html5gamedevs.com/topic/37978-overlapping-on-a-tilemap-object-layer/?do=findComment&comment=216742
    // https://github.com/B3L7/phaser3-tilemap-pack/blob/master/src/scenes/Level.js
    const objects = map.getObjectLayer('Objects');
    objects.objects.forEach((object) => {
      if (object.type === 'SpawnNPC') {
        // This spawns "NPCs" embedded in the tileMap.
        // The tile map is *NOT* where NPCs should really live,
        // the server should create them, *BUT* this is a good place to just put random
        // cosmetic items in the map and/or for testing new Sprite Sheets.
        // NOTE that there is NO accommodation for interacting with these items,
        // they are just for show. Interactive items should be generated by the server.
        const spriteData = getSpriteData(object.name);
        const newThing = this.physics.add
          .sprite(object.x, object.y, spriteData.name)
          .setSize(spriteData.physicsSize.x, spriteData.physicsSize.y);
        if (spriteData.physicsOffset) {
          newThing.body.setOffset(
            spriteData.physicsOffset.x,
            spriteData.physicsOffset.y,
          );
        }
        newThing.displayHeight = spriteData.displayHeight;
        newThing.displayWidth = spriteData.displayWidth;
        newThing.flipX = spriteData.faces === 'right';

        if (
          this.anims.anims.entries.hasOwnProperty(
            `${spriteData.name}-move-stationary`,
          )
        ) {
          newThing.anims.play(`${spriteData.name}-move-stationary`, true);
        }
      }
    });

    // We cannot use getTileAtWorldXY() to find out if a player
    // is on a teleport tile unless we add the Teleport tiles as a layer.
    // Just make sure that they are invisible, because they can show at the
    // edges of the screen.
    map.layers.forEach((layer) => {
      const splitLayerName = layer.name.split('/');
      if (splitLayerName.length > 1 && splitLayerName[0] === 'Teleport') {
        map.createLayer(layer.name, tileset, 0, 0);
      }
    });

    // TODO: Animated tile replacement experiment
    // Animated water tiles
    map.filterTiles(
      (tile) => {
        // console.log(tile.pixelX, tile.pixelY, tile.index);
        const spriteData = getSpriteData('grassAndWaterDark');
        const newThing = this.physics.add
          .sprite(tile.pixelX, tile.pixelY, spriteData.name)
          .setSize(tile.width, tile.height)
          .setOrigin(0, 0);
        // if (spriteData.physicsOffset) {
        //   newThing.body.setOffset(
        //     spriteData.physicsOffset.x,
        //     spriteData.physicsOffset.y,
        //   );
        // }
        newThing.displayHeight = tile.width;
        newThing.displayWidth = tile.height;
        newThing.flipX = spriteData.faces === 'right';

        if (
          this.anims.anims.entries.hasOwnProperty(
            `${spriteData.name}-move-stationary`,
          )
        ) {
          newThing.anims.play(`${spriteData.name}-move-stationary`, true);
        }
      },
      this,
      1,
      1,
      gameSize.width,
      gameSize.height,
      { isNotEmpty: true },
      'Water',
    );

    // Globally send all keyboard input to the keyboard input handler
    this.input.keyboard.on('keydown', handleKeyboardInput);
    this.input.keyboard.on('keyup', handleKeyboardInput);

    // Phaser controlled mouse input
    this.input.mouse.disableContextMenu();

    // Fullscreen button
    // http://labs.phaser.io/100.html?src=src%5Cscalemanager%5Cfull%20screen%20game.js
    // NOTE: You can scale SPRITES, but not IMAGES, hence loading this as a sprite.
    // this.load.image('logo', 'images/logo.png');
    // var logo = this.game.add.sprite(x, y, 'logo');
    // logo.scale.setTo(1, 1); // here is where you can scale your image. 1 , 1 is original size so you can make it twice as big with 2 , 2 or half the size with 0.5, 0.5
    this.game.scale.fullscreenTarget = document.getElementsByTagName('body')[0];
    const fullScreenButton = this.physics.add
      .sprite(gameSize.width, 32, 'fullscreen', 0)
      .setSize(16, 16)
      .setInteractive();
    fullScreenButton.displayHeight = 16;
    fullScreenButton.displayWidth = 16;
    fullScreenButton.on(
      'pointerup',
      () => {
        console.log('Fullscreen pointerup');
        if (this.scale.isFullscreen) {
          fullScreenButton.setFrame(0);

          this.scale.stopFullscreen();
        } else {
          fullScreenButton.setFrame(1);

          this.scale.startFullscreen();
        }
      },
      this,
    );

    updateInGameDomElements(htmlElementParameters);
  };

  // eslint-disable-next-line func-names
  scene.update = function (time, delta) {
    // Runs once per frame for the duration of the scene

    if (checkThatPlayerIsOnTeleportTile.call(this, this.cameras.main)) {
      return;
    }

    setCameraZoom.call(this);

    let maxSpeed = playerObject.maxSpeed;
    let useAcceleration = true;
    if (
      playerObject.joystickDirection.left ||
      playerObject.joystickDirection.right ||
      playerObject.joystickDirection.up ||
      playerObject.joystickDirection.down
    ) {
      // In case of joystick usage, disable acceleration,
      // and use joystick force instead.
      useAcceleration = false;

      let distance = playerObject.joystickDistance;
      if (distance > playerObject.maxJoystickDistance) {
        distance = playerObject.maxJoystickDistance;
      }
      const newMaxSpeed =
        (maxSpeed * distance) / playerObject.maxJoystickDistance;
      if (newMaxSpeed < maxSpeed) {
        maxSpeed = newMaxSpeed;
      }
    }

    // Shift to sprint
    if (playerObject.keyState.Shift === 'keydown') {
      useAcceleration = false;
    }

    playerObject.player.body.velocity.clone();

    sceneFactoryRelatedCommandHandler.call(this);

    hotKeyHandler.call(this);

    playerObject.scrollingTextBox.sceneUpdate(delta);

    handlePlayerMovement(maxSpeed, useAcceleration);

    updateAnimation();

    const activeObjectList = updateHadrons.call(this);

    // Send Player data, which is unique
    sendDataToServer.playerData({
      id: playerObject.id,
      sceneName,
      x: playerObject.player.x,
      y: playerObject.player.y,
    });

    removeDespawnedObjects(activeObjectList);

    updateInGameDomElements(htmlElementParameters);
  };

  return scene;
};

export default sceneFactory;
