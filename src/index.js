/* globals WebSocket:true */
import Phaser from 'phaser';
import rootGameObject from './rootGameObject';
import communicationsObject from './communicationsObject';

rootGameObject.game = new Phaser.Game(rootGameObject.config);

// See https://developer.mozilla.org/en-US/docs/Web/API/WebSocket for how to use Websockets
communicationsObject.socket = new WebSocket(
  communicationsObject.websocketServerLocation,
);

// TODO: Implement this code to get auto-reconnecting Websockets:
// https://github.com/gamestdio/websocket

// Connection opened
communicationsObject.socket.addEventListener('open', function(event) {
  communicationsObject.socket.send('Hello Server!');
});

// Listen for messages
communicationsObject.socket.addEventListener('message', function(event) {
  console.log('Message from server ', event.data);
});
// communicationsObject.socket.onclose = function() {
//   // Try to reconnect in 5 seconds
//   setTimeout(function() {
//     communicationsObject.socket.start(rootGameObject.websocketServerLocation);
//   }, 5000);
// };

// TODO: Read over this example and implement things I learn:
// https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

// TODO: Read over this and implement new ides:
// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/

// TODO: Read over and experiment with RESIZE and FIT scale optoins:
// http://www.netexl.com/blog/exploring-resize-scale-mode-in-phaser-3/
// http://www.netexl.com/blog/phaser-3-scale-manager-is-here-exploring-phaser-3-with-3-16-1-version-now/

// TODO: Once we have a server, make Websockets work next.
// Get it talking to the server, send EVERYTHING to it,
// Get the server to log stuff it gets,
// Console log input from server.

// This way we can start playing with client/server control ideas.

// Once that works, set up a player "per client" so two of us can mess with it.

// TODO: Set up Git Auto Deploy on my DO droplet
// http://olipo186.github.io/Git-Auto-Deploy/
