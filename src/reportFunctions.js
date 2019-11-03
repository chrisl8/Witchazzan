import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';
import textObject from './textObject';

const reportFunctions = {};
reportFunctions.reportFireball = (direction) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'fireball';
    obj.direction = direction;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
reportFunctions.reportKeyboardState = (key, state) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'keyboard-update';
    obj.key = key;
    obj.state = state;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
reportFunctions.reportChat = (text) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'chat';
    obj.text = text;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
reportFunctions.reportLocation = (sceneName) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {
      message_type: 'location-update',
      x: playerObject.player.x,
      y: playerObject.player.y,
      scene: sceneName,
      direction: playerObject.playerDirection,
    };
    communicationsObject.socket.send(JSON.stringify(obj));
  }
};
reportFunctions.reportLogin = (username, password) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'login';
    obj.username = username;
    obj.password = password;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
reportFunctions.reportCommand = (command) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'command';
    obj.command = command;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
    console.log(`Sent ${jsonString} to server.`);
  }
};
reportFunctions.dumpPlayerObject = () => {
  console.log(playerObject);
};

export default reportFunctions;
