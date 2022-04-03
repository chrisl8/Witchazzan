import playerObject from './objects/playerObject.js';
import textObject from './objects/textObject.js';

function cleanUpAfterDisconnect() {
  if (!textObject.connectingText.shouldBeActiveNow) {
    textObject.reconnectingText.shouldBeActiveNow = true;
  }
  // Since most keyboard input is ignored when not connected,
  // we don't want people to be stuck running or firing while
  // they are offline.
  const keysToClearInputFor = [
    'w',
    'a',
    's',
    'd',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ];
  keysToClearInputFor.forEach((key) => {
    playerObject.keyState[key] = 'keyup';
  });
}

export default cleanUpAfterDisconnect;
