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
    scale: {
      mode: Phaser.Scale.NONE,
      autoRound: true, // Might improve performance?
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
      pixelArt: true, // Turn this off if you want to test for "extrusion" errors.
    },
  },
  showDebug: false,
};

export default rootGameObject;
