/* globals document:true */
import Phaser from 'phaser';
import rootGameObject from './objects/rootGameObject';
import socketCommunications from './socketCommunication';
import waitForConnectionAndInitialPlayerPosition from './waitForConnectionAndInitialPlayerPosition';
import touchInput from './touchInput';

/*
 * This actually starts up the game,
 * after the local variables are loaded,
 * and the help screen, if shown, is past.
 */

async function startGame({ phaserDebug }) {
  rootGameObject.config.physics.arcade.debug = phaserDebug;

  socketCommunications();

  await waitForConnectionAndInitialPlayerPosition();

  // Set last DOM updates before game starts.
  document.getElementById('pre_load_info').hidden = true;
  document.getElementsByTagName('body')[0].style.background = 'black';

  touchInput();

  // Start Phaser
  rootGameObject.game = new Phaser.Game(rootGameObject.config);
}

export default startGame;
