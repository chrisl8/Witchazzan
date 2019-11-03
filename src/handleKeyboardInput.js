/* globals localStorage:true */
import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';
import textObject from './textObject';
import reportFunctions from './reportFunctions';

// Local keys will work even if the server is disconnected.
// I suggest making these RARE, and also not recording their state,
// as we assume you can act on them without doing that.
const localKeys = ['c'];
if (!Array.isArray(JSON.parse(localStorage.getItem('commandHistory')))) {
  localStorage.setItem('commandHistory', JSON.stringify([]));
}
const commandHistory = JSON.parse(localStorage.getItem('commandHistory'));
let commandHistoryIndex = commandHistory.length;

function handleKeyboardInput(event) {
  if (playerObject.domElements.chatInputDiv.style.display === 'none') {
    if (localKeys.indexOf(event.key) > -1) {
      if (event.key === 'c' && event.type === 'keyup') {
        // If we do this on 'keydown', we end up with a 'c'
        // stuck in the input box.

        // Go into chat/command mode if 'c' is pressed.
        // This works even if we are not connected,
        // and this is NOT sent to the server at this time.
        // (If the server needs to know that we are in "chat/command input mode" we can find
        // a way to send that.

        // .hidden = true/false is not compatible with display: flex
        playerObject.domElements.chatInputDiv.style.display = 'flex';
        playerObject.domElements.chatInput.focus();
        textObject.helloText.shouldBeActiveNow = false;
        textObject.escapeToLeaveChat.shouldBeActiveNow = true;
        playerObject.domElements.chatInputDiv.style.width = `${
          playerObject.canvasDomElement.item(0).offsetWidth
        }px`;
      }
    } else if (
      communicationsObject.socket.readyState === WebSocketClient.OPEN
    ) {
      // Anything that isn't a special game command is tracked and sent to the server,
      // IF it is connected.
      // NOTE:
      // NOT changing the keyState if we can't send because
      // the keyState is a reflection of what the server thinks,
      // and the game is meant to only work when connected.
      if (playerObject.keyState[event.key] !== event.type) {
        playerObject.keyState[event.key] = event.type;
        reportFunctions.reportKeyboardState(event.key, event.type);
      }
    }
  } else if (event.type === 'keydown') {
    // If the command input box is open, then it hijacks all keyboard input.

    // Operate on key down, not up for text input.
    // Note that since we hijacked the keyboard, we will have to emulate text input features
    // that we want to support. TL;DR: It might act weird.

    if (event.key === 'Escape') {
      // Escape is used to exit the chat/command input box.
      textObject.escapeToLeaveChat.shouldBeActiveNow = false;
      // https://stackoverflow.com/a/1232046/4982408
      playerObject.chatInputTextArray.length = 0;
      // Otherwise it still has text on it when you open it again:
      playerObject.domElements.chatInput.value = '';
      playerObject.domElements.chatInputDiv.style.display = 'none';
      // Hide scrolling text box chat now too
      textObject.incomingChatText.shouldBeActiveNow = false;
      textObject.notConnectedCommandResponse.shouldBeActiveNow = false;
    } else if (event.key === 'Enter') {
      playerObject.chatInputTextArray = playerObject.domElements.chatInput.value.split(
        '',
      );
      // Enter is used to 'send' the chat/command.

      if (playerObject.chatInputTextArray[0] === '/') {
        // A / is used to begin commands instead of sending chat text.
        const inputText = playerObject.chatInputTextArray.slice(0);
        inputText.shift(); // Remove the /
        const command = inputText.join('');
        const inputTextSpaceDelimitedArray = command.split(' ');
        if (inputTextSpaceDelimitedArray[0] === 'run') {
          if (
            inputTextSpaceDelimitedArray.length > 1 &&
            reportFunctions[inputTextSpaceDelimitedArray[1]]
          ) {
            inputTextSpaceDelimitedArray.shift();
            const functionToRun = inputTextSpaceDelimitedArray.shift();
            reportFunctions[functionToRun](...inputTextSpaceDelimitedArray);
            // https://stackoverflow.com/a/1232046/4982408
            playerObject.chatInputTextArray.length = 0;
            // Otherwise it still has text on it when you open it again:
            playerObject.domElements.chatInput.value = '';
            if (commandHistory[commandHistory.length - 1] !== `/${command}`) {
              commandHistory.push(`/${command}`);
              localStorage.setItem(
                'commandHistory',
                JSON.stringify(commandHistory),
              );
            }
            commandHistoryIndex = commandHistory.length;
          }
        } else if (
          communicationsObject.socket.readyState === WebSocketClient.OPEN
        ) {
          reportFunctions.reportCommand(command);
          // https://stackoverflow.com/a/1232046/4982408
          playerObject.chatInputTextArray.length = 0;
          // Otherwise it still has text on it when you open it again:
          playerObject.domElements.chatInput.value = '';
          if (commandHistory[commandHistory.length - 1] !== `/${command}`) {
            commandHistory.push(`/${command}`);
            localStorage.setItem(
              'commandHistory',
              JSON.stringify(commandHistory),
            );
          }
          commandHistoryIndex = commandHistory.length;
        } else {
          // Warn user that text cannot be sent due to lack of server connection.
          // TODO: the scrollingTextOverlayInputText should have a function to update it,
          //  so it can do things like scroll, dump stuff off the end, etc.
          textObject.notConnectedCommandResponse.shouldBeActiveNow = true;
        }
      } else if (
        communicationsObject.socket.readyState === WebSocketClient.OPEN
      ) {
        reportFunctions.reportChat(playerObject.chatInputTextArray.join(''));
        // Clear text after sending.
        playerObject.chatInputTextArray.length = 0;
        playerObject.domElements.chatInput.value = '';
      } else {
        // Warn user that text cannot be sent due to lack of server connection.
        // TODO: the scrollingTextOverlayInputText should have a function to update it,
        //  so it can do things like scroll, dump stuff off the end, etc.
        textObject.notConnectedCommandResponse.shouldBeActiveNow = true;
      }
    } else if (event.key === 'ArrowUp') {
      if (commandHistoryIndex > 0) {
        commandHistoryIndex--;
      }
      if (commandHistory[commandHistoryIndex]) {
        playerObject.chatInputTextArray = commandHistory[
          commandHistoryIndex
        ].split('');
        playerObject.domElements.chatInput.value = playerObject.chatInputTextArray.join(
          '',
        );
      }
    } else if (event.key === 'ArrowDown') {
      if (commandHistoryIndex < commandHistory.length - 1) {
        commandHistoryIndex++;
        playerObject.chatInputTextArray = commandHistory[
          commandHistoryIndex
        ].split('');
        playerObject.domElements.chatInput.value = playerObject.chatInputTextArray.join(
          '',
        );
      } else {
        commandHistoryIndex = commandHistory.length;
        // https://stackoverflow.com/a/1232046/4982408
        playerObject.chatInputTextArray.length = 0;
        // Otherwise it still has text on it when you open it again:
        playerObject.domElements.chatInput.value = '';
      }
    } else {
      // Only log non-ASCII characters
      if (!(event.key.length === 1 && !/[^ -~]+/.test(event.key))) {
        // TODO: Just logging everything else now to help debug. Remove this for production.
        console.log(event.key);
      }
      // TODO: The input is a little buggy. Need to test it and sort that out.
      //       Mainly I get duplicate input sometimes.
      //       I may just use an input box to let the browser deal with text,
      //       and use JS to set focus to it,
      //       and see if I can still watch the keyboard via Phaser and do nifty things
      //       like command history and listening for special keys like Escape.
      // "Display" the current chat/command queue content:
    }
  }
}

export default handleKeyboardInput;
