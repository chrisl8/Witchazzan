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
};

const game = new Phaser.Game(config);

function preload() {
  // Runs once, loads up assets like images and audio
  this.load.image('tiles', 'src/assets/tileset_1bit.png');
  this.load.tilemapTiledJSON('map', 'src/assets/openingScene.json');
}

function create() {
  // Runs once, after all assets in preload are loaded

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
  const debugGraphics = this.add.graphics().setAlpha(0.75);
  collissionLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
  });

  // set background color, so the sky is not black
  // https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/
  this.cameras.main.setBackgroundColor('#FFFFFF');
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene
}
