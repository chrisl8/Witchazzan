/*
 * This exists so that index.js can do some pregame show events,
 * and in reality exists because top level await isn't a thing yet
 */

/* globals document:true */
import Phaser from 'phaser';
import WebSocketClient from '@gamestdio/websocket'; // This automatically reconnects after a disconnect.
import nipplejs from 'nipplejs';
import rootGameObject from './objects/rootGameObject';
import communicationsObject from './objects/communicationsObject';
import playerObject from './objects/playerObject';
import textObject from './objects/textObject';
import cleanUpAfterDisconnect from './cleanUpAfterDisconnect';
import reportFunctions from './reportFunctions';
import gamePieceList from './objects/gamePieceList';
import wait from './utilities/wait';

async function startGame() {
  // Set up some initial values.
  document.getElementById('canvas_overlay_elements').style.display = 'flex';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.Scrolling.hidden = true;
  playerObject.domElements.chatInputCaret.innerHTML = '&#x1F4AC;';

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
      let otherPlayerDisplayName = inputData.name;
      if (
        otherPlayerDisplayName === playerObject.playerName &&
        inputData.id !== playerObject.playerId
      ) {
        otherPlayerDisplayName = `Other ${inputData.name}`;
      }
      textObject.incomingChatText.text = `${textObject.incomingChatText.text}${otherPlayerDisplayName}: ${inputData.content}`;
      textObject.incomingChatText.shouldBeActiveNow = true;
    } else if (inputData.messageType === 'identity') {
      playerObject.playerId = inputData.id;
    } else if (inputData.messageType === 'game-piece-list') {
      // Grab initial position for player from server.
      if (!playerObject.initialPositionReceived) {
        if (inputData.pieces && inputData.pieces.length > 0) {
          inputData.pieces.forEach((piece) => {
            if (piece.id === playerObject.playerId) {
              playerObject.initialPositionReceived = true;
              playerObject.initialPosition = {
                x: piece.x,
                y: piece.y,
              };
              playerObject.initialScene = piece.scene;
            }
          });
        }
      }

      gamePieceList.pieces = inputData.pieces;
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

  // Don't start until we have the initial connection
  // with the player's initial position.
  while (!playerObject.initialPositionReceived) {
    // eslint-disable-next-line no-await-in-loop
    await wait(1);
  }

  document.getElementById('pre_load_info').hidden = true;
  document.getElementsByTagName('body')[0].style.background = 'black';

  const joystick = nipplejs.create({ multitouch: true, maxNumberOfNipples: 2 });
  let joystickCount = 0;
  joystick
    .on('start', () => {
      if (joystickCount === 0) {
        playerObject.joystickDirection = {
          left: false,
          right: false,
          up: false,
          down: false,
        };
        playerObject.joystickDistance = 0;
      } else {
        reportFunctions.reportFireball(playerObject.playerDirection);
      }
      joystickCount++;
    })
    .on('end', () => {
      joystickCount--;
      if (joystickCount === 0) {
        playerObject.joystickDirection = {
          left: false,
          right: false,
          up: false,
          down: false,
        };
        playerObject.joystickDistance = 0;
      }
    })
    .on('move', (evt, data) => {
      const angle = data.angle.degree;
      /*
       0 = right
       90 = up
       180 = left
       270 = down
       */
      let left = false;
      let right = false;
      let up = false;
      let down = false;
      if ((angle >= 0 && angle < 22) || angle >= 335) {
        right = true;
      } else if (angle >= 22 && angle < 66) {
        right = true;
        up = true;
      } else if (angle >= 66 && angle < 110) {
        up = true;
      } else if (angle >= 110 && angle < 155) {
        left = true;
        up = true;
      } else if (angle >= 155 && angle < 200) {
        left = true;
      } else if (angle >= 200 && angle < 245) {
        left = true;
        down = true;
      } else if (angle >= 245 && angle < 290) {
        down = true;
      } else if (angle >= 290 && angle < 335) {
        right = true;
        down = true;
      }
      playerObject.joystickDirection = {
        left,
        right,
        up,
        down,
      };
      playerObject.joystickDistance = data.distance;
    });

  rootGameObject.game = new Phaser.Game(rootGameObject.config);
}

export default startGame;
