/* globals window:true */
/* globals localStorage:true */
import openSocket from 'socket.io-client';
import communicationsObject from './objects/communicationsObject.js';
import textObject from './objects/textObject.js';
import sendDataToServer from './sendDataToServer.js';
import playerObject from './objects/playerObject.js';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect.js';
import parseHadronsFromServer from './parseHadronsFromServer.js';
import jsonMapStringify from '../../shared/jsonMapStringify.mjs';

function receiveDataFromServer() {
  if (communicationsObject.socket && communicationsObject.socket.close) {
    communicationsObject.socket.close();
  }

  if (window.location.hostname === 'localhost') {
    communicationsObject.socket = openSocket('http://localhost:8080/');
  } else {
    communicationsObject.socket = openSocket();
  }

  communicationsObject.socket.on('sendToken', () => {
    sendDataToServer.token();
  });

  communicationsObject.socket.on('unauthorized', () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  });

  // This is just the server saying, "Hi", to which we respond with a formal login.
  communicationsObject.socket.on('welcome', () => {
    playerObject.socketCurrentlyConnected = true;
    textObject.connectingText.shouldBeActiveNow = false;
    textObject.reconnectingText.shouldBeActiveNow = false;
    textObject.notConnectedCommandResponse.shouldBeActiveNow = false;
  });

  // The local client won't start the game until this is received and parsed.
  communicationsObject.socket.on('sprites', (inputData) => {
    const sprites = JSON.parse(inputData, reviver);
    parseGamePieceListFromServer(sprites);
  });

  communicationsObject.socket.on('chat', (inputData) => {
    if (playerObject.scrollingTextBox) {
      // Sometimes we get a chat message before scrollingTextBox is initialized
      playerObject.scrollingTextBox.chat(inputData);
    }
  });
  communicationsObject.socket.on('identity', (inputData) => {
    playerObject.playerId = inputData.id;
  });

  // Handle disconnect
  communicationsObject.socket.on('disconnect', () => {
    console.log('disconnect');
    playerObject.socketCurrentlyConnected = false;
    // Clear last sent data to make sure we send it all again
    playerObject.lastSentPlayerDataObject = {};
    cleanUpAfterDisconnect();
  });
}

export default receiveDataFromServer;
