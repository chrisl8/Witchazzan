import Phaser from 'phaser';
import WebSocketClient from '@gamestdio/websocket'; // This automatically reconnects after a disconnect.
// https://what-problem-does-it-solve.com/webpack/css.html
import './css/styles.css';
import rootGameObject from './rootGameObject';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';

rootGameObject.game = new Phaser.Game(rootGameObject.config);

// Set up some initial values.
playerObject.chatInputDivDomElement.hidden = true;
playerObject.domElements.Scrolling.hidden = true;
playerObject.chatInputDivDomElement.hidden = true;
// That is *not* an empty string!
// TODO: https://youtrack.jetbrains.com/issue/IDEA-192107?_ga=2.141602101.646836220.1571768510-293137691.1563993858
playerObject.chatInputCaretElement.innerHTML = `💬`;

// See https://developer.mozilla.org/en-US/docs/Web/API/WebSocket for how to use Websockets
// and https://github.com/gamestdio/websocket for this version that reconnects if the connection drops.
communicationsObject.socket = new WebSocketClient(
  communicationsObject.websocketServerString,
  [],
  { backoff: 'fibonacci' },
);

// Connection opened
communicationsObject.socket.onopen = () => {
  playerObject.sceneText.connectingText.shouldBeActiveNow = false;
  playerObject.sceneText.reconnectingText.shouldBeActiveNow = false;
  playerObject.sceneText.notConnectedCommandResponse.shouldBeActiveNow = false;
};

// Listen for messages
communicationsObject.socket.onmessage = (event) => {
  // {"messageType":"chat","name":null,"content":"test"}
  const inputData = JSON.parse(event.data);
  if (inputData.messageType === 'chat') {
    // TODO: The scrolling text interface should be its own function and be much more fancy.
    if (playerObject.sceneText.incomingChatText.text !== '') {
      // Add a line break if there is existing text.
      playerObject.sceneText.incomingChatText.text = `${playerObject.sceneText.incomingChatText.text}<br/>`;
    }
    playerObject.sceneText.incomingChatText.text = `${playerObject.sceneText.incomingChatText.text}${inputData.name}: ${inputData.content}`;
    playerObject.sceneText.incomingChatText.shouldBeActiveNow = true;
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

// TODO: Read over this example and implement things I learn:
// https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

// TODO: Read over this and implement new ides:
// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/

// TODO: Read over and experiment with RESIZE and FIT scale options:
// http://www.netexl.com/blog/exploring-resize-scale-mode-in-phaser-3/
// http://www.netexl.com/blog/phaser-3-scale-manager-is-here-exploring-phaser-3-with-3-16-1-version-now/

// TODO: set up a player "per client" so two of us can mess with it.
