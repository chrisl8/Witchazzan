import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';

function handleKeyboardInput(event) {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    // not changing the keyState if we can't send because
    // the keyState is a reflection of what the server thinks,
    // and the game is meant to only work when connected.
    if (playerObject.keyState[event.key] !== event.type) {
      playerObject.keyState[event.key] = event.type;
      communicationsObject.socket.send(`${event.key},${event.type}`);
    }
  }
  var text = 'garbage';
//function chat(text){
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    communicationsObject.socket.send('msg,' + text);
  }
//}
}
function reportLocation () {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    communicationsObject.socket.send(`loc,${playerObject.player.body.x},${playerObject.player.body.y}`);
  }
}

export default handleKeyboardInput;
