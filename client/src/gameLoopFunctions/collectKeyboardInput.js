import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import returnToIntroScreen from './returnToIntroScreen.js';

function collectKeyboardInput(sceneName) {
  // Teleport back to home scene
  if (playerObject.keyState.h === 'keydown') {
    playerObject.keyState.h = null;
    if (playerObject.isAdmin) {
      playerObject.teleportToSceneNow = playerObject.defaultOpeningScene;
      playerObject.teleportToSceneNowEntrance = null;
    }
  }

  // Return to intro text
  if (playerObject.keyState.p === 'keydown') {
    playerObject.keyState.p = null;
    returnToIntroScreen();
  }

  // Key to display/hide chat log
  if (playerObject.keyState.l === 'keydown') {
    playerObject.keyState.l = null;
    playerObject.scrollingTextBox.display(false);
  }

  // IF the chat log is open, then Escape will close it.
  // if (playerObject.keyState.Escape === 'keydown' && )
  if (
    playerObject.keyState.Escape === 'keydown' &&
    !playerObject.domElements.Scrolling.hidden
  ) {
    playerObject.keyState.Escape = null;
    playerObject.scrollingTextBox.display(false);
  }

  // Key to turn dot trails on/off
  if (playerObject.keyState.o === 'keydown') {
    playerObject.keyState.o = null;
    if (playerObject.isAdmin) {
      playerObject.dotTrailsOn = !playerObject.dotTrailsOn;
    }
  }

  // Key to interact with nearby items
  if (playerObject.keyState.f === 'keydown') {
    playerObject.keyState.f = null;
    playerObject.interactNow = true;
  }

  // Key to rotate yourself or items in your hand
  if (playerObject.keyState.r === 'keydown') {
    playerObject.keyState.r = null;
    playerObject.rotateNow = true;
  }

  // Inventory
  if (playerObject.keyState.i === 'keydown') {
    playerObject.keyState.i = null;
    playerObject.teleportToSceneNow = 'Library';
  }

  // Testing Stuff
  if (playerObject.keyState.b === 'keydown') {
    playerObject.keyState.b = null;
    playerObject.testNow = true;
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

export default collectKeyboardInput;
