// https://what-problem-does-it-solve.com/webpack/css.html
import './css/styles.css';

import introScreenAndPreGameSetup from './startup/introScreenAndPreGameSetup.js';
import updateDomSettingsForGame from './startup/updateDomSettingsForGame.js';
import startGame from './startup/startGame.js';
import playerObject from './objects/playerObject.js';

/*
 * This just loads up the game.
 * Try to keep it clean.
 *
 * It is a sort of "Node thing" for index.js to be the initial starting file,
 * kind of like "index.html" I guess.
 */

(async () => {
  await introScreenAndPreGameSetup();

  updateDomSettingsForGame();

  await startGame({
    phaserDebug: playerObject.enableDebug,
  });
})();
