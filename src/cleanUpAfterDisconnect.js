import playerObject from './playerObject';

function cleanUpAfterDisconnect() {
  // Since most keyboard input is ignored when not connected,
  // we don't want people to be stuck running or firing while
  // they are offline.
  // TODO: Notify user when not connected.
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
