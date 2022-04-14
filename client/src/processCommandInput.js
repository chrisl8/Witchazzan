/* globals localStorage:true */
import textObject from './objects/textObject.js';
import playerObject from './objects/playerObject.js';
import clientSprites from './objects/clientSprites.js';
import sendDataToServer from './sendDataToServer.js';
import communicationsObject from './objects/communicationsObject.js';

if (!Array.isArray(JSON.parse(localStorage.getItem('commandHistory')))) {
  localStorage.setItem('commandHistory', JSON.stringify([]));
}
const commandHistory = JSON.parse(localStorage.getItem('commandHistory'));
let commandHistoryIndex = commandHistory.length;

function addEntryToCommandHistory(command) {
  // https://stackoverflow.com/a/1232046/4982408
  playerObject.chatInputTextArray.length = 0;
  // Otherwise it still has text on it when you open it again:
  playerObject.domElements.chatInput.value = '';
  if (commandHistory[commandHistory.length - 1] !== `/${command}`) {
    commandHistory.push(`/${command}`);
    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
  }
  commandHistoryIndex = commandHistory.length;
}

function processCommandInput(event) {
  if (event.key === 'Escape') {
    // Escape is used to exit the chat/command input box.
    textObject.escapeToLeaveChat.shouldBeActiveNow = false;
    // https://stackoverflow.com/a/1232046/4982408
    playerObject.chatInputTextArray.length = 0;
    // Otherwise it still has text on it when you open it again:
    playerObject.domElements.chatInput.value = '';
    playerObject.chatOpen = false; // Broadcast to other players that chat is closed
    playerObject.domElements.chatInputDiv.style.display = 'none';
    playerObject.scrollingTextBox.hide();
    textObject.notConnectedCommandResponse.shouldBeActiveNow = false;
  } else if (event.key === 'Enter') {
    playerObject.chatInputTextArray =
      playerObject.domElements.chatInput.value.split('');
    // Enter is used to 'send' the chat/command.

    if (playerObject.chatInputTextArray[0] === '/') {
      // A / is used to begin commands instead of sending chat text.
      const inputText = playerObject.chatInputTextArray.slice(0);
      inputText.shift(); // Remove the /
      const command = inputText.join('');
      const inputTextSpaceDelimitedArray = command.split(' ');
      if (inputTextSpaceDelimitedArray[0] === 'dumpPlayerObject') {
        console.log(playerObject);
        addEntryToCommandHistory(command);
      } else if (inputTextSpaceDelimitedArray[0] === 'dumpClientSprites') {
        console.log(clientSprites);
        addEntryToCommandHistory(command);
      } else if (inputTextSpaceDelimitedArray[0] === 'whisper') {
        // Sends chat to specific user
        if (communicationsObject.socket.connected) {
          inputTextSpaceDelimitedArray.shift();
          const targetPlayerId = Number(inputTextSpaceDelimitedArray.shift());
          const text = inputTextSpaceDelimitedArray.join(' ');
          sendDataToServer.chat({ text, targetPlayerId });
        } else {
          // Warn user that command cannot be sent due to lack of server connection.
          textObject.notConnectedCommandResponse.shouldBeActiveNow = true;
        }
      } else if (inputTextSpaceDelimitedArray[0] === 'teleportToScene') {
        playerObject.teleportToSceneNow = inputTextSpaceDelimitedArray[1];
        addEntryToCommandHistory(command);
      } else if (inputTextSpaceDelimitedArray[0] === 'exit') {
        // Used on mobile to get back to setup screen
        playerObject.keyState.p = 'keydown';
      } else if (communicationsObject.socket.connected) {
        // Any 'command' that does not exist on the client is just sent directly to the server.
        sendDataToServer.command(command);
        addEntryToCommandHistory(command);
      } else {
        // Warn user that command cannot be sent due to lack of server connection.
        textObject.notConnectedCommandResponse.shouldBeActiveNow = true;
      }
    } else if (communicationsObject.socket.connected) {
      if (playerObject.chatInputTextArray.length > 0) {
        sendDataToServer.chat({
          text: playerObject.chatInputTextArray.join(''),
        });
      }
      // Clear text after sending.
      playerObject.chatInputTextArray.length = 0;
      playerObject.domElements.chatInput.value = '';
    } else {
      // Warn user that text cannot be sent due to lack of server connection.
      textObject.notConnectedCommandResponse.shouldBeActiveNow = true;
    }
  } else if (event.key === 'ArrowUp') {
    if (commandHistoryIndex > 0) {
      commandHistoryIndex--;
    }
    if (commandHistory[commandHistoryIndex]) {
      playerObject.chatInputTextArray =
        commandHistory[commandHistoryIndex].split('');
      playerObject.domElements.chatInput.value =
        playerObject.chatInputTextArray.join('');
    }
  } else if (event.key === 'ArrowDown') {
    if (commandHistoryIndex < commandHistory.length - 1) {
      commandHistoryIndex++;
      playerObject.chatInputTextArray =
        commandHistory[commandHistoryIndex].split('');
      playerObject.domElements.chatInput.value =
        playerObject.chatInputTextArray.join('');
    } else {
      commandHistoryIndex = commandHistory.length;
      // https://stackoverflow.com/a/1232046/4982408
      playerObject.chatInputTextArray.length = 0;
      // Otherwise it still has text on it when you open it again:
      playerObject.domElements.chatInput.value = '';
    }
  } else if (!(event.key.length === 1 && !/[^ -~]+/.test(event.key))) {
    // Log non-ASCII characters input while chat window is open for debugging
    console.log(event.key); // TODO: Remove this for production.
  }
}

export default processCommandInput;
