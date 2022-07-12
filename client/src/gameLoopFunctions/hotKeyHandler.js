import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import returnToIntroScreen from './returnToIntroScreen.js';

function hotKeyHandler(sceneName) {
  // Teleport back to home scene
  if (playerObject.keyState.h === 'keydown') {
    playerObject.keyState.h = null;
    playerObject.teleportToSceneNow = playerObject.defaultOpeningScene;
    playerObject.teleportToSceneNowEntrance = null;
  }

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
  if (playerObject.keyState.o === 'keydown') {
    playerObject.keyState.o = null;
    if (playerObject.isAdmin) {
      playerObject.dotTrailsOn = !playerObject.dotTrailsOn;
    }
  }

  // Send currently active Spell with space bar,
  // or touch input set by "sendSpell" on playerObject.
  if (
    playerObject.keyState[' '] === 'keydown' ||
    playerObject.sendSpell === true
  ) {
    playerObject.sendSpell = false;
    playerObject.keyState[' '] = null;
    castSpell({
      sceneName,
      spell: playerObject.activeSpell,
      direction: playerObject.playerDirection,
      initialX: playerObject.player.x,
      initialY: playerObject.player.y,
      owner: playerObject.playerId,
    });
  }
}

export default hotKeyHandler;
