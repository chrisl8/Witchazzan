import Phaser from 'phaser';
// This automatically reconnects after a disconnect.
import WebSocketClient from '@gamestdio/websocket';
import rootGameObject from './rootGameObject';
import communicationsObject from './communicationsObject';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';

rootGameObject.game = new Phaser.Game(rootGameObject.config);

// See https://developer.mozilla.org/en-US/docs/Web/API/WebSocket for how to use Websockets
// and https://github.com/gamestdio/websocket for this version that reconnects if the connection drops.
communicationsObject.socket = new WebSocketClient(
  communicationsObject.websocketServerLocation,
  [],
  { backoff: 'fibonacci' },
);

// Connection opened
communicationsObject.socket.onopen = () => {
  communicationsObject.socket.send('Hello Server!');
};

// Listen for messages
communicationsObject.socket.onmessage = (event) => {
  console.log('Message from server ', event.data);
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
