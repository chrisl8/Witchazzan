import handleKeyboardInput from '../handleKeyboardInput.js';
import playerObject from '../objects/playerObject.js';

function loadTesting(delta) {
  // Never die!
  playerObject.health = 1000;
  if (!playerObject.lastLoadTestFire) {
    playerObject.lastLoadTestFire = 0;
  }
  playerObject.lastLoadTestFire += delta;
  if (playerObject.lastLoadTestFire > 50) {
    playerObject.lastLoadTestFire = 0;
    handleKeyboardInput({ key: ' ', type: 'keydown' });
  }
}

export default loadTesting;
