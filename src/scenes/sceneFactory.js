/* globals window:true */
import Phaser from 'phaser';

// TODO: Sprite loading needs to be dynamic:
//       1. Every player should be able to pick their own sprite to represent themselves.
//       2. We should be able to load arbitrary sprites from objects in the map or server objects.
import partyWizardSpriteSheet from '../assets/party-wizard-sprite-sheet.png';

import playerObject from '../playerObject';
import textObject from '../textObject';
import handleKeyboardInput from '../handleKeyboardInput';
import updateDomElements from '../updateDomElements';
import reportFunctions from '../reportFunctions';

// TODO: Is this actually a proper factory?
//  https://www.theodinproject.com/courses/javascript/lessons/factory-functions-and-the-module-pattern

const sceneFactory = ({
  sceneName,
  tileMap,
  tileSet,
  tileSetName,
  gameSize,
  htmlElementParameters = {},
}) => {
  const scene = new Phaser.Scene(sceneName);

  // Some multi-scene example code:
  // https://github.com/photonstorm/phaser3-examples/blob/master/public/src/scenes/changing%20scene.js

  // eslint-disable-next-line func-names
  scene.preload = function() {
    // Runs once, loads up assets like images and audio
    // All of these text based "keys" are basically global variables in Phaser.
    // You can reuse the same name, but phaser will just reuse the first thing you
    // assigned to it.
    this.load.image(`${tileSetName}-tiles`, tileSet);
    // NOTE: The key must be different for each tilemap,
    // otherwise Phaser will get confused and reuse the same tilemap
    // even though you think you loaded another one.
    // https://www.html5gamedevs.com/topic/40710-how-do-i-load-a-new-scene-with-phaser-3-and-webpack/
    this.load.tilemapTiledJSON(`${sceneName}-map`, tileMap);

    // An atlas is a way to pack multiple images together into one texture. The tutorial used it to load all
    // the player animations (walking left, walking right, etc.) in one image. For more info see:
    //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
    //  https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3
    // I'm not using that though, instead
    //  you can do the same thing with a spritesheet, see:
    //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
    this.load.spritesheet('partyWizard', partyWizardSpriteSheet, {
      frameWidth: 101,
      frameHeight: 128,
      endFrame: 5,
    });
  };

  let sceneOpen;

  function cleanUpSceneAndUseExit(player, exit) {
    if (sceneOpen) {
      sceneOpen = false;
      const destinationScene = exit.getData('destinationScene');
      playerObject.destinationEntrance = exit.getData('destinationEntrance');
      if (playerObject.destinationEntrance) {
        console.log(
          `Switching to scene: ${destinationScene} entrance ${playerObject.destinationEntrance}`,
        );
      } else {
        console.log(`Switching to scene: ${destinationScene}`);
      }
      // Mark all scene objects as not currently displayed so the new scene can display them again
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(textObject)) {
        value.hasBeenDisplayedInThisScene = false;
      }

      // Remove other players
      playerObject.otherPlayerList.length = 0;

      // Reset cameraScaleFactor for next scene.
      playerObject.cameraScaleFactor = 0;

      this.scene.start(destinationScene);
    }
  }

  function setCameraZoom() {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const widthScaleFactor = canvasWidth / gameSize.width;
    const heightScaleFactor = canvasHeight / gameSize.height;
    const cameraScaleFactor =
      widthScaleFactor < heightScaleFactor
        ? widthScaleFactor
        : heightScaleFactor;
    if (cameraScaleFactor !== playerObject.cameraScaleFactor) {
      playerObject.cameraScaleFactor = cameraScaleFactor;
      // Use camera zoom to fill screen.
      this.cameras.main.setZoom(cameraScaleFactor);
      const gameWidth = Math.trunc(gameSize.width * cameraScaleFactor);
      const gameHeight = Math.trunc(gameSize.height * cameraScaleFactor);
      // Camera size should be just the game size, no bigger or smaller.
      this.cameras.main.setSize(gameWidth, gameHeight);
      // Make sure the canvas is big enough to show the camera.
      this.scale.setGameSize(gameWidth, gameHeight);
      // console.log(cameraScaleFactor, gameWidth, gameHeight);
    }
    // TODO: Find the resolutions that have funky lines in them and see if this helps:
    //       https://github.com/sporadic-labs/tile-extruder
    //       Also notice how things shift as you walk around.
  }

  // eslint-disable-next-line func-names
  scene.create = function() {
    sceneOpen = true;
    // Runs once, after all assets in preload are loaded

    const map = this.make.tilemap({ key: `${sceneName}-map` });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage(tileSetName, `${tileSetName}-tiles`);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    map.createStaticLayer('Ground', tileset, 0, 0);
    map.createStaticLayer('Stuff on the Ground You Can Walk On', tileset, 0, 0);

    // We collide with EVERYTHING in this layer. Collision isn't based on tiles themselves,
    // but the layer they are in.
    const collisionLayer = map
      .createStaticLayer('Stuff You Run Into', tileset, 0, 0)
      .setCollisionByExclusion([-1]);
    const overheadLayer = map.createStaticLayer(
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

    // set background color, so the sky is not black
    // https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    overheadLayer.setDepth(10);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
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

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    // You can use the setSize nad setOffset to allow the character to overlap the
    // collision blocks slightly. This often makes the most sense for the head to overlap a bit so that "background" blocks (above player) seem more "background"
    // Also use the setSize to allow the character to fit in the spaces it should, even if the
    // sprite is too big for them.
    // TODO: Learn to use aseprite: https://www.aseprite.org/docs/
    playerObject.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, 'partyWizard')
      .setSize(80, 110)
      .setOffset(12, 12);

    // My sprite is out of scale with my tiles, so adjusting here
    playerObject.player.displayHeight = 16;
    playerObject.player.displayWidth = 12;

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(playerObject.player, collisionLayer);

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    // Actually this is NOT done from an atlas. I had to hack it a lot ot make it work.

    const anims = this.anims;
    anims.create({
      key: 'wizard-left-walk',
      frames: anims.generateFrameNumbers('partyWizard', {
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
    anims.create({
      key: 'wizard-right-walk',
      frames: anims.generateFrameNumbers('partyWizard', {
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
    anims.create({
      key: 'wizard-front-walk',
      frames: anims.generateFrameNumbers('partyWizard', {
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
    anims.create({
      key: 'wizard-back-walk',
      frames: anims.generateFrameNumbers('partyWizard', {
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    const camera = this.cameras.main;
    camera.startFollow(playerObject.player);
    // This keeps the camera from moving off of the map, regardless of where the player goes
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    setCameraZoom.call(this);

    // This section finds the Objects in the Tilemap that trigger exiting to another scene,
    // and sets up the colliders in Phaser for them along with where to send the player.
    // TODO: Set the "facing direction" in the new scene?
    // TODO: Improve scene switch animation of scene and character.
    //       I'd like to make a fancier "transition" for moving to new scenes.
    //       Like possibly slide the screen "over" in the direction you moved and slide the new one in.
    //       But don't screw with continuous movement across scenes, which may be more important than fancy scene switching animations or character transitions.
    // Useful info on how this works:
    // https://www.html5gamedevs.com/topic/37978-overlapping-on-a-tilemap-object-layer/?do=findComment&comment=216742
    // https://github.com/B3L7/phaser3-tilemap-pack/blob/master/src/scenes/Level.js
    const objects = map.getObjectLayer('Objects');
    const exits = this.physics.add.group();
    objects.objects.forEach((object) => {
      if (object.type === 'SwitchToScene') {
        const door = this.add
          .rectangle(
            object.x,
            object.y,
            object.width,
            object.height,
            0xff0000,
            1,
          )
          .setOrigin(0, 0);
        // Many Phaser objects have a "Datamanager" that lets you add key/value pairs to them.
        // Either through .data or the .setData and .getData functions.
        // Here we use this to tell Phaser what scene to load when this object is "overlapped"
        door.setData('destinationScene', object.name);
        if (object.properties) {
          const entrancePropertyIndex = object.properties.findIndex(
            (x) => x.name === 'Entrance',
          );
          if (entrancePropertyIndex > -1) {
            door.setData(
              'destinationEntrance',
              object.properties[entrancePropertyIndex].value,
            );
          }
        }
        exits.add(door);
        // this.physics.add.overlap(playerObject.player, door, (event) => {
        //   console.log(event);
        // });
      }
    });
    // overlap lets you walk onto it, rather than stopping when you hit it.
    this.physics.add.overlap(
      playerObject.player,
      exits,
      cleanUpSceneAndUseExit,
      null,
      this,
    );

    // Globally send all keyboard input to the keyboard input handler
    this.input.keyboard.on('keydown', handleKeyboardInput);
    this.input.keyboard.on('keyup', handleKeyboardInput);

    // TODO: Add the text and the key to turn debug on and off.

    updateDomElements(htmlElementParameters);
  };

  let lastServerUpdate = 0;
  const serverUpateInterval = 100;

  // eslint-disable-next-line func-names
  scene.update = function(time) {
    // Runs once per frame for the duration of the scene
    if (sceneOpen) {
      setCameraZoom.call(this);

      // Don't do anything if the scene is no longer open.
      const speed = 175;
      playerObject.player.body.velocity.clone();

      // Hot key scene switch for testing.
      if (playerObject.keyState.o === 'keydown') {
        playerObject.keyState.o = null;
        if (sceneOpen && sceneName !== 'openingScene') {
          sceneOpen = false;
          console.log(`Switching to scene: openingScene`);
          this.scene.start('openingScene');
        }
      }

      // Stop any previous movement from the last frame
      playerObject.player.body.setVelocity(0);

      // Horizontal movement
      if (
        playerObject.keyState.ArrowLeft === 'keydown' ||
        playerObject.keyState.a === 'keydown'
      ) {
        playerObject.player.body.setVelocityX(-speed);
      } else if (
        playerObject.keyState.ArrowRight === 'keydown' ||
        playerObject.keyState.d === 'keydown'
      ) {
        playerObject.player.body.setVelocityX(speed);
      }

      // Vertical movement
      if (
        playerObject.keyState.ArrowUp === 'keydown' ||
        playerObject.keyState.w === 'keydown'
      ) {
        playerObject.player.body.setVelocityY(-speed);
      } else if (
        playerObject.keyState.ArrowDown === 'keydown' ||
        playerObject.keyState.s === 'keydown'
      ) {
        playerObject.player.body.setVelocityY(speed);
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      playerObject.player.body.velocity.normalize().scale(speed);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (
        playerObject.keyState.ArrowLeft === 'keydown' ||
        playerObject.keyState.a === 'keydown'
      ) {
        playerObject.player.setFlipX(false);
        playerObject.player.anims.play('wizard-left-walk', true);
        playerObject.playerDirection = 'left';
      } else if (
        playerObject.keyState.ArrowRight === 'keydown' ||
        playerObject.keyState.d === 'keydown'
      ) {
        playerObject.player.setFlipX(true);
        playerObject.player.anims.play('wizard-right-walk', true);
        playerObject.playerDirection = 'right';
      } else if (
        playerObject.keyState.ArrowUp === 'keydown' ||
        playerObject.keyState.w === 'keydown'
      ) {
        playerObject.player.anims.play('wizard-back-walk', true);
        playerObject.playerDirection = 'up';
      } else if (
        playerObject.keyState.ArrowDown === 'keydown' ||
        playerObject.keyState.s === 'keydown'
      ) {
        playerObject.player.anims.play('wizard-front-walk', true);
        playerObject.playerDirection = 'down';
      } else {
        playerObject.player.anims.stop();
        playerObject.playerDirection = 'left';
      }
    }

    // Update server
    if (time - lastServerUpdate > serverUpateInterval) {
      lastServerUpdate = time;
      reportFunctions.reportLocation(sceneName);
    }

    if (playerObject.serverData.playerState) {
      playerObject.serverData.playerState.forEach((player) => {
        // console.log(player.name, player.x, player.y, player.scene, player.id);
        if (player.id === playerObject.playerId) {
          // It me!
          // TODO: Set up a "debugging" option with way to enable/disable it,
          //       that will show a box or something where the server sees me,
          //       for comparison to where I see me.
          // console.log(player.direction);
        } // TODO: Don't display ME normally though.
        if (player.scene === sceneName) {
          if (!playerObject.otherPlayerList[player.id]) {
            playerObject.otherPlayerList[player.id] = this.physics.add
              .sprite(player.x, player.y, 'partyWizard')
              .setSize(80, 110)
              .setOffset(12, 12);
            playerObject.otherPlayerList[player.id].displayHeight = 16;
            playerObject.otherPlayerList[player.id].displayWidth = 12;
          } else {
            // Sometimes they go inactive.
            playerObject.otherPlayerList[player.id].active = true;
            // TODO: Other players need to animate, not just slide around.
            playerObject.otherPlayerList[player.id].x = player.x;
            playerObject.otherPlayerList[player.id].y = player.y;
          }
          // Use Player direction to set player stance
        } else if (playerObject.otherPlayerList[player.id]) {
          // Off screen players should be inactive.
          playerObject.otherPlayerList[player.id].destroy();
          playerObject.otherPlayerList[player.id] = null;
        }
      });
    }

    updateDomElements(htmlElementParameters);
  };

  return scene;
};

export default sceneFactory;
