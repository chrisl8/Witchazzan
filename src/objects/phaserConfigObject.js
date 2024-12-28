/*
 * This is the Phaser config object.
 */

import Phaser from 'phaser';
import PhaserRaycaster from 'phaser-raycaster';
import scene from '../sceneList.js';
import PathFinder from '../plugins/pathFinder.js';

const phaserConfigObject = {
  type: Phaser.WEBGL, // Which renderer to use
  // parent will be body, so no need to set it
  scale: {
    mode: Phaser.Scale.FIT, // Works and looks a lot better than my manual attempts!
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top down game, so no gravity
      // All the debug options you could want
      debug: false, // This is the only one you have to switch. Do it on the Help screen now.
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
      debugVelocityColor: 0xffff00,
      debugBodyColor: 0x0000ff,
      debugStaticBodyColor: 0xffffff,
    },
  },
  plugins: {
    scene: [
      {
        key: 'PhaserRaycaster',
        plugin: PhaserRaycaster,
        mapping: 'raycasterPlugin',
      },
      {
        key: 'PathFinder',
        plugin: PathFinder,
        mapping: 'pathFinderPlugin',
      },
    ],
  },
  scene,
  // Make the pixels "perfect", not fuzzy!
  // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
  render: {
    pixelArt: true, // Turn this off if you want to test for "extrusion" errors.
  },
};

export default phaserConfigObject;
