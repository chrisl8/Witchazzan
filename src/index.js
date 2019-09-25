import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO, // Which renderer to use
  // parent: 'game-container', // ID of the DOM element to add the canvas to. If no parent is given, it will default to using the document body.
  // https://photonstorm.github.io/phaser3-docs/Phaser.Scale.ScaleManager.html
  // For now this gets the screen to fill the window, we may change how we scale and how we handle "off camera" movement later.
  // Currently my tile map is tiny too, so this helps anyway.
  scale: {
    mode: Phaser.Scale.FIT,
    width: 256,
    height: 176,
    min: {
      width: 256,
      height: 176,
    },
    max: { width: 1600, height: 1200 },
    autoRound: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top down game, so no gravity
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  // Make the pixels "perfect", not fuzzy!
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: false,
  },
};

const game = new Phaser.Game(config);
let cursors;
let player;
let showDebug = false;
let socket;

function preload() {
  // Runs once, loads up assets like images and audio
  this.load.image('tiles', 'src/assets/tileset_1bit-16x16.png');
  this.load.tilemapTiledJSON('map', 'src/assets/openingScene.json');

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // I'm not using that though, instaed
  //  you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  this.load.spritesheet(
    'partyWizard',
    'src/assets/party-wizard-sprite-sheet.png',
    {
      frameWidth: 101,
      frameHeight: 128,
      endFrame: 5,
    },
  );
}

function create() {
  // Runs once, after all assets in preload are loaded

  socket = new WebSocket('ws://localhost:8080');

  // Connection opened
  socket.addEventListener('open', function(event) {
    socket.send('Hello Server!');
  });

  // Listen for messages
  socket.addEventListener('message', function(event) {
    console.log('Message from server ', event.data);
  });

  const map = this.make.tilemap({ key: 'map' });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage('1-bit-starter-set', 'tiles');

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const groundLayer = map.createStaticLayer('Ground', tileset, 0, 0);
  const collissionLayer = map.createStaticLayer(
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
  collissionLayer.setCollisionByProperty({ collides: true });

  // If you want to verify that you’ve got the right tiles marked as colliding, use the layer’s debug rendering:
  // https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // collissionLayer.renderDebug(debugGraphics, {
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
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, 'partyWizard')
    .setSize(101, 110)
    .setOffset(0, 12);

  // My sprite is out of scale with my tiles, so adjusting here
  player.displayHeight = 18;
  player.displayWidth = 18;

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  this.physics.add.collider(player, collissionLayer);

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
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();

  // TODO: Add the text and the key to turn debug on and off.
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.setFlipX(false);
    player.anims.play('wizard-left-walk', true);
  } else if (cursors.right.isDown) {
    player.setFlipX(true);
    player.anims.play('wizard-right-walk', true);
  } else if (cursors.up.isDown) {
    player.anims.play('wizard-back-walk', true);
  } else if (cursors.down.isDown) {
    player.anims.play('wizard-front-walk', true);
  } else {
    player.anims.stop();
  }
}

// TODO: Once walking around works, make Websockets work next.
// Get it talking to the server, send EVERYTHING to it,
// Get the server to log stuff it gets,
// Console log input from server.

// This way we can start playing with client/server control ideas.

// Once that works, set up a player "per client" so two of us can mess with it.
