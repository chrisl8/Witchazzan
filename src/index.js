/* globals document:true */
// https://what-problem-does-it-solve.com/webpack/css.html
import './css/styles.css';

import introScreenAndPreGameSetup from './introScreenAndPreGameSetup';
import updateDomSettingsForGame from './updateDomSettingsForGame';
import startGame from './startGame';

/*
 * This just loads up the game.
 * Try to keep it clean.
 */

// eslint-disable-next-line func-names
(async function() {
  await introScreenAndPreGameSetup();

  updateDomSettingsForGame();

  await startGame({
    phaserDebug: document.getElementById('phaser_debug').checked,
  });
})();
