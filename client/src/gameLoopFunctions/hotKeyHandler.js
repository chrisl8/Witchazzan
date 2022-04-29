import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import returnToIntroScreen from './returnToIntroScreen.js';

function hotKeyHandler(sceneName) {
  // Return to intro text
  if (playerObject.keyState.p === 'keydown') {
    playerObject.keyState.p = null;
    returnToIntroScreen();
  }

  // Hot key to display/hide chat log
  if (playerObject.keyState.l === 'keydown') {
    playerObject.keyState.l = null;
    playerObject.scrollingTextBox.display(false);
  }

  // Hot key to turn dot trails on/off
  if (playerObject.keyState.t === 'keydown') {
    playerObject.keyState.t = null;
    playerObject.dotTrailsOn = !playerObject.dotTrailsOn;
  }

  // Send currently active Spell with space bar,
  // or touch input set by "sendSpell" on playerObject.
  if (
    playerObject.keyState[' '] === 'keydown' ||
    playerObject.sendSpell === true
  ) {
    playerObject.sendSpell = false;
    playerObject.keyState[' '] = null;
    castSpell(sceneName);
  }
}

export default hotKeyHandler;
