import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';

function handleKeyboardInput(event) {
  // TODO: Notify user when not connected.
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    // not changing the keystate if we can't send because
    // the keystate is a reflection of what the server thinks,
    // and the game is meant to only work when connected.
    if (playerObject.keyState[event.key] !== event.type) {
      playerObject.keyState[event.key] = event.type;
      communicationsObject.socket.send(`${event.key},${event.type}`);
    }
  }
}

export default handleKeyboardInput;
