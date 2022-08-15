/* globals localStorage:true */
import _ from 'lodash';
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import deletedHadronList from './objects/deletedHadronList.js';
import validateHadron from '../../shared/validateHadron.mjs';
import textObject from './objects/textObject.js';
import clientSprites from './objects/clientSprites.js';
import returnToIntroScreen from './gameLoopFunctions/returnToIntroScreen.js';

const sendDataToServer = {};
const sentData = new Map();
let lastSentPlayerDataObject;

sendDataToServer.enterScene = (sceneName) => {
  sentData.clear(); // Avoid memory leaks.
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
      nam: playerObject.name,
      x: playerObject.player.x,
      y: playerObject.player.y,
      psc: playerObject.previousScene.name,
      px: playerObject.previousScene.x,
      py: playerObject.previousScene.y,
      typ: 'player',
      scn: sceneName,
      id: playerObject.playerId,
      own: playerObject.playerId,
      ctr: playerObject.playerId,
      dir: playerObject.playerDirection,
      spr: playerObject.spriteName,
      mov: !playerObject.playerStopped,
      cho: playerObject.chatOpen,
      hlt: playerObject.health,
      mxh: playerObject.maxHealth,
      dph: 4,
    };
    if (
      validateHadron.client(objectToSend) &&
      !_.isEqual(objectToSend, lastSentPlayerDataObject)
    ) {
      lastSentPlayerDataObject = { ...objectToSend };
      communicationsObject.socket.emit('hadronData', objectToSend);
    }
  }
};

sendDataToServer.hadronData = (key) => {
  // Using a copy of the data to avoid race conditions with
  // the sentData test, and failing to send all updates.
  const hadronData = { ...hadrons.get(key) };
  if (validateHadron.client(hadronData)) {
    if (
      communicationsObject.socket.connected &&
      (!sentData.has(key) || !_.isEqual(sentData.get(key), hadronData))
    ) {
      communicationsObject.socket.emit('hadronData', hadronData);
      sentData.set(key, hadronData);
    }
  } else {
    console.error('Bad hadron key:', key);
    textObject.enterSceneText.text = 'Attempted to send bad data! >:(';
    textObject.enterSceneText.display();
  }
};

sendDataToServer.createHadron = (data) => {
  communicationsObject.socket.emit('createHadron', data);
};

sendDataToServer.destroyHadron = async (key, obstacleSpriteKey, scene) => {
  sentData.delete(key); // Avoid memory leak.
  // Sometimes we get multiple delete requests for the same hadron.
  if (deletedHadronList.indexOf(key) === -1 && hadrons.has(key)) {
    // The deletedHadronList is to prevent the race condition of us deleting a hadron,
    // but then immediately adding it again because we get an incoming packet that includes it,
    // before the server has a chance to delete it.
    deletedHadronList.push(key);
    // Set velocity to 0 so that it doesn't appear to move past target,
    // or hit other things
    clientSprites.get(key).sprite.body.setVelocityX(0);
    clientSprites.get(key).sprite.body.setVelocityY(0);
    // Remove MY collider so that it doesn't keep triggering
    if (
      obstacleSpriteKey &&
      scene &&
      clientSprites.get(obstacleSpriteKey)?.colliders[key]
    ) {
      scene.physics.world.removeCollider(
        clientSprites.get(obstacleSpriteKey)?.colliders[key],
      );
    }
    hadrons.delete(key);
    // Once the hadron is deleted then cleanUpClientSprites() will remove the sprite itself.
    communicationsObject.socket.emit('destroyHadron', key);
  }
};

sendDataToServer.grabHadron = (id) => {
  communicationsObject.socket.emit('grab', id);
};

sendDataToServer.damageHadron = (data) => {
  communicationsObject.socket.emit('damageHadron', data);
};

sendDataToServer.token = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (communicationsObject.socket.connected) {
      communicationsObject.socket.emit('token', {
        token,
        sprite: playerObject.spriteName,
      });
    }
  } else {
    // If we don't have a token, then we just need to sign in.
    returnToIntroScreen();
  }
};

sendDataToServer.command = (command) => {
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('command', { command });
    console.log(`Sent ${command} command to server.`);
  }
};

export default sendDataToServer;
