import playerObject from './objects/playerObject';
import wait from './utilities/wait';

async function waitForConnectionAndInitialPlayerPosition() {
  // Don't start until we have the initial connection
  // with the player's initial position.

  while (!playerObject.initialPositionReceived) {
    // eslint-disable-next-line no-await-in-loop
    await wait(1);
  }
}

export default waitForConnectionAndInitialPlayerPosition;
