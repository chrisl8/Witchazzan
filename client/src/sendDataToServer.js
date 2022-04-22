/* globals localStorage:true */
import _ from 'lodash';
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import deletedHadronList from './objects/deletedHadronList.js';
import validateHadron from '../../shared/validateHadron.mjs';
import wait from '../../shared/wait.mjs';
import textObject from './objects/textObject.js';
import clientSprites from './objects/clientSprites.js';

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
      typ: 'player',
      scn: sceneName,
      id: playerObject.playerId,
      own: playerObject.playerId,
      ctrl: playerObject.playerId,
      dir: playerObject.playerDirection,
      sprt: playerObject.spriteName,
      mov: !playerObject.playerStopped,
      chtO: playerObject.chatOpen,
      hlth: playerObject.health,
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
  if (validateHadron.client(hadrons.get(key))) {
    if (
      communicationsObject.socket.connected &&
      (!sentData.has(key) || !_.isEqual(sentData.get(key), hadrons.get(key)))
    ) {
      sentData.set(key, hadrons.get(key));
      communicationsObject.socket.emit('hadronData', hadrons.get(key));
    }
  } else {
    console.error('Bad hadron key:', key);
    textObject.enterSceneText.text = 'Attempted to send bad data! >:(';
    textObject.enterSceneText.display();
  }
};

sendDataToServer.destroyHadron = async (key, obstacleSpriteKey, scene) => {
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
    // The other players need to see the last position before it was deleted.
    await wait(100); // TODO: Is there a way to determine this instead of guessing?
    hadrons.delete(key);
    communicationsObject.socket.emit('destroyHadron', key);
  }
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
