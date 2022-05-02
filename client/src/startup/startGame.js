/* globals window:true */
/* globals document:true */
import Phaser from 'phaser';
import phaserConfigObject from '../objects/phaserConfigObject.js';
import receiveDataFromServer from '../receiveDataFromServer.js';
import touchInput from '../touchInput.js';
import playerObject from '../objects/playerObject.js';
import wait from '../../../shared/wait.mjs';
import ScrollingTextBox from '../ScrollingTextBox.js';

async function waitForBrowserWindowToBeVisible() {
  // Don't start if the browser window is not visible.

  while (document.visibilityState === 'hidden') {
    // eslint-disable-next-line no-await-in-loop
    await wait(100);
  }
}

async function waitForConnectionAndInitialPlayerPosition() {
  // Don't start until we have the initial connection
  // with the player's initial position.

  while (!playerObject.initialPositionReceived) {
    // eslint-disable-next-line no-await-in-loop
    await wait(100);
  }
}

/*
 * This actually starts up the game,
 * after the local variables are loaded,
 * and the help screen, if shown, is dismissed.
 */

async function startGame({ phaserDebug }) {
  phaserConfigObject.physics.arcade.debug = phaserDebug;

  await waitForBrowserWindowToBeVisible();

  receiveDataFromServer();

  await waitForConnectionAndInitialPlayerPosition();

  // Set last DOM updates before game starts.
  document.getElementById('pre_load_info').hidden = true;
  document.getElementsByTagName('body')[0].style.background = 'black';

  touchInput();

  playerObject.scrollingTextBox = new ScrollingTextBox();

  // Start Phaser
  phaserConfigObject.game = new Phaser.Game(phaserConfigObject);

  // grab handle to canvas element
  playerObject.domElements.canvas = document.getElementsByTagName('canvas')[0];

  // Watch for browser window visibility changes.
  // https://doc.photonengine.com/en-us/pun/current/demos-and-tutorials/webgl-tabsinbackground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // If the user's browser window becomes hidden, we need to kick them out,
      // because their Phaser instance will NOT be running, causing their hadrons to appear frozen and not operate.
      // Because this is a "game",users should stay focused on it when playing, and be OK with it having to reload
      // when they leave and come back.
      // This keeps the game snappy for everyone else in the game.
      window.location.reload();
    }
  });
}

export default startGame;
