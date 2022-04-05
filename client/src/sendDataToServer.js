/* globals localStorage:true */
import _ from 'lodash';
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';

const sendDataToServer = {};
const sentData = new Map();
let lastSentPlayerDataObject;

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

sendDataToServer.playerData = ({ sceneName }) => {
  if (communicationsObject.socket.connected) {
    const objectToSend = {
      name: playerObject.name,
      x: playerObject.player.x,
      y: playerObject.player.y,
      scene: sceneName,
      id: playerObject.playerId,
      direction: playerObject.playerDirection,
      sprite: playerObject.spriteName,
      moving: !playerObject.playerStopped,
      chatOpen: playerObject.chatOpen,
    };
    if (!_.isEqual(objectToSend, lastSentPlayerDataObject)) {
      communicationsObject.socket.emit('hadronData', objectToSend);
      lastSentPlayerDataObject = { ...objectToSend };
    }
  }
};

sendDataToServer.hadronData = (key) => {
  if (!hadrons.get(key).id === key) {
    // Every hadron must also have the key as an id inside of it.
    // TODO: Fix it so that isn't required.
    const newHadron = { ...hadrons.get(key), id: key };
    hadrons.set(key, newHadron);
  }
  if (
    communicationsObject.socket.connected &&
    (!sentData.has(key) || !_.isEqual(sentData.get(key), hadrons.get(key)))
  ) {
    sentData.set(key, hadrons.get(key));
    communicationsObject.socket.emit('hadronData', hadrons.get(key));
  }
};

sendDataToServer.destroyHadron = (key) => {
  communicationsObject.socket.emit('destroyHadron', key);
};

sendDataToServer.makePlayerSayOff = (key) => {
  communicationsObject.socket.emit('makePlayerSayOff', key);
};

sendDataToServer.token = () => {
  const token = localStorage.getItem('authToken');
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('token', {
      token,
      sprite: playerObject.spriteName,
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
