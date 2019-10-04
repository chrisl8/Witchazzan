/* globals WebSocket:true */
import Phaser from 'phaser';
import tileset1bit16x16 from '../assets/tileset_1bit-16x16.png';
import tileMap from '../assets/openingScene';
import partyWizardSpriteSheet from '../assets/party-wizard-sprite-sheet.png';
import playerObject from '../playerObject';
import communicationsObject from '../communicationsObject';

// keep track of the keyboard state only when it changes
var keyState = {};
function sendKey(key, value) {
  if (keyState[key] !== value) {
    keyState[key] = value;
    communicationsObject.socket.send(key + ',' + value);
  }
}

const sceneName = 'openingScene';

// TODO: Instead of a cont here, should it be like an "extends"?
// TODO: I need to have a "constructor" or something so I can pass in variables.
// TODO: Some bits, like the update might need to be just generic used by all scenes, right?
const openingScene = new Phaser.Scene('openingScene');

// Some multi-scene example code:
// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/scenes/changing%20scene.js
// TODO: The example uses this, but I'm not sure why.
// Phaser.Scene.call(this, { key: 'openingScene' });

openingScene.preload = function() {
  // Runs once, loads up assets like images and audio
  this.load.image('tiles', tileset1bit16x16);
  // NOTE: The key must be different for each tilemap,
  // otherwise Phaser will get confused and reuse the same tilemap
  // even though you think you loaded another one.
  this.load.tilemapTiledJSON(`${sceneName}-map`, tileMap);

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // I'm not using that though, instead
  //  you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  this.load.spritesheet('partyWizard', partyWizardSpriteSheet, {
    frameWidth: 101,
    frameHeight: 128,
    endFrame: 5,
  });
};

openingScene.create = function() {
  // Runs once, after all assets in preload are loaded

  const map = this.make.tilemap({ key: `${sceneName}-map` });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage('tileset_1bit-16x16', 'tiles');

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const groundLayer = map.createStaticLayer('Ground', tileset, 0, 0);
  const collisionLayer = map.createStaticLayer(
    'Stuff You Run Into',
    tileset,
    0,
    0,
  );
  const overheadLayer = map.createStaticLayer(
    'Stuff You Walk Under',
    tileset,
    0,
    0,
  );

  /*
   *
   * https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
   * Tiled allows you to add properties to a tileset via the Tileset Editor,
   * so we can just mark which tiles collide directly in Tiled.
   * 1. Open up the Tileset Editor by clicking on the “Edit Tileset” button (at the bottom right of the screen).
   * 2. Click and drag (or CTRL + A) to select all the tiles.
   * 3. Under the properties window (left side of the screen), click the plus icon and add a boolean property named “collides.”
   * 4. Select only the tiles that you want to collide and set “collides” to true by checking the box
   * 5. Re-export your map.
   */
  collisionLayer.setCollisionByProperty({ collides: true });

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
  const spawnPoint = map.findObject(
    'Objects',
    (obj) => obj.name === 'Spawn Point',
  );

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  // You can use the setSize nad setOffset to allow the character to overlap the
  // collision blocks slightly. This often makes the most sense for the head to overlap a bit so that "background" blocks (above player) seem more "background"
  // TODO: Learn to use aseprite: https://www.aseprite.org/docs/
  playerObject.player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, 'partyWizard')
    .setSize(101, 110)
    .setOffset(0, 12);

  // My sprite is out of scale with my tiles, so adjusting here
  playerObject.player.displayHeight = 18;
  playerObject.player.displayWidth = 18;

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  this.physics.add.collider(playerObject.player, collisionLayer);

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  // Actually this is NOT done from an atlas. I had to hack it a lot ot make it work.

  // TODO: Set up and use Atlas files:
  // https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
  // https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3
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
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  playerObject.cursors = this.input.keyboard.createCursorKeys();

  // TODO: Add the text and the key to turn debug on and off.
};

openingScene.update = function(time, delta) {
  // Runs once per frame for the duration of the scene
  const speed = 175;
  const prevVelocity = playerObject.player.body.velocity.clone();

  // Hotkey scene switch for testing.
  this.input.keyboard.once('keydown_S', (event) => {
    console.log(`Switching to scene: openingSceneRight1`);
    this.scene.start('openingSceneRight1');
  });

  // Stop any previous movement from the last frame
  playerObject.player.body.setVelocity(0);

  // Horizontal movement
  if (playerObject.cursors.left.isDown) {
    if (communicationsObject.socket.readyState === WebSocket.OPEN) {
      sendKey('left', 'down');
    }
    playerObject.player.body.setVelocityX(-speed);
  } else if (playerObject.cursors.right.isDown) {
    if (communicationsObject.socket.readyState === WebSocket.OPEN) {
      sendKey('right', 'down');
    }
    playerObject.player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (playerObject.cursors.up.isDown) {
    if (communicationsObject.socket.readyState === WebSocket.OPEN) {
      sendKey('up', 'down');
    }
    playerObject.player.body.setVelocityY(-speed);
  } else if (playerObject.cursors.down.isDown) {
    if (communicationsObject.socket.readyState === WebSocket.OPEN) {
      sendKey('down', 'down');
    }
    playerObject.player.body.setVelocityY(speed);
  }
  // Key up events
  if (communicationsObject.socket.readyState === WebSocket.OPEN) {
    if (playerObject.cursors.left.isUp) {
      sendKey('left', 'up');
    }
    if (playerObject.cursors.right.isUp) {
      sendKey('right', 'up');
    }
    if (playerObject.cursors.up.isUp) {
      sendKey('up', 'up');
    }
    if (playerObject.cursors.down.isUp) {
      sendKey('down', 'up');
    }
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  playerObject.player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (playerObject.cursors.left.isDown) {
    playerObject.player.setFlipX(false);
    playerObject.player.anims.play('wizard-left-walk', true);
  } else if (playerObject.cursors.right.isDown) {
    playerObject.player.setFlipX(true);
    playerObject.player.anims.play('wizard-right-walk', true);
  } else if (playerObject.cursors.up.isDown) {
    playerObject.player.anims.play('wizard-back-walk', true);
  } else if (playerObject.cursors.down.isDown) {
    playerObject.player.anims.play('wizard-front-walk', true);
  } else {
    playerObject.player.anims.stop();
  }

  // TODO: Fully implement the example at:
  // https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
  // by having all directions for my walking sprite, etc.
};

export default openingScene;
