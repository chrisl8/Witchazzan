/* globals document:true */
import Phaser from 'phaser';
import phaserConfigObject from '../objects/phaserConfigObject';
import receiveDataFromServer from '../receiveDataFromServer';
import touchInput from '../touchInput';
import playerObject from '../objects/playerObject';
import wait from '../utilities/wait';
import ScrollingTextBox from '../ScrollingTextBox';

async function waitForConnectionAndInitialPlayerPosition() {
  // Don't start until we have the initial connection
  // with the player's initial position.

  while (!playerObject.initialPositionReceived) {
    // eslint-disable-next-line no-await-in-loop
    await wait(1);
  }
}

/*
 * This actually starts up the game,
 * after the local variables are loaded,
 * and the help screen, if shown, is dismissed.
 */

async function startGame({ phaserDebug }) {
  phaserConfigObject.physics.arcade.debug = phaserDebug;

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
}

export default startGame;
