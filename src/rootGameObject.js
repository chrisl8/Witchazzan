import Phaser from 'phaser';
import scene from './scenes/sceneList';

const rootGameObject = {
  config: {
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
