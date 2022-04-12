/* globals window:true */
/* globals localStorage:true */
/* globals document:true */
/* globals crypto:true */
/* globals prompt:true */
import Phaser from 'phaser';
import playerObject from '../objects/playerObject.js';
import textObject from '../objects/textObject.js';
import handleKeyboardInput from '../handleKeyboardInput.js';
import updateInGameDomElements from '../updateInGameDomElements.js';
import sendDataToServer from '../sendDataToServer.js';
import spriteSheetList from '../objects/spriteSheetList.js';
import hadrons from '../objects/hadrons.js';
import clientSprites from '../objects/clientSprites.js';
import deletedHadronList from '../objects/deletedHadronList.js';
import getSpriteData from '../utilities/getSpriteData.js';
import validateHadronData from './sceneFactoryHelpers/validateHadronData.js';

import fullscreen from '../assets/spriteSheets/fullscreen.png';

// Example of adding sound.
import sunriseMp3 from '../assets/sounds/sunrise.mp3';
import sunriseOgg from '../assets/sounds/sunrise.ogg';
import _ from 'lodash';

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
  let sceneTileSet;
  let collisionLayer;
  const teleportLayersColliders = new Map();

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
            sceneTileSet.tileWidth,
            sceneTileSet.tileHeight,
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

  let currentMessage = '';
  const chatForThrottle = () => {
    sendDataToServer.chat(currentMessage);
  };
  const throttleSendMessageRead = _.debounce(chatForThrottle, 1000, {
    leading: true,
    trailing: false,
  });

  // TODO: This is the first sprite to be inserted into the new game!
  //       Use this as an example/template!
  function castSpell() {
    if (playerObject.activeSpell === 'writeMessage') {
      const newHadronId = crypto.randomUUID();
      const message = prompt('please type some shit');
      hadrons.set(newHadronId, {
        id: newHadronId,
        owner: playerObject.playerId,
        sprite: playerObject.activeSpell,
        x: playerObject.player.x,
        y: playerObject.player.y,
        direction: 'up',
        scene: sceneName,
        velocityX: 0,
        velocityY: 0,
        message,
      });
    } else {
      const direction = playerObject.playerDirection;
      const velocity = 150; // TODO: Should be set "per spell"
      // TODO: Should the velocity be ADDED to the player's current velocity?
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

      // TODO: Using a different spell is more than just a matter of changing the sprite,
      //       but that is what we have here for now.
      // TODO: Each spell should have an entire description in some sort of spells file.
      const newHadronId = crypto.randomUUID();
      hadrons.set(newHadronId, {
        id: newHadronId, // TODO: Make a hadron creator, used by client and server, that ensures this is added.
        owner: playerObject.playerId,
        sprite: playerObject.activeSpell, // TODO: Use the spell's sprite setting, not just the spell name as the sprite.
        x: playerObject.player.x,
        y: playerObject.player.y,
        direction,
        scene: sceneName,
        velocityX,
        velocityY,
        // hideWhenLeavingScene: true, // TODO: Implement this.
        // destroyWhenLeavingScene: true, // TODO: Implement this.
        // destroyOnDisconnect: true, // TODO: Implement this.
        // transferOwnershipWhenLeavingScene: false, // TODO: Implement this.
      });
    }
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

    // Send currently active Spell with space bar
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
    // TODO: Would it be more efficient to use collisions to do this instead?
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

  function updatePlayerSpriteAnimation() {
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
    teleportLayerName,
    teleportLayer,
  }) {
    if (obstacleSpriteKey === playerObject.playerId) {
      // Ignore things that I created that hit myself. For now.
      // Because of how things spawn, they all hit me when launched,
      // so if we want to do otherwise we have more work to do.
      if (hadrons.get(spriteKey)?.message) {
        currentMessage = hadrons.get(spriteKey).message;
        throttleSendMessageRead();
      }
      return;
      // TODO: At some point these will matter, such as if I make a boss that shoots at me.
    }
    if (obstacleLayer) {
      // for now despawning silently if we hit a "layer"
      // TODO: More sophisticated collision detection. i.e. Maybe fireballs cross over water?
      deletedHadronList.push(spriteKey);
      sendDataToServer.destroyHadron(spriteKey);
      hadrons.delete(spriteKey);
    } else if (teleportLayer) {
      // for now despawning silently if we hit a "teleport layer"
      deletedHadronList.push(spriteKey);
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
      if (hadrons.get(spriteKey)?.message) {
        currentMessage = hadrons.get(spriteKey).message;
        throttleSendMessageRead();
      } else {
        deletedHadronList.push(spriteKey);
        sendDataToServer.destroyHadron(spriteKey);
        hadrons.delete(spriteKey);
        sendDataToServer.makePlayerSayOff(obstacleSpriteKey);
      }
    } else if (obstacleSpriteKey) {
      // Any sprite collision that wasn't a player
      // TODO: Obviously this needs to be more sophisticated.
      deletedHadronList.push(spriteKey);
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
    // If no `sprite` key is given, no sprite is displayed.
    // This also prevents race conditions with remote players during reload
    // If a remote player changes their sprite, we won't know about it,
    //       although currently they have to disconnect to do this, so
    //       the game piece is removed and resent anyway.

    // Add new Sprites for new hadrons.
    if (!clientSprites.has(key)) {
      // Add new sprites to the scene
      const newClientSprite = {};

      newClientSprite.spriteData = getSpriteData(hadron.sprite);

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
          newClientSprite.spriteData = newSprite;
        }
      }

      newClientSprite.sprite = this.physics.add
        .sprite(hadron.x, hadron.y, newClientSprite.spriteData.name)
        .setSize(
          newClientSprite.spriteData.physicsSize.x,
          newClientSprite.spriteData.physicsSize.y,
        )
        .setDisplaySize(
          newClientSprite.spriteData.displayHeight,
          newClientSprite.spriteData.displayWidth,
        );

      if (
        hadron.owner === playerObject.playerId &&
        key !== playerObject.playerId
      ) {
        // Track collisions for owned sprites.

        // Collisions with tilemap collisionLayer layer
        this.physics.add.collider(
          newClientSprite.sprite,
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

        // Collisions with tilemap teleport layers
        teleportLayersColliders.forEach((layer) => {
          this.physics.add.collider(
            newClientSprite.sprite,
            layer,
            (sprite, obstacle) => {
              spriteCollisionHandler({
                spriteKey: key,
                sprite,
                teleportLayerName: layer.name,
                teleportLayer: obstacle,
              });
            },
          );
        });

        // Collisions with other sprites
        clientSprites.forEach((otherSprite, otherSpriteKey) => {
          if (otherSprite.sprite) {
            this.physics.add.collider(
              newClientSprite.sprite,
              otherSprite.sprite,
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
        });

        // Set velocity on owned sprites
        newClientSprite.sprite.body.setVelocityX(hadron.velocityX);
        newClientSprite.sprite.body.setVelocityY(hadron.velocityY);
      }

      // Set the "shadow" of my own player to black.
      if (key === playerObject.playerId) {
        newClientSprite.sprite.tint = 0x000000;
      }

      // Some sprites don't line up well with their physics object,
      // so this allows for offsetting that in the config.
      if (newClientSprite.spriteData.physicsOffset) {
        newClientSprite.sprite.body.setOffset(
          newClientSprite.spriteData.physicsOffset.x,
          newClientSprite.spriteData.physicsOffset.y,
        );
      }

      clientSprites.set(key, newClientSprite);
    }
  }

  function updateHadrons() {
    // Deal with game pieces from server.
    const activeObjectList = new Map();

    hadrons.forEach((hadron, key) => {
      // Sometimes a game piece is not something we can use
      if (validateHadronData(hadron, key)) {
        activeObjectList.set(key, '');

        // Only render game pieces for THIS scene
        if (hadron.scene === sceneName) {
          // This is used for debugging
          renderDebugDotTrails(hadron, key);

          // This will add the sprite if it doesn't exist,
          // and do nothing if it does.
          addNewSprites.call(this, hadron, key);
          // Now we know that we have a sprite.
          const clientSprite = clientSprites.get(key);

          // Sometimes they go inactive.
          clientSprite.sprite.active = true;

          // SET SPRITE ROTATION BASED ON HADRON DATA
          // Use Hadron direction to set sprite rotation or flip it
          if (clientSprite.spriteData.rotatable) {
            // Rotate hadron to face requested direction.
            if (hadron.direction === 'left' || hadron.direction === 'west') {
              clientSprite.sprite.setAngle(180);
            } else if (
              hadron.direction === 'right' ||
              hadron.direction === 'east'
            ) {
              clientSprite.sprite.setAngle(0);
            } else if (
              hadron.direction === 'up' ||
              hadron.direction === 'north'
            ) {
              clientSprite.sprite.setAngle(-90);
            } else if (
              hadron.direction === 'down' ||
              hadron.direction === 'south'
            ) {
              clientSprite.sprite.setAngle(90);
            }
          } else if (
            hadron.direction === 'left' ||
            hadron.direction === 'west'
          ) {
            // For non rotatable sprites, only flip them for left/right
            clientSprite.sprite.setFlipX(
              clientSprite.spriteData.faces === 'right',
            );
          } else if (
            hadron.direction === 'right' ||
            hadron.direction === 'east'
          ) {
            clientSprite.sprite.setFlipX(
              clientSprite.spriteData.faces === 'left',
            );
          }

          // SET SPRITE ANIMATION BASED ON HADRON DATA
          // The only way to know if the remote item is in motion is for the server to tell us
          //       We cannot divine it, because the local tick is always faster than the server update.
          // This only matters in that we like to animate the sprite when it is "in motion", but not when it is still,
          // i.e. when a user is "walking", even into a wall, it is nice to see it animated, to indicate it is walking.
          let objectInMotion = true; // Default to animate if server does not tell us otherwise.
          if (hadron.moving === false) {
            objectInMotion = false;
          }
          if (!objectInMotion) {
            clientSprite.sprite.anims.stop();
          } else if (
            clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${clientSprite.spriteData.name}-move-left`,
            ) &&
            (hadron.direction === 'left' || hadron.direction === 'west')
          ) {
            clientSprite.sprite.anims.play(
              `${clientSprite.spriteData.name}-move-left`,
              true,
            );
          } else if (
            clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${clientSprite.spriteData.name}-move-right`,
            ) &&
            (hadron.direction === 'right' || hadron.direction === 'east')
          ) {
            clientSprite.sprite.anims.play(
              `${clientSprite.spriteData.name}-move-right`,
              true,
            );
          } else if (
            clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${clientSprite.spriteData.name}-move-back`,
            ) &&
            (hadron.direction === 'up' || hadron.direction === 'north')
          ) {
            clientSprite.sprite.anims.play(
              `${clientSprite.spriteData.name}-move-back`,
              true,
            );
          } else if (
            clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${clientSprite.spriteData.name}-move-front`,
            ) &&
            (hadron.direction === 'down' || hadron.direction === 'south')
          ) {
            clientSprite.sprite.anims.play(
              `${clientSprite.spriteData.name}-move-front`,
              true,
            );
          } else if (
            clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
              `${clientSprite.spriteData.name}-move-stationary`,
            )
          ) {
            clientSprite.sprite.anims.play(
              `${clientSprite.spriteData.name}-move-stationary`,
              true,
            );
          }

          // PERFORM EASING ON HADRONS BEING CONTROLLED BY OTHER PLAYERS
          // i.e. If the hadron is ours, we set velocities, and that does this for us,
          // but if we are just updating x/y positions, we need this to make it smooth.
          // Easing demonstrations:
          // https://labs.phaser.io/edit.html?src=src\tweens\ease%20equations.js
          // Only do this for other player's objects, and my shadow.
          if (
            hadron.owner !== playerObject.playerId ||
            key === playerObject.playerId
          ) {
            this.tweens.add({
              targets: clientSprite.sprite,
              x: hadron.x,
              y: hadron.y,
              duration: 1, // Adjust this to be smooth without being too slow.
              ease: 'Linear', // Anything else is wonky when tracking server updates.
            });
          }
        } else if (clientSprites.has(key)) {
          const clientSprite = clientSprites.get(key);

          // Destroy any sprites left over from incorrect scenes
          if (clientSprite.sprite) {
            clientSprite.sprite.destroy();
          }
          // and wipe their data so we do not see it anymore.
          clientSprites.delete(key);
        }

        // SEND HADRON DATA TO THE SERVER
        // We skip our own player, because it has special requirements.
        if (
          hadron.owner === playerObject.playerId &&
          key !== playerObject.playerId
        ) {
          // Update all data on owned hadrons.
          const newHadronData = { ...hadron };

          // Obviously we can only update the x/y position IF we are tracking a sprite for this hadron,
          // which, for instance, doesn't happen if the hadron is in another scene.
          if (clientSprites.has(key)) {
            const clientSprite = clientSprites.get(key);
            if (clientSprite.sprite) {
              newHadronData.x = clientSprite.sprite.x;
              newHadronData.y = clientSprite.sprite.y;
            }
          }

          hadrons.set(key, newHadronData);

          // Send owned hadron data to server.
          sendDataToServer.hadronData(key);
        }
      }
    });
    return activeObjectList;
  }

  function removeDeSpawnedObjects(activeObjectList) {
    // Remove de-spawned objects
    clientSprites.forEach((clientSprite, key) => {
      if (!activeObjectList.has(key)) {
        if (clientSprite.sprite) {
          clientSprite.sprite.destroy();
        }
        clientSprites.delete(key);
      }
    });
  }

  // eslint-disable-next-line func-names
  scene.create = function () {
    // Runs once, after all assets in preload are loaded

    if (!didThisOnce && !playerObject.disableSound) {
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
    sceneTileSet = map.addTilesetImage(tileSet.name, `${tileSet.name}-tiles`);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    map.createLayer('Ground', sceneTileSet, 0, 0);
    map.createLayer('Stuff on the Ground You Can Walk On', sceneTileSet, 0, 0);

    // We collide with EVERYTHING in this layer. Collision isn't based on tiles themselves,
    // but the layer they are in.
    collisionLayer = map
      .createLayer('Stuff You Run Into', sceneTileSet, 0, 0)
      .setCollisionByExclusion([-1]);
    let waterLayer;
    if (checkIfLayerExists('Water')) {
      waterLayer = map
        .createLayer('Water', sceneTileSet, 0, 0)
        .setCollisionByExclusion([-1]);
    }
    const overheadLayer = map.createLayer(
      'Stuff You Walk Under',
      sceneTileSet,
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
      )
      .setDisplaySize(
        playerObject.spriteData.displayHeight,
        playerObject.spriteData.displayWidth,
      );

    playerObject.player.setDepth(1);

    if (playerObject.spriteData.physicsOffset) {
      playerObject.player.body.setOffset(
        playerObject.spriteData.physicsOffset.x,
        playerObject.spriteData.physicsOffset.y,
      );
    }

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
        teleportLayersColliders.set(
          layer.name,
          map
            .createLayer(layer.name, sceneTileSet, 0, 0)
            .setCollisionByExclusion([-1]),
        );
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

    updatePlayerSpriteAnimation();

    const activeObjectList = updateHadrons.call(this);

    // Send Player data, which is unique
    sendDataToServer.playerData({
      sceneName,
    });

    removeDeSpawnedObjects(activeObjectList);

    updateInGameDomElements(htmlElementParameters);
  };

  return scene;
};

export default sceneFactory;
