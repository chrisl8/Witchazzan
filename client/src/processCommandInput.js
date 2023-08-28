/* globals localStorage:true */
import playerObject from './objects/playerObject.js';
import clientSprites from './objects/clientSprites.js';
import sendDataToServer from './sendDataToServer.js';
import closeChatInputBox from './closeChatInputBox.js';
import debugLog from './utilities/debugLog.js';
import deletedHadronList from './objects/deletedHadronList.js';
import hadrons from './objects/hadrons.js';
import textObject from './objects/textObject.js';

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
    closeChatInputBox();
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
      if (
        playerObject.isAdmin &&
        inputTextSpaceDelimitedArray[0].toLowerCase() === 'dumpplayerobject'
      ) {
        console.log(playerObject);
        addEntryToCommandHistory(command);
      } else if (
        playerObject.isAdmin &&
        inputTextSpaceDelimitedArray[0].toLowerCase() === 'dumpclientsprites'
      ) {
        console.log(clientSprites);
        addEntryToCommandHistory(command);
      } else if (
        playerObject.isAdmin &&
        inputTextSpaceDelimitedArray[0].toLowerCase() ===
          'dumpdeletedhadronlist'
      ) {
        console.log(deletedHadronList);
        addEntryToCommandHistory(command);
      } else if (
        inputTextSpaceDelimitedArray[0].toLowerCase() === 'coordinates'
      ) {
        textObject.coordinates.shouldBeActiveNow =
          !textObject.coordinates.shouldBeActiveNow;
      } else if (
        playerObject.isAdmin &&
        inputTextSpaceDelimitedArray[0].toLowerCase() === 'dumphadrons'
      ) {
        console.log(hadrons);
        addEntryToCommandHistory(command);
      } else if (inputTextSpaceDelimitedArray[0].toLowerCase() === 'whisper') {
        if (playerObject.canChat) {
          // Sends chat to specific user
          inputTextSpaceDelimitedArray.shift();
          const targetPlayerId = Number(inputTextSpaceDelimitedArray.shift());
          const text = inputTextSpaceDelimitedArray.join(' ');
          sendDataToServer.txt({ text, targetPlayerId });
        }
      } else if (
        playerObject.isAdmin &&
        (inputTextSpaceDelimitedArray[0].toLowerCase() === 'teleporttoscene' ||
          inputTextSpaceDelimitedArray[0].toLowerCase() === 'tp')
      ) {
        playerObject.teleportToSceneNow = inputTextSpaceDelimitedArray[1];
        addEntryToCommandHistory(command);
      } else if (inputTextSpaceDelimitedArray[0].toLowerCase() === 'exit') {
        // Used on mobile to get back to setup screen
        playerObject.keyState.p = 'keydown';
      } else {
        // Any 'command' that does not exist on the client is just sent directly to the server.
        sendDataToServer.command(command);
        addEntryToCommandHistory(command);
      }
    } else {
      if (playerObject.canChat && playerObject.chatInputTextArray.length > 0) {
        sendDataToServer.txt({
          text: playerObject.chatInputTextArray.join(''),
        });
      }
      // Clear text after sending.
      playerObject.chatInputTextArray.length = 0;
      playerObject.domElements.chatInput.value = '';
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
    debugLog(event.key);
  }
}

export default processCommandInput;
