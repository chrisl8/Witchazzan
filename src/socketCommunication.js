/* globals WebSocket:true */
import communicationsObject from './objects/communicationsObject';
import textObject from './objects/textObject';
import sendDataToServer from './sendDataToServer';
import playerObject from './objects/playerObject';
import pixelHighlightInput from './objects/pixelHighlightInput';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';
import parseGamePieceListFromServer from './parseGamePieceListFromServer';

// TODO: Refactor actions out of this file.

function socketCommunications() {
  const connectionCheckInterval = 1000;

  function connect() {
    if (communicationsObject.socket && communicationsObject.socket.close) {
      communicationsObject.socket.close();
    }

    // See https://developer.mozilla.org/en-US/docs/Web/API/WebSocket for how to use Websockets
    communicationsObject.socket = new WebSocket(
      communicationsObject.websocketServerString,
    );

    // Connection opened
    communicationsObject.socket.onopen = () => {
      playerObject.socketCurrentlyConnected = true;
      textObject.connectingText.shouldBeActiveNow = false;
      textObject.reconnectingText.shouldBeActiveNow = false;
      textObject.notConnectedCommandResponse.shouldBeActiveNow = false;

      // Send our username here, in case the server doesn't know who we are yet.
      sendDataToServer.reportLogin(playerObject.playerName);
    };

    // Listen for messages
    communicationsObject.socket.onmessage = (event) => {
      // {"messageType":"chat","name":null,"content":"test"}
      const inputData = JSON.parse(event.data);
      if (inputData.messageType === 'chat') {
        playerObject.scrollingTextBox.chat(inputData);
      } else if (inputData.messageType === 'identity') {
        playerObject.playerId = inputData.id;
      } else if (inputData.messageType === 'game-piece-list') {
        parseGamePieceListFromServer(inputData);
      } else if (inputData.messageType === 'highlight_pixels') {
        pixelHighlightInput.content = inputData.content;
      } else if (inputData.messageType === 'time') {
        playerObject.gameTime = inputData.content;
      } else {
        console.log(inputData);
      }
    };

    // Handle disconnect
    communicationsObject.socket.onclose = () => {
      playerObject.socketCurrentlyConnected = false;
      cleanUpAfterDisconnect();
    };
  }

  // Watch connection state and attempt reconnect periodically if it dies.
  function watchAndRestartConnection() {
    if (!playerObject.socketCurrentlyConnected) {
      // Clear last sent data to make sure we send it all again
      playerObject.lastSentPlayerLocationObject = {};
      // Reconnect
      connect();
    }
    setTimeout(watchAndRestartConnection, connectionCheckInterval);
  }

  watchAndRestartConnection();
}

export default socketCommunications;
