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
// NOTE that the 'url:' text in front tells Parcel to assign the URL of this asset to the variable instead of the contents.
// eslint-disable-next-line import/no-unresolved
import sunriseMp3 from 'url:../../assets/sounds/sunrise.mp3';
// eslint-disable-next-line import/no-unresolved
import sunriseOgg from 'url:../../assets/sounds/sunrise.ogg';

// Bitmap fonts
// NOTE that the 'url:' text in front tells Parcel to assign the URL of this asset to the variable instead of the contents.
// eslint-disable-next-line import/no-unresolved
import atariSunsetXml from 'url:../../assets/fonts/atari-sunset.xml';
import atariSunsetPng from '../../assets/fonts/atari-sunset.png';

import playerObject from './objects/playerObject.js';
import textObject from './objects/textObject.js';
import sendDataToServer from './sendDataToServer.js';
import spriteSheetList from './objects/spriteSheetList.js';
import handleKeyboardInput from './handleKeyboardInput.js';
import getSpriteData from './utilities/getSpriteData.js';
import objectDepthSettings from './objects/objectDepthSettings.js';
import debugLog from './utilities/debugLog.js';

// Game Loop Functions
import cleanUpScene from './gameLoopFunctions/cleanUpScene.js';
import cleanUpSceneAndTeleport from './gameLoopFunctions/cleanUpSceneAndTeleport.js';
import playerTeleportOverlapHandler from './gameLoopFunctions/playerTeleportOverlapHandler.js';
import cleanUpClientSprites from './gameLoopFunctions/cleanUpClientSprites.js';
import updateInGameDomElements from './gameLoopFunctions/updateInGameDomElements.js';
import collectKeyboardInput from './gameLoopFunctions/collectKeyboardInput.js';
import handlePlayerMovement from './gameLoopFunctions/handlePlayerMovement.js';
import checkIfLayerExists from './gameLoopFunctions/checkIfLayerExists.js';
import updatePlayerSpriteAnimation from './gameLoopFunctions/updatePlayerSpriteAnimation.js';
import updateHadrons from './gameLoopFunctions/updateHadrons.js';
import npcBehavior from './gameLoopFunctions/npcBehavior.js';
import specialPlayerActions from './gameLoopFunctions/specialPlayerActions.js';
import overlayTilemapTilesWithAnimatedSprites from './overlayTilemapTilesWithAnimatedSprites.js';
import loadTesting from './gameLoopFunctions/loadTesting.js';
import loadingInfo from './gameLoopFunctions/loadingInfo.js';
import addQuarksFromMap from './gameLoopFunctions/addQuarksFromMap.js';
import handlePlayerRaycast from './gameLoopFunctions/handlePlayerRaycast.js';
import handlePlayerInteraction from './gameLoopFunctions/handlePlayerInteraction.js';
import itemBehavior from './gameLoopFunctions/itemBehavior.js';
import barricades from './gameLoopFunctions/barricades.js';

// Texture atlases
import textureAtlasOneJson from '../../assets/textureAtlasOne.json';
import textureAtlasOnePng from '../../assets/textureAtlasOne.png';
import getSpawnPointFromMap from './utilities/getSpawnPointFromMap.js';

let didThisOnce = false; // For the sound example.

/**
 * @name gameLoopAndSceneFactory
 * @type {function({sceneName?: String, tileMap?: JSON, tileSet: Object, gameSize: Object, htmlElementParameters?: Object}): Phaser.Scene}
 */
const gameLoopAndSceneFactory = ({
  sceneName, // Every scene needs a name
  tileMap, // The tileMap is the layout of the tiles as set in Tiled.
  tileSet, // An object containing the actual image and the name to reference it by
  gameSize, // In theory, we could make a map that is bigger than the screen, although that would need testing.
  htmlElementParameters = {},
  animatedTileOverlayStrategy,
}) => {
  const scene = new Phaser.Scene(sceneName);
  let map;
  let sceneTileSet;
  let collisionLayer;
  let waterLayer;
  const teleportLayersColliders = new Map();
  const gameSizeData = { ...gameSize };
  gameSizeData.fullWidth = gameSize.width + gameSize.teleportLayerSize * 2;
  gameSizeData.widthPadding = gameSizeData.fullWidth * 0.1;
  gameSizeData.fullHeight = gameSize.height + gameSize.teleportLayerSize * 2;
  gameSizeData.heightPadding = gameSizeData.fullHeight * 0.1;

  // SCENE PRE-LOAD SETUP
  // ** This should ONLY BE USED TO LOAD ASSETS! **
  // This is run every time the scene is entered or re-entered.
  // However, any scene startup logic should be in scene.create found further down.
  // eslint-disable-next-line func-names
  scene.preload = function () {
    // Runs once, loads up assets like images and audio
    // ** This should ONLY BE USED TO LOAD ASSETS! **

    if (sceneName === 'Loading') {
      loadingInfo.call(this);
    }

    // All of these text based "keys" are basically global variables in Phaser.
    // You can reuse the same name, but phaser will just reuse the first thing you
    // assigned to it.
    // NOTE: This also means we are not wasting memory by loading the same tileSet over and over,
    // because phaser just overwrites them.
    if (!scene.textures.exists(`${tileSet.name}-tiles`)) {
      this.load.image(`${tileSet.name}-tiles`, tileSet.image);
    }
    // NOTE: The key must be different for each tilemap,
    // otherwise Phaser will get confused and reuse the same tilemap
    // even though you think you loaded another one.
    // https://www.html5gamedevs.com/topic/40710-how-do-i-load-a-new-scene-with-phaser-3-and-webpack/
    if (!scene.cache.tilemap.has(`${sceneName}-map`)) {
      this.load.tilemapTiledJSON(`${sceneName}-map`, tileMap);
    }

    // Load Texture Atlases
    if (!this.textures.exists('atlasOne')) {
      this.load.atlas('atlasOne', textureAtlasOnePng, textureAtlasOneJson);
    }

    // Load Sounds
    if (!scene.cache.audio.has('sunrise')) {
      this.load.audio('sunrise', [sunriseOgg, sunriseMp3]);
    }

    // Load Bitmap Fonts
    if (!scene.cache.bitmapFont.has('atariSunset')) {
      this.load.bitmapFont('atariSunset', atariSunsetPng, atariSunsetXml);
    }
  };

  // INITIAL SCENE SETUP
  // This is ALSO run every time the scene is entered or re-entered.
  // Place any scene startup logic that you need in here.
  // eslint-disable-next-line func-names
  scene.create = function () {
    // Runs once, after all assets in preload are loaded

    // Use scene from server. Switch to different scene if this is not it
    // NOTE: Remember to do this BEFORE setting the position from the server.
    if (!playerObject.initialSceneFromServerAlreadyUsed) {
      playerObject.initialSceneFromServerAlreadyUsed = true;
      if (playerObject.initialScene !== sceneName) {
        cleanUpScene(playerObject.initialScene);
        this.scene.start(playerObject.initialScene);
        return; // We left this scene, we do not need to continue creating it now.
      }
    }

    sendDataToServer.enterScene(sceneName);
    debugLog(`Entering scene ${sceneName}`);

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
    if (sceneName === 'EmptyCave' && playerObject.health <= 0) {
      textObject.enterSceneText.text = 'you were damaged, let us heal you';
    }
    if (!didThisOnce && !playerObject.disableSound) {
      didThisOnce = true; // So it doesn't get annoying . . . more annoying.
      this.sound.play('sunrise');
    }

    // The sprites can be added in the preload phase above,
    // but the animations have to be added in the create phase.
    spriteSheetList.forEach((spriteSheet) => {
      if (spriteSheet.animations) {
        if (!this.textures.exists(spriteSheet.name)) {
          this.textures.addSpriteSheetFromAtlas(spriteSheet.name, {
            atlas: 'atlasOne',
            frame: spriteSheet.name,
            frameWidth: spriteSheet.frameWidth,
            frameHeight: spriteSheet.frameHeight,
            // endFrame: animation.end,
          });
        }
        spriteSheet.animations.forEach((animation) => {
          if (!this.anims.exists(`${spriteSheet.name}-${animation.keyName}`)) {
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
              repeatDelay: animation.repeatDelay,
            });
          }
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
    map
      .createLayer('Ground', sceneTileSet, 0, 0)
      .setDepth(objectDepthSettings.tileMapLayers.Ground);
    map
      .createLayer('Stuff on the Ground You Can Walk On', sceneTileSet, 0, 0)
      .setDepth(
        objectDepthSettings.tileMapLayers[
          'Stuff on the Ground You Can Walk On'
        ],
      );

    // We collide with EVERYTHING in this layer. Collision isn't based on tiles themselves,
    // but the layer they are in.
    collisionLayer = map
      .createLayer('Stuff You Run Into', sceneTileSet, 0, 0)
      .setCollisionByExclusion([-1])
      .setDepth(objectDepthSettings.tileMapLayers['Stuff You Run Into']);
    if (checkIfLayerExists('Water', map)) {
      waterLayer = map
        .createLayer('Water', sceneTileSet, 0, 0)
        .setCollisionByExclusion([-1])
        .setDepth(objectDepthSettings.tileMapLayers.Water);
    }
    map
      .createLayer('Stuff You Walk Under', sceneTileSet, 0, 0)
      .setDepth(objectDepthSettings.tileMapLayers['Stuff You Walk Under']);

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

    let spawnPoint;
    if (playerObject.destinationEntrance === 'PreviousPosition') {
      spawnPoint = {
        x: playerObject.destinationX,
        y: playerObject.destinationY,
      };
    } else {
      spawnPoint = getSpawnPointFromMap(map, playerObject.destinationEntrance);
    }

    // TODO: Library scenes
    //       - Need option for deleting deletable Items (trash can)
    //       - Should have slots for spells
    //       - Should have "equip-able" slot(s)

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
        debugLog(
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

    playerObject.player.setDepth(objectDepthSettings.player);

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
          playerTeleportOverlapHandler.call(this, sprite, tile, sceneName, map);
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

    addQuarksFromMap.call(this, map, sceneName);

    if (animatedTileOverlayStrategy) {
      overlayTilemapTilesWithAnimatedSprites.call(
        this,
        map,
        gameSize,
        animatedTileOverlayStrategy,
      );
    }

    // Globally send all keyboard input to the keyboard input handler
    this.input.keyboard.on('keydown', handleKeyboardInput);
    this.input.keyboard.on('keyup', handleKeyboardInput);

    // Tell phaser what the size of the game is,
    // because not every scene is the same size, nor needs to be.
    this.scale.setGameSize(gameSize.width, gameSize.height);

    // Move the teleport area off camera
    this.cameras.main
      .setBounds(
        gameSize.teleportLayerSize,
        gameSize.teleportLayerSize,
        gameSize.width,
        gameSize.height,
      )
      .setOrigin(0.5, 0.5);

    // Set up raycaster
    this.raycaster = this.raycasterPlugin.createRaycaster();
    this.raycaster.debugOptions.enabled = playerObject.enableDebug;
    // TODO: If debug is enabled, provide a way to see the stats that raycaster provides.
    //       https://wiserim.github.io/phaser-raycaster/#toc11__anchor
    this.raycaster.mapGameObjects(collisionLayer, false, {
      collisionTiles: collisionLayer.layer.collideIndexes,
    });
    this.raycaster.setBoundingBox(
      gameSize.teleportLayerSize,
      gameSize.teleportLayerSize,
      gameSize.width,
      gameSize.height,
    );

    barricades.call(this, map, gameSize);

    // Essentially announce that the scene is ready.
    playerObject.teleportInProgress = false;
  };

  // GAME LOOP RUN ON EVERY FRAME
  // eslint-disable-next-line func-names
  scene.update = function (time, delta) {
    // Runs once per frame for the duration of the scene

    // ALREADY TELEPORTING? - Do not do ANYTHING while a player is potentially leaving this scene.
    if (playerObject.teleportInProgress) {
      return;
    }

    if (playerObject.testNow) {
      playerObject.testNow = false;
      // Used for testing stuff.
    }

    if (playerObject.importantItemsUpdated) {
      playerObject.importantItemsUpdated = false;
      barricades.call(this, map, gameSize);
    }

    // Used for placing DOM elements in the correct location relevant to the game elements.
    // Does not work to set it in create()
    // Must be updated every frame, in case user changes the browser window size.
    playerObject.cameraScaleFactor = this.scale.displayScale.x;

    // This is used for the thought bubble on the player and such.
    // Does not work to set it in create()
    if (playerObject.cameraOffset.x === 0) {
      playerObject.cameraOffset = {
        x: this.cameras.main.worldView.x,
        y: this.cameras.main.worldView.y,
      };
    }

    /* SPECIAL PLAYER ACTIONS */
    // This function handles stuff like
    //  - updating player health bar
    //  - automatic teleports when dead,
    //  - healing when in a certain room,
    // etc.
    specialPlayerActions(sceneName);

    // READY TO TELEPORT?
    // teleportToSceneNow is set when a player uses the teleportToScene command in the chat input.
    if (playerObject.teleportToSceneNow) {
      const destinationScene = playerObject.teleportToSceneNow;
      playerObject.teleportToSceneNow = null;
      const destinationEntrance = playerObject.teleportToSceneNowEntrance;
      playerObject.teleportToSceneNowEntrance = null;
      cleanUpSceneAndTeleport.call(
        this,
        destinationScene,
        destinationEntrance,
        sceneName,
      );
      return;
    }

    // Handles all keyboard input other than player movement.
    collectKeyboardInput.call(this, sceneName);

    playerObject.scrollingTextBox.sceneUpdate(delta);

    handlePlayerMovement();

    updatePlayerSpriteAnimation();

    handlePlayerInteraction();

    handlePlayerRaycast.call(this);

    // WARNING: npcBehavior must be above updateHadrons,
    // otherwise fired spells are very erratic.
    npcBehavior(delta, sceneName, map);

    itemBehavior(delta, sceneName, map);

    // Iterate over ALL of the hadrons and do what needs to be done.
    updateHadrons.call(
      this,
      sceneName,
      scene,
      collisionLayer,
      waterLayer,
      teleportLayersColliders,
      gameSizeData,
    );

    // Send Player data, which is unique from all hadrons, to the server.
    sendDataToServer.playerData({
      sceneName,
    });

    // Delete any sprites that no longer have an associated hadron.
    cleanUpClientSprites.call(this);

    updateInGameDomElements(htmlElementParameters);

    if (playerObject.loadTesting) {
      loadTesting(delta);
    }
  };

  return scene;
};

export default gameLoopAndSceneFactory;
