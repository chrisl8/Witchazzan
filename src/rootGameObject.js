/*
 * This is primarily where the Phaser config object goes,
 * but you can put anything you want next to the config object.
 *
 * Note that if your scenes need to access the data, this might not be the best place,
 * due to circular references.
 *
 * Currently we also have these objects to put stuff in:
 * playerObject - Player and anything related to them
 * communicationsObject - The websocket connection handle
 */

import Phaser from 'phaser';
import scene from './scenes/sceneList';

const rootGameObject = {
  config: {
    type: Phaser.AUTO, // Which renderer to use
    // parent: 'game_container', // ID of the DOM element to add the canvas to. If no parent is given, it will default to using the document body.
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scale.ScaleManager.html
    // For now this gets the screen to fill the window, we may change how we scale and how we handle "off camera" movement later.
    // Currently my tile map is tiny too, so this helps anyway.
    scale: {
      mode: Phaser.Scale.FIT,
      // Actual scale is set per map in the sceneFactory.js
      width: 32 * 20, // 16 * 16
      height: 32 * 11, // 16 * 11
      // min: {
      //   width: 16 * 16,
      //   height: 16 * 11,
      // },
      // max: { width: 1600, height: 1200 }, // No maximum. Fill the screen.
      autoRound: true, // Should improve performance
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }, // Top down game, so no gravity
      },
    },
    scene,
    // Make the pixels "perfect", not fuzzy!
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: false,
    },
  },
  showDebug: false,
};

export default rootGameObject;
