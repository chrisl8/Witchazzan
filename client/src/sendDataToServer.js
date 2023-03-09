/* globals localStorage:true */
import isEqual from 'lodash/isEqual.js';
import communicationsObject from './objects/communicationsObject.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import deletedHadronList from './objects/deletedHadronList.js';
import validateHadron from '../../server/utilities/validateHadron.js';
import textObject from './objects/textObject.js';
import clientSprites from './objects/clientSprites.js';
import returnToIntroScreen from './gameLoopFunctions/returnToIntroScreen.js';
import debugLog from './utilities/debugLog.js';

const sendDataToServer = {};
const sentData = new Map();
let lastSentPlayerDataObject;
let lastSentTxtObjectList = []; // No spamming

sendDataToServer.enterScene = (sceneName) => {
  sentData.clear(); // Avoid memory leaks.
  if (communicationsObject.socket.connected) {
    communicationsObject.socket.emit('enterScene', sceneName);
  }
};

sendDataToServer.txt = ({
  text,
  targetPlayerId,
  fromPlayerId,
  room,
  typ = 'chat',
}) => {
  if (text !== undefined && communicationsObject.socket.connected) {
    const objectToSend = {
      text,
      typ,
    };
    // Only add optional keys if they are populated.
    if (targetPlayerId) {
      objectToSend.targetPlayerId = targetPlayerId;
    }
    if (fromPlayerId) {
      objectToSend.fromPlayerId = fromPlayerId;
    }
    if (room) {
      objectToSend.room = room;
    }

    // Avoid spamming
    let send = true;
    // Remove entries that are older than X seconds.
    lastSentTxtObjectList = lastSentTxtObjectList.filter(
      (entry) => Math.abs((new Date().getTime() - entry.timeStamp) / 1000) < 5,
    );
    // Then do not send if this exact entry has been sent recently
    for (const entry of lastSentTxtObjectList) {
      if (
        entry.text === objectToSend.text &&
        entry.targetPlayerId === objectToSend.targetPlayerId &&
        entry.fromPlayerId === objectToSend.fromPlayerId &&
        entry.room === objectToSend.room &&
        entry.typ === objectToSend.typ
      ) {
        send = false;
      }
    }

    if (send) {
      lastSentTxtObjectList.push({
        ...objectToSend,
        timeStamp: new Date().getTime(),
      });
      communicationsObject.socket.emit('txt', objectToSend);
    }
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
      !isEqual(objectToSend, lastSentPlayerDataObject)
    ) {
      lastSentPlayerDataObject = { ...objectToSend };
      communicationsObject.socket.emit('hadronData', objectToSend);
    }
  }
};

// This should be called almost exclusively from updateHadrons.js
// With some exceptions, the primary one being that updateHadrons.js will NOT send
// data for hadrons from other scenes, so you must call this manually
// if you "push" a hadron to another scene.
sendDataToServer.hadronData = (hadronData, key) => {
  if (validateHadron.client(hadronData)) {
    if (
      communicationsObject.socket.connected &&
      (!sentData.has(key) || !isEqual(sentData.get(key), hadronData))
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
  // Sometimes we get multiple delete requests for the same hadron.
  if (deletedHadronList.indexOf(key) === -1 && hadrons.has(key)) {
    // The deletedHadronList is to prevent the race condition of us deleting a hadron,
    // but then immediately adding it again because we get an incoming packet that includes it,
    // before the server has a chance to delete it.
    deletedHadronList.push(key);
    // Set velocity to 0 so that it doesn't appear to move past target,
    // or hit other things
    if (clientSprites.has(key)) {
      clientSprites.get(key).sprite.body.setVelocityX(0);
      clientSprites.get(key).sprite.body.setVelocityY(0);
    }
    // Remove MY collider so that it doesn't keep triggering
    if (
      obstacleSpriteKey &&
      scene &&
      clientSprites.has(obstacleSpriteKey) &&
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
  sentData.delete(key); // Avoid memory leak.
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
    debugLog(`Sent ${command} command to server.`);
  }
};

export default sendDataToServer;
