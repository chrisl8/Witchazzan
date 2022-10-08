/* globals window:true */
/* globals localStorage:true */
import socket from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import * as fflate from 'fflate';
import communicationsObject from './objects/communicationsObject.js';
import sendDataToServer from './sendDataToServer.js';
import playerObject from './objects/playerObject.js';
import parseHadronsFromServer from './parseHadronsFromServer.js';
import hadrons from './objects/hadrons.js';
import returnToIntroScreen from './gameLoopFunctions/returnToIntroScreen.js';
import clientVersion from '../../server/utilities/version.js';
import mapUtils from '../../server/utilities/mapUtils.js';
import textObject from './objects/textObject.js';

function receiveDataFromServer() {
  if (communicationsObject.socket && communicationsObject.socket.close) {
    communicationsObject.socket.close();
  }

  if (window.location.port === '3001') {
    communicationsObject.socket = socket.connect(
      `${window.location.hostname}:8080`,
      {
        transports: ['websocket'],
        timeout: 5000,
        parser: msgpackParser,
      },
    );
  } else {
    communicationsObject.socket = socket.connect({
      transports: ['websocket'],
      timeout: 5000,
      parser: msgpackParser,
    });
  }

  communicationsObject.socket.on('sendToken', () => {
    localStorage.removeItem('disconnectReason');
    sendDataToServer.token();
  });

  communicationsObject.socket.on('unauthorized', () => {
    localStorage.removeItem('authToken');
    // We just need to sign in again.
    returnToIntroScreen();
  });

  // The local client won't start the game until this is received and parsed.
  communicationsObject.socket.on('hadrons', (inputData) => {
    const uint8Array = new Uint8Array(inputData[1]);
    // console.log(uint8Array)
    const decompressed = fflate.decompressSync(uint8Array);
    const origText = fflate.strFromU8(decompressed);
    // console.log(origText)
    // const decompressedOutput = unishox2_decompress_simple(
    //   inputData[0], // The compressed data to extract.
    //   inputData[1] // How much memory to allocate for decompression. If it is too short it crashes.
    // ); // Returns the decompressed data.
    parseHadronsFromServer(mapUtils.parse(origText));
  });

  // Sometimes the server has to force us to delete a hadron,
  // typically one that we own that was deleted by outside forces,
  // despite our code being sure we are the on currently in control of it.
  communicationsObject.socket.on('deleteHadron', (key) => {
    hadrons.delete(key);
  });

  // The server cannot update hadrons that we control,
  // so it asks us to do so on its behalf.
  communicationsObject.socket.on('updateHadron', (data) => {
    if (hadrons.get(data.id)?.ctr === playerObject.playerId) {
      const newHadronData = hadrons.get(data.id);
      data.updates.forEach((entry) => {
        newHadronData[entry.key] = entry.value;
      });
      hadrons.set(data.id, newHadronData);
      // We must immediately send the data back, as the normal update cycle won't send data for
      // hadrons we don't control, and typically what we have been asked to do
      // is relinquish control.
      sendDataToServer.hadronData(newHadronData);
    }
  });

  communicationsObject.socket.on('txt', (inputData) => {
    if (inputData.typ === 'chat') {
      if (playerObject.scrollingTextBox) {
        // Sometimes we get a chat message before scrollingTextBox is initialized
        playerObject.scrollingTextBox.chat(inputData);
      }
    } else if (inputData.typ === 'fad') {
      textObject.enterSceneText.text = inputData.content;
      textObject.enterSceneText.display();
    }
  });

  communicationsObject.socket.on('init', (inputData) => {
    // Check whether we need to force a client refresh.
    // This will only happen if the client happens to be open,
    // but in the background during an update deployment.
    if (inputData.serverVersion !== clientVersion) {
      localStorage.setItem(
        'disconnectReason',
        'Client and Server versions did not match. An update was forced. Attempting to reconnect now...',
      );
      window.location.reload();
    }
    playerObject.playerId = inputData.id;
    // console.log('Player ID:', playerObject.playerId); // For debugging
    playerObject.name = inputData.name;
    playerObject.isAdmin = inputData.admin;
    playerObject.defaultOpeningScene = inputData.defaultOpeningScene;
    localStorage.setItem('playerName', playerObject.name);
  });

  communicationsObject.socket.on('importantItems', (inputData) => {
    playerObject.importantItems = inputData;
    playerObject.importantItemsUpdated = true;
  });

  // Handle graceful server shutdown by restarting before it goes away.
  communicationsObject.socket.on('shutdown', () => {
    localStorage.setItem(
      'disconnectReason',
      'Small Hadron Cooperator was shut down. Attempting to reconnect...',
    );
    window.location.reload();
  });

  // Handle graceful server shutdown by restarting before it goes away.
  communicationsObject.socket.on('restart', () => {
    localStorage.setItem(
      'disconnectReason',
      'Small Hadron Cooperator asked us to restart. Attempting to reconnect...',
    );
    window.location.reload();
  });

  // Handle being kicked off due to being logged on somewhere else.
  communicationsObject.socket.on('multiple_logins', () => {
    localStorage.setItem('multiple_logins', true);
    returnToIntroScreen();
  });

  // Handle disconnect
  communicationsObject.socket.on('disconnect', () => {
    localStorage.setItem(
      'disconnectReason',
      'Small Hadron Cooperator connection lost. Attempting to reconnect...',
    );
    window.location.reload();
  });

  communicationsObject.socket.on('damageHadron', (data) => {
    if (data.id === playerObject.playerId) {
      // Player's own health isn't held in their hadron.
      let newHealth = playerObject.health;
      if (!newHealth === undefined) {
        newHealth = playerObject.maxHealth;
      }
      newHealth -= data.amount;
      if (newHealth < 0) {
        newHealth = 0;
      }
      playerObject.health = newHealth;
    } else if (
      hadrons.has(data.id) &&
      hadrons.get(data.id)?.ctr === playerObject.playerId
    ) {
      let newHealth = hadrons.get(data.id)?.hlt;
      if (newHealth === undefined) {
        newHealth = hadrons.get(data.id)?.mxh ? hadrons.get(data.id)?.mxh : 100;
      }
      newHealth -= data.amount;
      if (newHealth < 0) {
        newHealth = 0;
      }
      hadrons.get(data.id).hlt = newHealth;
    }
  });
}

export default receiveDataFromServer;
