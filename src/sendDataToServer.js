import communicationsObject from './objects/communicationsObject';
import playerObject from './objects/playerObject';

const sendDataToServer = {};

sendDataToServer.chat = (text, targetPlayerId) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {};
    obj.message_type = 'chat';
    obj.text = text;
    if (targetPlayerId) {
      obj.targetPlayerId = targetPlayerId;
    }
    const jsonString = JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
};

sendDataToServer.playerData = ({ sceneName, tileBasedCoordinates }) => {
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {
      x: tileBasedCoordinates.x,
      y: tileBasedCoordinates.y,
      scene: sceneName,
      direction: playerObject.playerDirection,
      sprite: playerObject.spriteName,
      moving: !playerObject.playerStopped,
      force: false, // Always reset server to false after we saw the packet.
      chatOpen: playerObject.chatOpen,
    };
    if (playerObject.spell) {
      // Only send positive spell, and only send it once.
      // Otherwise we may overwrite the server's version before it is acted upon.
      obj.spell = playerObject.spell;
      playerObject.spell = null;
    }
    // Only send data if it has changed,
    // and only send the actual keys that have changed.
    // This saves bandwidth and server CPU cycles,
    // as well as avoids some race conditions on ths server.
    const objectToSend = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (
        playerObject.lastSentPlayerDataObject[key] === undefined ||
        playerObject.lastSentPlayerDataObject[key] !== obj[key]
      ) {
        objectToSend[key] = value;
      }
    });
    if (Object.keys(objectToSend).length > 0) {
      // Only send data if it has changed,
      // rather than wasting bandwidth and
      // the server's CPU cycles.
      playerObject.lastSentPlayerDataObject = obj;
      objectToSend.message_type = 'location-update';
      communicationsObject.socket.send(JSON.stringify(objectToSend));
    }
  }
};

sendDataToServer.login = (username, password) => {
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

sendDataToServer.command = (command) => {
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

export default sendDataToServer;
