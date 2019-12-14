import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './objects/communicationsObject';
import playerObject from './objects/playerObject';

const reportFunctions = {};
reportFunctions.reportFireball = (direction) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    let cardinalDirection = 'east';
    if (direction === 'up') {
      cardinalDirection = 'north';
    } else if (direction === 'down') {
      cardinalDirection = 'south';
    } else if (direction === 'left') {
      cardinalDirection = 'west';
    }
    const obj = {};
    obj.message_type = 'fireball';
    obj.direction = cardinalDirection;
    obj.sprite = 'fireball';
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
      sprite: playerObject.spriteName,
      moving: !playerObject.playerStopped,
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
