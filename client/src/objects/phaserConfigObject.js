/*
 * This is the Phaser config object.
 */

import Phaser from 'phaser';
import scene from '../sceneList.js';

const phaserConfigObject = {
  type: Phaser.AUTO, // Which renderer to use
  parent: 'game_container', // ID of the DOM element to add the canvas to. If no parent is given, it will default to using the document body.
  scale: {
    mode: Phaser.Scale.NONE,
    autoRound: true, // Might improve performance?
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
  scene,
  // Make the pixels "perfect", not fuzzy!
  // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
  render: {
    pixelArt: true, // Turn this off if you want to test for "extrusion" errors.
  },
};

export default phaserConfigObject;
