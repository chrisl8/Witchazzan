/* globals window:true */
/* globals localStorage:true */
import Phaser from 'phaser';
import playerObject from '../objects/playerObject.js';
import textObject from '../objects/textObject.js';
import handleKeyboardInput from '../handleKeyboardInput.js';
import updateInGameDomElements from '../updateInGameDomElements.js';
import sendDataToServer from '../sendDataToServer.js';
import spriteSheetList from '../objects/spriteSheetList.js';
import hadrons from '../objects/hadrons.js';
import clientSprites from '../objects/clientSprites.js';
import getSpriteData from '../utilities/getSpriteData.js';
import castSpell from '../castSpell.js';
import spriteCollisionHandler from '../spriteCollisionHandler.js';

// Example of adding sound.
import sunriseMp3 from '../assets/sounds/sunrise.mp3';
import sunriseOgg from '../assets/sounds/sunrise.ogg';
import closeChatInputBox from '../closeChatInputBox.js';

let didThisOnce = false; // For the sound example.

/**
 * @name sceneFactory
 * @type {function({sceneName?: String, tileMap?: JSON, tileSet: Object, gameSize: Object, htmlElementParameters?: Object}): Phaser.Scene}
 */
const sceneFactory = ({
  sceneName, // Every scene needs a name
  tileMap, // The tileMap is the layout of the tiles as set in Tiled.
  tileSet, // An object containing the actual image and the name to reference it by
  gameSize, // In theory we could make a map that is bigger than the screen, although that would need testing.
  htmlElementParameters = {},
}) => {
  const scene = new Phaser.Scene(sceneName);
  let map;
  let sceneTileSet;
  let collisionLayer;
  const teleportLayersColliders = new Map();

  // eslint-disable-next-line func-names
  scene.preload = function () {
    sendDataToServer.enterScene(sceneName);
    console.log(`Entering scene ${sceneName}`);

    // Display Tile Map's welcome message
    if (
      tileMap &&
      tileMap.hasOwnProperty('properties') &&
      Array.isArray(tileMap.properties)
    ) {
      const welcomeMessageIndex = tileMap.properties.findIndex(
        (x) => x.name === 'EntranceMessage',
      );
      if (welcomeMessageIndex > -1) {
        textObject.enterSceneText.text =
          tileMap.properties[welcomeMessageIndex].value;
        textObject.enterSceneText.display();
      } else {
        textObject.enterSceneText.text = '';
      }
    } else {
      textObject.enterSceneText.text = '';
    }

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
    if (
      !playerObject.teleportInProgress &&
      destinationSceneName !== sceneName
    ) {
      playerObject.teleportInProgress = true;
      closeChatInputBox();
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

  function playerTeleportOverlapHandler(sprite, tile) {
    if (Array.isArray(tile.layer.properties)) {
      let destinationSceneName;
      let destinationSceneEntrance = null;
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
      if (destinationSceneName) {
        cleanUpSceneAndTeleport.call(
          this,
          destinationSceneName,
          destinationSceneEntrance,
        );
      }
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

  function hotKeyHandler() {
    // Return to intro text
    if (playerObject.keyState.p === 'keydown') {
      playerObject.keyState.p = null;
      returnToIntroScreen();
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

    // Send currently active Spell with space bar,
    // or touch input set by "sendSpell" on playerObject.
    if (
      playerObject.keyState[' '] === 'keydown' ||
      playerObject.sendSpell === true
    ) {
      playerObject.sendSpell = false;
      playerObject.keyState[' '] = null;
      castSpell(sceneName);
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

      // NOTE: If you are getting the error:
      //        Uncaught TypeError: Cannot set properties of null (setting '4')
      // when you try to teleport with dot trails on, this will fix it, BUT
      // the cause is that you are running this after a scene was closed,
      // so try to sort out why you have your teleports out of order before
      // engaging this code.
      // if (
      //   playerObject.dotTrailRenderTexture &&
      //   !playerObject.dotTrailRenderTexture.scene
      // ) {
      //   console.log(
      //     'renderDebugDotTrails-!scene',
      //     playerObject.dotTrailRenderTexture,
      //   );
      //   playerObject.dotTrailRenderTexture.destroy();
      //   console.log(
      //     'renderDebugDotTrails-!scene',
      //     playerObject.dotTrailRenderTexture,
      //   );
      //   playerObject.dotTrailRenderTexture = null;
      //   console.log(
      //     'renderDebugDotTrails-!scene',
      //     playerObject.dotTrailRenderTexture,
      //   );
      // }

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
      if (['carrot'].indexOf(hadron.typ) > -1) {
        fillColor = 0x0000ff;
        width = 5;
        height = 5;
      } else if (['slime'].indexOf(hadron.typ) > -1) {
        fillColor = 0xff0000;
      } else if (['fireball'].indexOf(hadron.typ) > -1) {
        fillColor = 0xffa500;
      } else if (['teleball'].indexOf(hadron.typ) > -1) {
        fillColor = 0xffa500;
      } else if (['push'].indexOf(hadron.typ) > -1) {
        fillColor = 0xffa500;
      } else if (key === playerObject.playerId) {
        // it me
        fillColor = 0x00a500;
      } else if (['player'].indexOf(hadron.typ) > -1) {
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

  function addAndUpdateSprites(hadron, key) {
    // If a remote player changes their sprite, we won't know about it,
    //       although currently they have to disconnect to do this, so
    //       the hadron is removed and resent anyway.

    // Add new Sprites for new hadrons.
    if (!clientSprites.has(key)) {
      // Add new sprites to the scene
      const newClientSprite = {};

      newClientSprite.spriteData = getSpriteData(hadron.sprt);

      // Use different carrot colors for different genetic code
      // TODO: Delete this or make some use of it.
      if (hadron.typ === 'carrot') {
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
          newClientSprite.spriteData.displayWidth,
          newClientSprite.spriteData.displayHeight,
        );

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

    // Additional features for owned sprites,
    // which can be transferred to us,
    // even if the sprite already existed as a non-owned sprite before.
    if (
      // It should exist now, even if it didn't before.
      clientSprites.has(key) &&
      // We control it.
      hadron.ctrl === playerObject.playerId &&
      // But it isn't our shadow.
      key !== playerObject.playerId
    ) {
      // If we had a sprite before, but we didn't own it,
      // and it was transferred to us, the sprite exists,
      // but it doesn't have a collider or velocity yet.
      // I think the only way to track that is manually.

      /* TRACK COLLISIONS FOR OWNED SPRITES. */

      if (!clientSprites.get(key).staticCollisionsSet) {
        clientSprites.get(key).staticCollisionsSet = true;

        // Collisions with tilemap collisionLayer layer
        this.physics.add.collider(
          clientSprites.get(key).sprite,
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
            clientSprites.get(key).sprite,
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
      }

      // COLLISIONS WITH OTHER SPRITES
      // Other sprites come and go, so we need to check and update colliders with them on every update, or at least when we get new hadrons.
      // Note that we use overlap, not collide here. This does a couple of things:
      // 1. A collide will have a physics affect that we don't actually want (the player object, for instance, is controlled directly so bumping it around just causes visual glitches).
      // 2. By waiting for a full overlap before registering, it looks better to other players, who tend to see
      //    the sprite deleted before they see it overlap the obstacle (We could add some sort of "animate one more frame" logic, but for now ths is it.)
      // In the future we could perhaps have a key on the hadron that determines whether we use overlap or collide
      // for a given object.
      clientSprites.forEach((otherSprite, otherSpriteKey) => {
        // Don't add a collider with ourself.
        if (otherSpriteKey !== key) {
          if (!otherSprite.colliders) {
            // eslint-disable-next-line no-param-reassign
            otherSprite.colliders = {};
          }
          // Add new ones
          if (otherSprite.sprite && !otherSprite.colliders[key]) {
            // eslint-disable-next-line no-param-reassign
            otherSprite.colliders[key] = this.physics.add.overlap(
              clientSprites.get(key).sprite,
              otherSprite.sprite,
              (sprite, obstacle) => {
                spriteCollisionHandler.call(this, {
                  spriteKey: key,
                  sprite,
                  obstacleSpriteKey: otherSpriteKey,
                  obstacleSprite: obstacle,
                });
              },
            );
          }
        }
      });

      /* SET VELOCITY ON OWNED SPRITES */
      if (!clientSprites.get(key).velocitySet) {
        clientSprites.get(key).velocitySet = true;
        clientSprites.get(key).sprite.body.setVelocityX(hadron.velX);
        clientSprites.get(key).sprite.body.setVelocityY(hadron.velY);
      }
    }
  }

  function updateHadrons() {
    // Deal with game pieces from server.

    hadrons.forEach((hadron, key) => {
      // Only render hadrons for THIS scene
      if (hadron.scn === sceneName) {
        // This is used for debugging
        renderDebugDotTrails(hadron, key);

        // This will add the sprite if it doesn't exist,
        // and do nothing if it does.
        addAndUpdateSprites.call(this, hadron, key);
        // Now we know that we have a sprite.
        const clientSprite = clientSprites.get(key);

        // Sometimes they go inactive.
        clientSprite.sprite.active = true;

        // SET SPRITE ROTATION BASED ON HADRON DATA
        // Use Hadron direction to set sprite rotation or flip it
        if (clientSprite.spriteData.rotatable) {
          // Rotate hadron to face requested direction.
          if (hadron.dir === 'left' || hadron.dir === 'west') {
            clientSprite.sprite.setAngle(180);
          } else if (hadron.dir === 'right' || hadron.dir === 'east') {
            clientSprite.sprite.setAngle(0);
          } else if (hadron.dir === 'up' || hadron.dir === 'north') {
            clientSprite.sprite.setAngle(-90);
          } else if (hadron.dir === 'down' || hadron.dir === 'south') {
            clientSprite.sprite.setAngle(90);
          }
        } else if (hadron.dir === 'left' || hadron.dir === 'west') {
          // For non rotatable sprites, only flip them for left/right
          clientSprite.sprite.setFlipX(
            clientSprite.spriteData.faces === 'right',
          );
        } else if (hadron.dir === 'right' || hadron.dir === 'east') {
          clientSprite.sprite.setFlipX(
            clientSprite.spriteData.faces === 'left',
          );
        }

        // SET SPRITE ANIMATION BASED ON HADRON DATA
        // The only way to know if the remote item is in motion is for them to tell us
        //       We cannot divine it, because the local tick is always faster than the server update.
        // This only matters in that we like to animate the sprite when it is "in motion", but not when it is still,
        // i.e. when a user is "walking", even into a wall, it is nice to see it animated, to indicate it is actively walking into the wall.
        let objectInMotion = true; // Default to animate if server does not tell us otherwise.
        if (hadron.mov === false) {
          objectInMotion = false;
        }
        if (!objectInMotion) {
          clientSprite.sprite.anims.stop();
        } else if (
          clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
            `${clientSprite.spriteData.name}-move-left`,
          ) &&
          (hadron.dir === 'left' || hadron.dir === 'west')
        ) {
          clientSprite.sprite.anims.play(
            `${clientSprite.spriteData.name}-move-left`,
            true,
          );
        } else if (
          clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
            `${clientSprite.spriteData.name}-move-right`,
          ) &&
          (hadron.dir === 'right' || hadron.dir === 'east')
        ) {
          clientSprite.sprite.anims.play(
            `${clientSprite.spriteData.name}-move-right`,
            true,
          );
        } else if (
          clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
            `${clientSprite.spriteData.name}-move-back`,
          ) &&
          (hadron.dir === 'up' || hadron.dir === 'north')
        ) {
          clientSprite.sprite.anims.play(
            `${clientSprite.spriteData.name}-move-back`,
            true,
          );
        } else if (
          clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
            `${clientSprite.spriteData.name}-move-front`,
          ) &&
          (hadron.dir === 'down' || hadron.dir === 'south')
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
        // , and my own shadow.
        // If the hadron is ours, we set velocities, and that does this for us,
        // but if we are just updating x/y positions, we need this to make it smooth.
        // Easing demonstrations:
        // https://labs.phaser.io/edit.html?src=src\tweens\ease%20equations.js
        if (
          hadron.ctrl !== playerObject.playerId ||
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

        // SEND HADRON DATA TO THE SERVER
        // We skip our own player, because it has special requirements.
        if (
          // New hadrons that we create have no ctrl yet, only the server assigns that.
          (hadron.ctrl === undefined ||
            hadron.ctrl === playerObject.playerId) &&
          key !== playerObject.playerId
        ) {
          // Update all data on owned hadrons.
          const newHadronData = { ...hadron };

          newHadronData.x = clientSprites.get(key).sprite.x;
          newHadronData.y = clientSprites.get(key).sprite.y;

          // Update hadron data
          hadrons.set(key, newHadronData);

          // Send owned hadron data to server.
          sendDataToServer.hadronData(key);
        }
      } else {
        // We need to wipe our local copy of hadrons that are not in our scene.
        hadrons.delete(key);
        // cleanUpClientSprites() will erase the sprites from these if they existed.
      }
    });
  }

  function cleanUpClientSprites() {
    clientSprites.forEach((clientSprite, key) => {
      // Delete orphaned sprites with no hadron.
      if (!hadrons.has(key)) {
        if (clientSprite.sprite) {
          clientSprite.sprite.destroy();
        }
        clientSprites.delete(key);
        // Clean up dom elements attached to removed sprites
        if (playerObject.domElements.otherPlayerTags[key]) {
          playerObject.domElements.otherPlayerTags[key].remove();
          playerObject.domElements.otherPlayerTags[key] = null;
        }
      } else if (clientSprite.colliders) {
        // Remove any colliders with non-existent hadrons that are gone now.
        for (const [colliderKey] of Object.entries(clientSprite.colliders)) {
          if (!hadrons.has(colliderKey)) {
            // I'm not entirely sure if this works.
            this.physics.world.removeCollider(
              clientSprite.colliders[colliderKey],
            );
            // eslint-disable-next-line no-param-reassign
            delete clientSprite.colliders[colliderKey];
          }
        }
      }
    });
  }

  // INITIAL SCENE SETUP
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

    // MAP
    map = this.make.tilemap({ key: `${sceneName}-map` });

    // Arguments for addTilesetImage are:
    // the name you gave the tileset in Tiled and
    // the key of the tileset image in Phaser's cache (i.e. the name you used in preload)
    sceneTileSet = map.addTilesetImage(tileSet.name, `${tileSet.name}-tiles`);

    // TILEMAP LAYERS

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

    // Teleport Layers
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

    // Allow a scene entrance to specify to carry over the X or Y value from the previous scene so that you can enter at any point along the edge in a wide doorway.
    if (
      spawnPoint &&
      spawnPoint.hasOwnProperty('properties') &&
      playerObject.player &&
      Array.isArray(spawnPoint.properties)
    ) {
      if (
        spawnPoint.properties.find((x) => x.name === 'allowCustomX')?.value &&
        playerObject.player?.x
      ) {
        spawnPoint.x = playerObject.player.x;
      }

      if (
        spawnPoint.properties.find((x) => x.name === 'allowCustomY')?.value &&
        playerObject.player?.y
      ) {
        spawnPoint.y = playerObject.player.y;
      }
    }

    // Use scene from server. Switch to different scene if this is not it
    // NOTE: Remember to do this BEFORE setting the position from the server.
    // HOWEVER: This MUST be done after setCameraZoom, or the scene
    // will load un-zoomed. I'm not sure why.
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
        playerObject.spriteData.displayWidth,
        playerObject.spriteData.displayHeight,
      );

    playerObject.player.setDepth(1);

    if (playerObject.spriteData.physicsOffset) {
      playerObject.player.body.setOffset(
        playerObject.spriteData.physicsOffset.x,
        playerObject.spriteData.physicsOffset.y,
      );
    }

    // COLLISIONS FOR LOCAL PLAYER
    this.physics.add.collider(playerObject.player, collisionLayer);
    if (waterLayer) {
      this.physics.add.collider(playerObject.player, waterLayer);
    }
    teleportLayersColliders.forEach((layer) => {
      this.physics.add.overlap(
        playerObject.player,
        layer,
        playerTeleportOverlapHandler,
        (player, tile) =>
          tile.index !== -1 &&
          Phaser.Math.Distance.Chebyshev(
            player.x,
            player.y,
            tile.pixelX + tile.width / 2,
            tile.pixelY + tile.height / 2,
          ) <=
            tile.width / 2,
        this,
      );
    });

    // This section finds the Objects in the Tilemap that trigger features
    // Useful info on how this works:
    // https://www.html5gamedevs.com/topic/37978-overlapping-on-a-tilemap-object-layer/?do=findComment&comment=216742
    // https://github.com/B3L7/phaser3-tilemap-pack/blob/master/src/scenes/Level.js
    const objects = map.getObjectLayer('Objects');
    objects.objects.forEach((object) => {
      if (object.type === 'SpawnNPC') {
        // This spawns "NPCs" embedded in the tileMap.
        // TODO: There is currently NO accommodation for interacting with these items.
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
        newThing.displayHeight = tile.height;
        newThing.displayWidth = tile.width;
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

    // Essentially announce that the scene is ready.
    playerObject.teleportInProgress = false;
  };

  // GAME LOOP RUN ON EVERY FRAME
  // eslint-disable-next-line func-names
  scene.update = function (time, delta) {
    // Runs once per frame for the duration of the scene

    // TELEPORT?
    // Anything that teleports us needs to run FIRST and then stop the rest of the update process.

    // Do not do ANYTHING while a player is potentially leaving this scene.
    if (playerObject.teleportInProgress) {
      return;
    }

    // teleportToSceneNow is set when a player uses the teleportToScene command in the chat input.
    if (playerObject.teleportToSceneNow) {
      const destinationScene = playerObject.teleportToSceneNow;
      playerObject.teleportToSceneNow = null;
      cleanUpSceneAndTeleport.call(this, destinationScene, null);
      return;
    }

    if (playerObject.keyState.h === 'keydown') {
      playerObject.keyState.h = null;
      if (sceneName !== playerObject.defaultOpeningScene) {
        // Don't teleport here if we ARE here.
        cleanUpSceneAndTeleport.call(
          this,
          playerObject.defaultOpeningScene,
          null,
        );
        return;
      }
    }

    // This is required on every update, in case the user resizes their browser window.
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

    hotKeyHandler.call(this);

    playerObject.scrollingTextBox.sceneUpdate(delta);

    handlePlayerMovement(maxSpeed, useAcceleration);

    updatePlayerSpriteAnimation();

    updateHadrons.call(this);

    // Send Player data, which is unique
    sendDataToServer.playerData({
      sceneName,
    });

    cleanUpClientSprites.call(this);

    updateInGameDomElements(htmlElementParameters);
  };

  return scene;
};

export default sceneFactory;
