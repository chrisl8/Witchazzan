/*
 * The primary game loop is in this file.
 * It works by being run against each scene to generate an "instance" for each scene,
 * hence also being the "Scene Factory".
 *
 * The three pieces of this, that are part of the Phaser library are:
 *
 * Preload - scene.preload
 * Create - scene.create
 * Update - scene.update
 *
 * See https://newdocs.phaser.io/docs/3.55.2/Phaser for help with the Phaser library.
 */

import Phaser from 'phaser';

// Music and sounds
// Notice that Parcel, our bundler, requires this goofy url: format
// and eslint cannot comprehend it either.
// eslint-disable-next-line import/no-unresolved
import sunriseMp3 from 'url:./assets/sounds/sunrise.mp3';
// eslint-disable-next-line import/no-unresolved
import sunriseOgg from 'url:./assets/sounds/sunrise.ogg';

import playerObject from './objects/playerObject.js';
import textObject from './objects/textObject.js';
import handleKeyboardInput from './handleKeyboardInput.js';
import sendDataToServer from './sendDataToServer.js';
import spriteSheetList from './objects/spriteSheetList.js';
import handleKeyboardInput from './handleKeyboardInput.js';
import getSpriteData from './utilities/getSpriteData.js';

// Game Loop Functions
import cleanUpScene from './gameLoopFunctions/cleanUpScene.js';
import cleanUpSceneAndTeleport from './gameLoopFunctions/cleanUpSceneAndTeleport.js';
import playerTeleportOverlapHandler from './gameLoopFunctions/playerTeleportOverlapHandler.js';
import cleanUpClientSprites from './gameLoopFunctions/cleanUpClientSprites.js';
import updateInGameDomElements from './gameLoopFunctions/updateInGameDomElements.js';
import setCameraZoom from './gameLoopFunctions/setCameraZoom.js';
import hotKeyHandler from './gameLoopFunctions/hotKeyHandler.js';
import handlePlayerMovement from './gameLoopFunctions/handlePlayerMovement.js';
import checkIfLayerExists from './gameLoopFunctions/checkIfLayerExists.js';
import updatePlayerSpriteAnimation from './gameLoopFunctions/updatePlayerSpriteAnimation.js';
import updateHadrons from './gameLoopFunctions/updateHadrons.js';

// Example of adding sound.
import sunriseMp3 from './assets/sounds/sunrise.mp3';
import sunriseOgg from './assets/sounds/sunrise.ogg';
import convertTileMapPropertyArrayToObject from './utilities/convertTileMapPropertyArrayToObject.js';

let didThisOnce = false; // For the sound example.

/**
 * @name gameLoopAndSceneFactory
 * @type {function({sceneName?: String, tileMap?: JSON, tileSet: Object, gameSize: Object, htmlElementParameters?: Object}): Phaser.Scene}
 */
const gameLoopAndSceneFactory = ({
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

  // SCENE PRE-LOAD SETUP
  // ** This should ONLY BE USED TO LOAD ASSETS! **
  // This is run every time the scene is entered or re-entered.
  // Any scene startup logic should be in scene.create found further down.
  // eslint-disable-next-line func-names
  scene.preload = function () {
    // Runs once, loads up assets like images and audio
    // ** This should ONLY BE USED TO LOAD ASSETS! **
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

  // INITIAL SCENE SETUP
  // This is ALSO run every time the scene is entered or re-entered.
  // Place any scene startup logic that you need in here.
  // eslint-disable-next-line func-names
  scene.create = function () {
    // Runs once, after all assets in preload are loaded

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
    if (checkIfLayerExists('Water', map)) {
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
            .createLayer(
              layer.name,
              playerObject.disableCameraZoom ? sceneTileSet : null,
              0,
              0,
            )
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
        (sprite, tile) => {
          playerTeleportOverlapHandler.call(this, sprite, tile, sceneName);
        },
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
        // "SpawnNPC" is a left over from the old version.
        // TODO: Come up with a better "type" for these and update them all.
        // This spawns sprites embedded in the tileMap.
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
      } else if (object.type === 'NPC') {
        // Type "NPC" will be used for actual NPCs.
        const objectProperties = convertTileMapPropertyArrayToObject(object);
        console.log(object);
        console.log(objectProperties);
        const spriteData = getSpriteData(objectProperties.sprite);
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
        if (objectProperties.initialSpriteRotation) {
          newThing.setAngle(objectProperties.initialSpriteRotation);
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
    setCameraZoom.call(this, gameSize, sceneTileSet);

    // TODO: Delete this line once we are sure it is not needed.
    //       It was used to set a variable ages ago, but then the variable was removed, so it seems to do nothing.
    // playerObject.player.body.velocity.clone();

    // Handles all keyboard input other than player movement.
    hotKeyHandler.call(this, sceneName);

    playerObject.scrollingTextBox.sceneUpdate(delta);

    handlePlayerMovement();

    updatePlayerSpriteAnimation();

    updateHadrons.call(
      this,
      sceneName,
      scene,
      collisionLayer,
      teleportLayersColliders,
    );

    // Send Player data, which is unique
    sendDataToServer.playerData({
      sceneName,
    });

    cleanUpClientSprites.call(this);

    updateInGameDomElements(htmlElementParameters);
  };

  return scene;
};

export default gameLoopAndSceneFactory;
