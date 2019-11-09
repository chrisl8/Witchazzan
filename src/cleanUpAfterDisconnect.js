import playerObject from './objects/playerObject';
import textObject from './objects/textObject';

function cleanUpAfterDisconnect() {
  if (!textObject.connectingText.shouldBeActiveNow) {
    textObject.reconnectingText.shouldBeActiveNow = true;
  }
  // Since most keyboard input is ignored when not connected,
  // we don't want people to be stuck running or firing while
  // they are offline.
  const keysToSetUp = [
    'w',
    'a',
    's',
    'd',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ];
  keysToSetUp.forEach((key) => {
    playerObject.keyState[key] = 'keyup';
  });
}

export default cleanUpAfterDisconnect;
