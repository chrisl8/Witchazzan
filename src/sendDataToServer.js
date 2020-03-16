import communicationsObject from './objects/communicationsObject';
import playerObject from './objects/playerObject';

const sendDataToServer = {};
sendDataToServer.reportFireball = (direction) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
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
sendDataToServer.reportKeyboardState = (key, state) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {};
    obj.message_type = 'keyboard-update';
    obj.key = key;
    obj.state = state;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
sendDataToServer.reportChat = (text) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {};
    obj.message_type = 'chat';
    obj.text = text;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
sendDataToServer.reportPlayerLocation = ({
  sceneName,
  tileBasedCoordinates,
}) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {
      message_type: 'location-update',
      x: tileBasedCoordinates.x,
      y: tileBasedCoordinates.y,
      scene: sceneName,
      direction: playerObject.playerDirection,
      sprite: playerObject.spriteName,
      moving: !playerObject.playerStopped,
    };
    let sendData = false;
    // This comparison is naive, but our objects are well defined
    const previousObjectKeys = Object.keys(
      playerObject.lastSentPlayerLocationObject,
    );
    if (Object.keys(obj).length === previousObjectKeys.length) {
      previousObjectKeys.forEach((key) => {
        if (
          obj[key] === undefined ||
          playerObject.lastSentPlayerLocationObject[key] !== obj[key]
        ) {
          // console.log(`${key}: ${obj[key]}`);
          sendData = true;
        }
      });
    } else {
      sendData = true;
    }
    if (sendData) {
      // Only send data if it has changed,
      // rather than wasting bandwidth and
      // the server's CPU cycles.
      playerObject.lastSentPlayerLocationObject = obj;
      communicationsObject.socket.send(JSON.stringify(obj));
    }
  }
};
sendDataToServer.reportLogin = (username, password) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {
      message_type: 'login',
      username,
      password,
      sprite: playerObject.spriteName,
    };
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};
sendDataToServer.reportCommand = (command) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {};
    obj.message_type = 'command';
    obj.command = command;
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
    console.log(`Sent ${jsonString} to server.`);
  }
};
sendDataToServer.dumpPlayerObject = () => {
  console.log(playerObject);
};

export default sendDataToServer;
