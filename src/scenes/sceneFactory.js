/* globals window:true */
/* globals localStorage:true */
import Phaser from 'phaser';
import playerObject from '../objects/playerObject';
import textObject from '../objects/textObject';
import handleKeyboardInput from '../handleKeyboardInput';
import updateDomElements from '../updateDomElements';
import reportFunctions from '../reportFunctions';
import spriteSheetList from '../objects/spriteSheetList';
import gamePieceList from '../objects/gamePieceList';
import getSpriteData from '../utilities/getSpriteData';

// TODO: Is this actually a proper factory?
//  https://www.theodinproject.com/courses/javascript/lessons/factory-functions-and-the-module-pattern

// This is the scene you start the game in,
// and go to if a non-existent scene is requested,
// and if you press the 'o' key.
const defaultOpeningScene = 'LoruleH8';

const checkForShitDataFromThatClojureNut = (gamePiece) => {
  const result =
    typeof gamePiece.id === 'number' &&
    typeof gamePiece.x === 'number' &&
    typeof gamePiece.y === 'number' &&
    gamePiece.sprite;
  if (!result) {
    console.error('Garbage data received from server:');
    console.error(gamePiece);
  }
  return result;
};

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

    // Spritesheet example: https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
    // The sprites can be added in this preload phase,
    // but the animations have to be added in the create phase.
    spriteSheetList.forEach((spriteSheet) => {
      this.load.spritesheet(spriteSheet.name, spriteSheet.file, {
        frameWidth: spriteSheet.frameWidth,
        frameHeight: spriteSheet.frameHeight,
        endFrame: spriteSheet.endFrame,
      });
    });
  };

  let sceneOpen;

  function cleanUpScene() {
    sceneOpen = false;
    // Mark all scene text objects as not currently displayed so the new scene can display them again
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(textObject)) {
      value.hasBeenDisplayedInThisScene = false;
    }

    // Reset cameraScaleFactor for next scene.
    playerObject.cameraScaleFactor = 0;
  }

  function cleanUpSceneAndUseExit(player, exit) {
    if (sceneOpen) {
      cleanUpScene();
      let destinationScene = exit.getData('destinationScene');
      if (this.scene.getIndex(destinationScene) === -1) {
        console.log(`Switching to scene: ${destinationScene} does not exist.`);
        destinationScene = defaultOpeningScene;
      }
      playerObject.destinationEntrance = exit.getData('destinationEntrance');
      if (playerObject.destinationEntrance) {
        console.log(
          `Switching to scene: ${destinationScene} entrance ${playerObject.destinationEntrance}.`,
        );
      } else {
        console.log(
          `Switching to scene: ${destinationScene} at default spawn point.`,
        );
      }

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
    }
  }

  // eslint-disable-next-line func-names
  scene.create = function() {
    // Runs once, after all assets in preload are loaded
    sceneOpen = true;

    // The sprites can be added in this preload phase,
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
            }),
            frameRate: spriteSheet.animationFrameRate,
            repeat: animation.repeat,
          });
        });
      }
    });

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
      }
    }

    // Create a sprite with physics enabled via the physics system.
    // You can use the setSize and setOffset to allow the character to overlap the
    // collision blocks slightly. This often makes the most sense for the head to overlap a bit so that "background" blocks (above player) seem more "background"
    // Also use the setSize to allow the character to fit in the spaces it should, even if the
    // sprite is too big for them.
    playerObject.spriteData = getSpriteData(playerObject.spriteName);

    // Use the player's last position from the server if it exists
    if (sceneOpen && !playerObject.initialPositionFromServerAlreadyUsed) {
      // "sceneOpen" is a bit of a hack to ensure we don't waste this on
      // the default opening scene before the player is moved away.to
      // the server provided scene.
      playerObject.initialPositionFromServerAlreadyUsed = true;
      // 0,0 is assumed to be an empty position from a new player.
      // NOTE: This could be a bug if 0,0 is ever a legitimate last positoin.
      if (
        !(
          playerObject.initialPosition.x === 0 &&
          playerObject.initialPosition.x === 0
        )
      ) {
        spawnPoint = playerObject.initialPosition;
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

    const camera = this.cameras.main;
    camera.startFollow(playerObject.player);
    // This keeps the camera from moving off of the map, regardless of where the player goes
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // This section finds the Objects in the Tilemap that trigger exiting to another scene,
    // and sets up the colliders in Phaser for them along with where to send the player.
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
      } else if (object.type === 'SpawnNPC') {
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

    updateDomElements(htmlElementParameters);
  };

  let lastServerUpdate = 0;
  const serverUpateInterval = 40;

  // eslint-disable-next-line func-names
  scene.update = function(time, delta) {
    // Runs once per frame for the duration of the scene
    // Don't do anything if the scene is no longer open.
    // This may not be necessary, but it may prevent race conditions
    if (sceneOpen) {
      setCameraZoom.call(this);

      let maxSpeed = 175;
      const acceleration = 3;
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
        const maxDistance = 50;
        if (distance > maxDistance) {
          distance = maxDistance;
        }
        const newMaxSpeed = (maxSpeed * distance) / maxDistance;
        if (newMaxSpeed < maxSpeed) {
          maxSpeed = newMaxSpeed;
        }
      }

      // Shift to sprint
      if (playerObject.keyState.Shift === 'keydown') {
        useAcceleration = false;
      }

      playerObject.player.body.velocity.clone();

      // Return to intro text
      if (playerObject.keyState.h === 'keydown') {
        playerObject.keyState.h = null;
        console.log('Display help text');
        let existingHelpTextVersion = Number(
          localStorage.getItem('helpTextVersion'),
        );
        existingHelpTextVersion--;
        localStorage.setItem(
          'helpTextVersion',
          existingHelpTextVersion.toString(),
        );

        window.location.reload(true);
      }

      // Hot key scene switch for testing.
      if (playerObject.keyState.o === 'keydown') {
        playerObject.keyState.o = null;
        if (sceneOpen && sceneName !== defaultOpeningScene) {
          cleanUpSceneAndUseExit.call(this, null, {
            getData() {
              return defaultOpeningScene;
            },
          });
        }
      }

      // Hot key to display/hide chat log
      if (playerObject.keyState.l === 'keydown') {
        playerObject.keyState.l = null;
        if (textObject.incomingChatText.text !== '') {
          textObject.incomingChatText.shouldBeActiveNow = !textObject
            .incomingChatText.shouldBeActiveNow;
          textObject.incomingChatText.activeTime = 0;
        }
      }

      // Timeout chat log window if chat input is not open.
      if (
        textObject.incomingChatText.shouldBeActiveNow &&
        playerObject.domElements.chatInputDiv.style.display === 'none'
      ) {
        textObject.incomingChatText.activeTime += delta;
        if (
          textObject.incomingChatText.activeTime >
          textObject.incomingChatText.timeout
        ) {
          textObject.incomingChatText.activeTime = 0;
          textObject.incomingChatText.shouldBeActiveNow = false;
        }
      }

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
            newSpeed = previousVelocityX - acceleration;
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
            newSpeed = previousVelocityX + acceleration;
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
            newSpeed = previousVelocityY - acceleration;
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
            newSpeed = previousVelocityY + acceleration;
            fullSpeed = false;
          }
        }
        playerObject.player.body.setVelocityY(newSpeed);
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      if (fullSpeed) {
        playerObject.player.body.velocity.normalize().scale(maxSpeed);
      }

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

      // Update server
      if (time - lastServerUpdate > serverUpateInterval) {
        lastServerUpdate = time;
        reportFunctions.reportLocation(sceneName);
      }

      // Deal with game pieces from server.
      const activeObjectList = [];
      if (gamePieceList.pieces && gamePieceList.pieces.length > 0) {
        gamePieceList.pieces.forEach((gamePiece) => {
          if (checkForShitDataFromThatClojureNut(gamePiece)) {
            activeObjectList.push(gamePiece.id);
            if (gamePiece.scene === sceneName && gamePiece.sprite) {
              // This code is great for seeing where the server things things are,
              // but as it is written it is SLOW. So either only use it during debugging
              // Or improve it.
              // this.add
              //   .rectangle(gamePiece.x, gamePiece.y, 1, 1, 0xff0000, 1)
              //   .setOrigin(0, 0);

              // If no `sprite` key is given, no sprite is displayed.
              // This also prevents race conditions with remote players during reload
              // TODO: If a remote player changes their sprite, we won't know about it.
              if (!playerObject.spawnedObjectList[gamePiece.id]) {
                // Add new sprites to the scene
                console.log('New game piece:');
                console.log(gamePiece);
                playerObject.spawnedObjectList[gamePiece.id] = {};

                playerObject.spawnedObjectList[
                  gamePiece.id
                ].spriteData = getSpriteData(gamePiece.sprite);

                // To shorten variable names and make code more consistent
                const spriteData =
                  playerObject.spawnedObjectList[gamePiece.id].spriteData;

                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite = this.physics.add
                  .sprite(gamePiece.x, gamePiece.y, spriteData.name)
                  .setSize(spriteData.physicsSize.x, spriteData.physicsSize.y);

                if (gamePiece.id === playerObject.playerId) {
                  playerObject.spawnedObjectList[
                    gamePiece.id
                  ].sprite.tint = 0x000000;
                }

                if (spriteData.physicsOffset) {
                  playerObject.spawnedObjectList[
                    gamePiece.id
                  ].sprite.body.setOffset(
                    spriteData.physicsOffset.x,
                    spriteData.physicsOffset.y,
                  );
                }

                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.displayHeight = spriteData.displayHeight;
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.displayWidth = spriteData.displayWidth;
              }
              // Sometimes they go inactive.
              playerObject.spawnedObjectList[gamePiece.id].sprite.active = true;

              // Use Game Piece direction to set sprite rotation or flip it
              if (
                playerObject.spawnedObjectList[gamePiece.id].spriteData
                  .rotatable
              ) {
                // Rotate sprite to face requested direction.
                if (
                  gamePiece.direction === 'left' ||
                  gamePiece.direction === 'west'
                ) {
                  playerObject.spawnedObjectList[gamePiece.id].sprite.setAngle(
                    180,
                  );
                } else if (
                  gamePiece.direction === 'right' ||
                  gamePiece.direction === 'east'
                ) {
                  playerObject.spawnedObjectList[gamePiece.id].sprite.setAngle(
                    0,
                  );
                } else if (
                  gamePiece.direction === 'up' ||
                  gamePiece.direction === 'north'
                ) {
                  playerObject.spawnedObjectList[gamePiece.id].sprite.setAngle(
                    -90,
                  );
                } else if (
                  gamePiece.direction === 'down' ||
                  gamePiece.direction === 'south'
                ) {
                  playerObject.spawnedObjectList[gamePiece.id].sprite.setAngle(
                    90,
                  );
                }
              } else if (
                gamePiece.direction === 'left' ||
                gamePiece.direction === 'west'
              ) {
                // For non rotatable sprites, only flip them for left/right
                playerObject.spawnedObjectList[gamePiece.id].sprite.setFlipX(
                  playerObject.spawnedObjectList[gamePiece.id].spriteData
                    .faces === 'right',
                );
              } else if (
                gamePiece.direction === 'right' ||
                gamePiece.direction === 'east'
              ) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.setFlipX(
                  playerObject.spawnedObjectList[gamePiece.id].spriteData
                    .faces === 'left',
                );
              }

              // The only way to know if the remote item is in motion is for the server to tell us
              //       We cannot divine it, because the local tick is always faster than the server update.
              let objectInMotion = true; // Default to animate if server does not tell us otherwise.
              if (gamePiece.moving === false) {
                objectInMotion = false;
              }
              if (!objectInMotion) {
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.anims.stop();
              } else if (
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-left`,
                ) &&
                (gamePiece.direction === 'left' ||
                  gamePiece.direction === 'west')
              ) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.anims.play(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-left`,
                  true,
                );
              } else if (
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-right`,
                ) &&
                (gamePiece.direction === 'right' ||
                  gamePiece.direction === 'east')
              ) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.anims.play(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-right`,
                  true,
                );
              } else if (
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-back`,
                ) &&
                (gamePiece.direction === 'up' ||
                  gamePiece.direction === 'north')
              ) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.anims.play(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-back`,
                  true,
                );
              } else if (
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-front`,
                ) &&
                (gamePiece.direction === 'down' ||
                  gamePiece.direction === 'south')
              ) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.anims.play(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-front`,
                  true,
                );
              } else if (
                playerObject.spawnedObjectList[
                  gamePiece.id
                ].sprite.anims.animationManager.anims.entries.hasOwnProperty(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-stationary`,
                )
              ) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.anims.play(
                  `${
                    playerObject.spawnedObjectList[gamePiece.id].spriteData.name
                  }-move-stationary`,
                  true,
                );
              }

              this.tweens.add({
                targets: playerObject.spawnedObjectList[gamePiece.id].sprite,
                x: gamePiece.x,
                y: gamePiece.y,
                duration: 90, // Adjust this to be smooth without being too slow.
                ease: 'Linear', // Anything else is wonky when tracking server updates.
              });
            } else if (
              playerObject.spawnedObjectList[gamePiece.id] &&
              playerObject.spawnedObjectList[gamePiece.id].sprite
            ) {
              // Off screen players should be inactive.
              if (playerObject.spawnedObjectList[gamePiece.id].sprite) {
                playerObject.spawnedObjectList[gamePiece.id].sprite.destroy();
              }
              playerObject.spawnedObjectList[gamePiece.id] = null;
            }
          }
        });
      }

      // Remove de-spawned objects
      for (const property in playerObject.spawnedObjectList) {
        if (playerObject.spawnedObjectList.hasOwnProperty(property)) {
          if (
            playerObject.spawnedObjectList[property] &&
            activeObjectList.indexOf(Number(property)) === -1
          ) {
            console.log(`Destroying Object ID ${property}`);
            if (playerObject.spawnedObjectList[property].sprite) {
              playerObject.spawnedObjectList[property].sprite.destroy();
            }
            playerObject.spawnedObjectList[property] = null;
          }
        }
      }

      updateDomElements(htmlElementParameters);
    }
  };

  return scene;
};

export default sceneFactory;
