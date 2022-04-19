/* globals localStorage:true */
import _ from 'lodash';
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import deletedHadronList from './objects/deletedHadronList.js';

const sendDataToServer = {};
const sentData = new Map();
let lastSentPlayerDataObject;

sendDataToServer.enterScene = (sceneName) => {
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('enterScene', sceneName);
  }
};

sendDataToServer.chat = ({ text, targetPlayerId, fromPlayerId, room }) => {
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('chat', {
      text,
      targetPlayerId,
      fromPlayerId,
      room,
    });
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
      health: playerObject.health,
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
  // The deletedHadronList is to prevent the race condition of us deleting a hadron,
  // but then immediately adding it again because we get an incoming packet that includes it,
  // before the server has a chance to delete it.
  deletedHadronList.push(key);
  communicationsObject.socket.emit('destroyHadron', key);
};

sendDataToServer.makePlayerSayOof = (key) => {
  communicationsObject.socket.emit('makePlayerSayOof', key);
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
