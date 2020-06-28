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
      chatOpen: playerObject.chatOpen,
    };
    if (playerObject.sendSpell) {
      // Only send positive spell, and only send it once.
      // Otherwise we may overwrite the server's version before it is acted upon.
      obj.spell = playerObject.spellOptions[playerObject.activeSpellKey];
      playerObject.sendSpell = false;
    }
    if (playerObject.force) {
      // Always reset this to false
      obj.force = false;
      playerObject.force = false;
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
      objectToSend.message_type = 'location-update';
      communicationsObject.socket.send(JSON.stringify(objectToSend));
    }
    playerObject.lastSentPlayerDataObject = obj;
  }
};

sendDataToServer.login = () => {
  // The server only uses two fields from the login packet:
  // sprite
  // moving - which is always false at login of course.
  if (
    communicationsObject.socket.readyState === communicationsObject.status.OPEN
  ) {
    const obj = {
      message_type: 'login',
      sprite: playerObject.spriteName,
      moving: false,
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
