/* globals localStorage:true */
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';

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
  Instead of sending "this is me", instead send any hadron that I want to exist.
  I don't think "spawn" vs. "update" matters, but "destroy" does.
  Each hadron will have a GUID, even my own player.
  Each hadron can be its own emit, or they could be bundled together,
  but it might be easier on the client code to just send them ad hoc from the various
  points within the client code that are aware of them and update them.

  NOTE: There should still probably be a bundle of "player data" that has like, what scene "I" am in,
  which is not related to the "hadronData" that will include the player's hadron along with others.
 */

// TODO: We also need to note and send out collisions that happen on our client, so that other players know about it and/or deal with them?
sendDataToServer.spriteData = ({ sceneName, x, y }) => {
  if (communicationsObject.socket.connected) {
    const obj = {
      x,
      y,
      scene: sceneName,
      // TODO: This needs to work for any injected sprite, not just the player.
      id: playerObject.playerId,
      direction: playerObject.playerDirection,
      sprite: playerObject.spriteName,
      moving: !playerObject.playerStopped,
      chatOpen: playerObject.chatOpen,
    };
    // TODO: This is going to have to change in some way.
    if (playerObject.sendSpell) {
      // Only send positive spell, and only send it once.
      // Otherwise we may overwrite the server's version before it is acted upon.
      obj.spell = playerObject.spellOptions[playerObject.activeSpellKey];
      playerObject.sendSpell = false;
    }
    // TODO: This is going to have to change in some way.
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
        // TODO: This is going to have to change in some way.
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
      // Must ALWAYS send the id
      objectToSend.id = obj.id;
      communicationsObject.socket.emit('spriteData', objectToSend);
    }
    playerObject.lastSentPlayerDataObject = obj;
  }
};

sendDataToServer.token = () => {
  const token = localStorage.getItem('authToken');
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('token', token);
  }
};

sendDataToServer.command = (command) => {
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('command', { command });
    console.log(`Sent ${command} command to server.`);
  }
};

export default sendDataToServer;
