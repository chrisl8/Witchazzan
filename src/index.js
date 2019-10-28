import Phaser from 'phaser';
import WebSocketClient from '@gamestdio/websocket'; // This automatically reconnects after a disconnect.
// https://what-problem-does-it-solve.com/webpack/css.html
import './css/styles.css';
import rootGameObject from './rootGameObject';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';
import textObject from './textObject';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';

rootGameObject.game = new Phaser.Game(rootGameObject.config);

// Set up some initial values.
playerObject.domElements.chatInputDiv.hidden = true;
playerObject.domElements.Scrolling.hidden = true;
playerObject.domElements.chatInputDiv.hidden = true;
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

// TODO: set up a player "per client" so two of us can mess with it.
