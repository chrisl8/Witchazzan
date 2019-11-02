/*
 * This exists so that index.js can do some pregame show events,
 * and in reality exists because top level await isn't a thing yet
 */

/* globals document:true */
import Phaser from 'phaser';
import WebSocketClient from '@gamestdio/websocket'; // This automatically reconnects after a disconnect.
import rootGameObject from './rootGameObject';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';
import textObject from './textObject';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';
import reportFunctions from './reportFunctions';

async function startGame() {
  // Set up some initial values.
  document.getElementById('pre_load_info').hidden = true;
  document.getElementsByTagName('body')[0].style.background = 'black';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.Scrolling.hidden = true;
  // That is *not* an empty string!
  // https://youtrack.jetbrains.com/issue/IDEA-192107?_ga=2.141602101.646836220.1571768510-293137691.1563993858
  playerObject.domElements.chatInputCaret.innerHTML = `💬`;

  // See https://developer.mozilla.org/en-US/docs/Web/API/WebSocket for how to use Websockets
  // and https://github.com/gamestdio/websocket for this version that reconnects if the connection drops.
  communicationsObject.socket = new WebSocketClient(
    communicationsObject.websocketServerString,
    [],
    { backoff: 'fibonacci' },
  );

  // Connection opened
  communicationsObject.socket.onopen = () => {
    textObject.connectingText.shouldBeActiveNow = false;
    textObject.reconnectingText.shouldBeActiveNow = false;
    textObject.notConnectedCommandResponse.shouldBeActiveNow = false;

    // Send our username here, in case the server doesn't know who we are yet.
    reportFunctions.reportLogin(playerObject.playerName);
  };

  // Listen for messages
  communicationsObject.socket.onmessage = (event) => {
    // {"messageType":"chat","name":null,"content":"test"}
    const inputData = JSON.parse(event.data);
    if (inputData.messageType === 'chat') {
      // TODO: The scrolling text interface should be its own function and be much more fancy.
      if (textObject.incomingChatText.text !== '') {
        // Add a line break if there is existing text.
        textObject.incomingChatText.text = `${textObject.incomingChatText.text}<br/>`;
      }
      textObject.incomingChatText.text = `${textObject.incomingChatText.text}${inputData.name}: ${inputData.content}`;
      textObject.incomingChatText.shouldBeActiveNow = true;
    } else if (inputData.messageType === 'player-state') {
      // TODO: Display other players on the screen.
      // console.log('Player state update received.');
      // console.log(inputData.players);
      playerObject.serverData.playerState = inputData.players;
      // For debugging:
      playerObject.serverData.playerState.forEach((player) => {
        console.log(player.id, player.name, player.x, player.y, player.scene);
      });
    } else {
      console.log(inputData);
    }
  };

  // Handle disconnect
  communicationsObject.socket.onclose = () => {
    cleanUpAfterDisconnect();
  };

  // Notify on reconnect.
  communicationsObject.socket.onreconnect = () => {
    console.log('Reconnected');
  };

  rootGameObject.game = new Phaser.Game(rootGameObject.config);
}

export default startGame;
