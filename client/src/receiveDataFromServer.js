/* globals window:true */
import openSocket from 'socket.io-client';
import communicationsObject from './objects/communicationsObject';
import textObject from './objects/textObject';
import sendDataToServer from './sendDataToServer';
import playerObject from './objects/playerObject';
import pixelHighlightInput from './objects/pixelHighlightInput';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';
import parseGamePieceListFromServer from './parseGamePieceListFromServer';

function receiveDataFromServer() {
  if (communicationsObject.socket && communicationsObject.socket.close) {
    communicationsObject.socket.close();
  }

  if (window.location.hostname === 'localhost') {
    communicationsObject.socket = openSocket('http://localhost:8080/');
  } else {
    communicationsObject.socket = openSocket();
  }

  // This is just the server saying, "Hi", to which we respond with a formal login.
  communicationsObject.socket.on('welcome', () => {
    playerObject.socketCurrentlyConnected = true;
    textObject.connectingText.shouldBeActiveNow = false;
    textObject.reconnectingText.shouldBeActiveNow = false;
    textObject.notConnectedCommandResponse.shouldBeActiveNow = false;

    // Send our username here, in case the server doesn't know who we are yet.
    sendDataToServer.login();
  });

  // The local client won't start the game until this is received and parsed.
  communicationsObject.socket.on('gamePieceList', (inputData) => {
    parseGamePieceListFromServer(inputData);
  });

  // TODO: Implement these on the server.
  communicationsObject.socket.on('chat', (inputData) => {
    console.log(inputData);
    if (playerObject.scrollingTextBox) {
      // Sometimes we get a chat message before scrollingTextBox is initialized
      playerObject.scrollingTextBox.chat(inputData);
    }
  });
  communicationsObject.socket.on('identity', (inputData) => {
    console.log(inputData);
    playerObject.playerId = inputData.id;
  });
  communicationsObject.socket.on('highlight_pixels', (inputData) => {
    console.log(inputData);
    pixelHighlightInput.content = inputData.content;
  });
  communicationsObject.socket.on('time', (inputData) => {
    console.log(inputData);
    playerObject.gameTime = inputData.content;
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
