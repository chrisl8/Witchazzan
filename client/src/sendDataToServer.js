import communicationsObject from './objects/communicationsObject';
import playerObject from './objects/playerObject';

const sendDataToServer = {};

sendDataToServer.chat = (text, targetPlayerId) => {
  if (communicationsObject.socket.connected) {
    const obj = { text };
    if (targetPlayerId) {
      obj.targetPlayerId = targetPlayerId;
    }
    communicationsObject.socket.emit('chat', obj);
  }
};

// TODO: This assumes that the server will process the data,
//       but now the clients process it instead, so it probably needs to change somewhat.
/*
  TODO:
  Instead of sending "this is me", instead send any sprite that I want to exist.
  I don't think "spawn" vs. "update" matters, but "destroy"might.
  Each sprite will have a GUID, even my own player.
  Each sprite can be its own emit, or they could be bundled together,
  but it might be easier on the client code to just send them ad hoc from the various
  points within the client code that are aware of them and update them.

  NOTE: There should still probably be a bundle of "player data" taht has like, what scene "I" am in,
  which is not related to the "spriteData" taht will include the player's sprite along with others.
 */

// TODO: We also need to note and send out collisions that happen on our client, so that other players know about it and/or deal with them?
sendDataToServer.playerData = ({ sceneName, tileBasedCoordinates }) => {
  if (communicationsObject.socket.connected) {
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
        playerObject.lastSentPlayerDataObject[key] !== obj[key] ||
        // The client needs to send force: false EVERY time it gets a force: true
        // from the server, even if it sent force: false already in the last packet.
        key === 'force'
      ) {
        objectToSend[key] = value;
      }
    });
    if (Object.keys(objectToSend).length > 0) {
      // Only send data if it has changed,
      // rather than wasting bandwidth and
      // the server's CPU cycles.
      objectToSend.message_type = 'location-update';
      communicationsObject.socket.emit('playerData', objectToSend);
    }
    playerObject.lastSentPlayerDataObject = obj;
  }
};

sendDataToServer.login = () => {
  // The server only uses two fields from the login packet:
  // sprite
  // moving - which is always false at login of course.
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('login', {
      sprite: playerObject.spriteName,
      moving: false,
    });
  }
};

sendDataToServer.command = (command) => {
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('command', { command });
    console.log(`Sent ${command} command to server.`);
  }
};

export default sendDataToServer;