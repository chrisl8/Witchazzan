/* globals window:true */
/* globals localStorage:true */
import socket from 'socket.io-client';
import communicationsObject from './objects/communicationsObject.js';
import sendDataToServer from './sendDataToServer.js';
import playerObject from './objects/playerObject.js';
import parseHadronsFromServer from './parseHadronsFromServer.js';
import hadrons from './objects/hadrons.js';
import returnToIntroScreen from './gameLoopFunctions/returnToIntroScreen.js';
import clientVersion from '../../shared/version.mjs';

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
      },
    );
  } else {
    communicationsObject.socket = socket.connect({
      transports: ['websocket'],
      timeout: 5000,
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
    parseHadronsFromServer(new Map(inputData));
  });

  // Sometimes the server has to force us to delete a hadron,
  // typically one that we own that was deleted by outside forces,
  // despite our code being sure we are the on currently in control of it.
  communicationsObject.socket.on('deleteHadron', (key) => {
    hadrons.delete(key);
  });

  communicationsObject.socket.on('chat', (inputData) => {
    if (playerObject.scrollingTextBox) {
      // Sometimes we get a chat message before scrollingTextBox is initialized
      playerObject.scrollingTextBox.chat(inputData);
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
    playerObject.name = inputData.name;
    playerObject.isAdmin = inputData.admin;
    playerObject.defaultOpeningScene = inputData.defaultOpeningScene;
    localStorage.setItem('playerName', playerObject.name);
  });

  // Handle graceful server shutdown by restarting before it goes away.
  communicationsObject.socket.on('shutdown', () => {
    localStorage.setItem(
      'disconnectReason',
      'Small Hadron Cooperator was shut down. Attempting to reconnect...',
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
