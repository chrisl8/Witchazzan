import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';

const reportFunctions = {};
reportFunctions.reportKeyboardState = (key, state) => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'keyboard-update';
    obj.key = key;
    obj.state = state;
    const jsonString = JSON.stringify(obj);
    playerObject.sceneText.incomingChatText.shouldBeActiveNow = true;
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
reportFunctions.reportLocation = () => {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    const obj = {};
    obj.message_type = 'location-update';
    obj.x = playerObject.player.body.x;
    obj.y = playerObject.player.body.y;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
    console.log(`Sent ${jsonString} to server.`);
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
    console.log(`Sent ${jsonString} to server.`);
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

export default reportFunctions;
