/* globals window:true */
/* globals localStorage:true */
import socket from 'socket.io-client';
import communicationsObject from './objects/communicationsObject.js';
import textObject from './objects/textObject.js';
import sendDataToServer from './sendDataToServer.js';
import playerObject from './objects/playerObject.js';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect.js';
import parseHadronsFromServer from './parseHadronsFromServer.js';
import hadrons from './objects/hadrons.js';

function receiveDataFromServer() {
  if (communicationsObject.socket && communicationsObject.socket.close) {
    communicationsObject.socket.close();
  }

  if (
    window.location.hostname === 'localhost' &&
    window.location.port !== '8080'
  ) {
    communicationsObject.socket = socket.connect('localhost:8080', {
      transports: ['websocket'],
    });
  } else {
    communicationsObject.socket = socket.connect({
      transports: ['websocket'],
    });
  }

  communicationsObject.socket.on('sendToken', () => {
    sendDataToServer.token();
    // TODO: Test if we can hack the client to receive data without authenticating.
    // textObject.connectingText.shouldBeActiveNow = false;
    // textObject.reconnectingText.shouldBeActiveNow = false;
    // textObject.notConnectedCommandResponse.shouldBeActiveNow = false;
    // playerObject.playerId = 1;
  });

  communicationsObject.socket.on('unauthorized', () => {
    localStorage.removeItem('authToken');
    window.location.reload();
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
    playerObject.playerId = inputData.id;
    playerObject.name = inputData.name;
    playerObject.defaultOpeningScene = inputData.defaultOpeningScene;
    localStorage.setItem('playerName', playerObject.name);
    textObject.connectingText.shouldBeActiveNow = false;
    textObject.reconnectingText.shouldBeActiveNow = false;
    textObject.notConnectedCommandResponse.shouldBeActiveNow = false;
  });

  // Handle disconnect
  communicationsObject.socket.on('disconnect', () => {
    console.log('disconnect');
    // Clear last sent data to make sure we send it all again
    playerObject.lastSentPlayerDataObject = {};
    cleanUpAfterDisconnect();
  });
}

export default receiveDataFromServer;
