import playerObject from './playerObject';

function cleanUpAfterDisconnect() {
  if (!playerObject.sceneText.connectingText.shouldBeActiveNow) {
    playerObject.sceneText.reconnectingText.shouldBeActiveNow = true;
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
