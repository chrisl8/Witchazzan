/* globals document:true */
import Phaser from 'phaser';
import phaserConfigObject from '../objects/phaserConfigObject';
import socketCommunications from '../socketCommunication';
import waitForConnectionAndInitialPlayerPosition from './waitForConnectionAndInitialPlayerPosition';
import touchInput from '../touchInput';

/*
 * This actually starts up the game,
 * after the local variables are loaded,
 * and the help screen, if shown, is dismissed.
 */

async function startGame({ phaserDebug }) {
  phaserConfigObject.physics.arcade.debug = phaserDebug;

  socketCommunications();

  await waitForConnectionAndInitialPlayerPosition();

  // Set last DOM updates before game starts.
  document.getElementById('pre_load_info').hidden = true;
  document.getElementsByTagName('body')[0].style.background = 'black';

  touchInput();

  // Start Phaser
  phaserConfigObject.game = new Phaser.Game(phaserConfigObject);
}

export default startGame;
