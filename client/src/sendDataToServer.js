/* globals localStorage:true */
import _ from 'lodash';
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';

const sendDataToServer = {};
const sentData = new Map();
let lastSentPlayerDataObject;

sendDataToServer.enterScene = (sceneName) => {
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('enterScene', sceneName);
  }
};

sendDataToServer.chat = (text, targetPlayerId) => {
  if (communicationsObject.socket.connected) {
    const obj = { text };
    if (targetPlayerId) {
      obj.targetPlayerId = targetPlayerId;
    }
    communicationsObject.socket.emit('chat', obj);
  }
};

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
      lastSentPlayerDataObject = { ...objectToSend };
      communicationsObject.socket.emit('hadronData', objectToSend);
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
