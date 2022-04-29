import textObject from '../objects/textObject.js';
import playerObject from '../objects/playerObject.js';

function cleanUpScene() {
  // Mark all scene text objects as not currently displayed so the new scene can display them again
  // eslint-disable-next-line no-unused-vars
  for (const [, value] of Object.entries(textObject)) {
    value.hasBeenDisplayedInThisScene = false;
  }

  // Reset cameraScaleFactor for next scene.
  playerObject.cameraScaleFactor = 0;
}

export default cleanUpScene;
