import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';
import reportFunctions from './reportFunctions';

// Local keys will work even if the server is disconnected.
// I suggest making these RARE, and also not recording their state,
// as we assume you can act on them without doing that.
const localKeys = ['c'];

function handleKeyboardInput(event) {
  if (playerObject.chatInputDivDomElement.hidden) {
    if (localKeys.indexOf(event.key) > -1) {
      if (event.key === 'c' && event.type === 'keydown') {
        // Go into chat/command mode if 'c' is pressed.
        // This works even if we are not connected,
        // and this is NOT sent to the server at this time.
        // (If the server needs to know that we are in "chat/command input mode" we can find
        // a way to send that.
        playerObject.chatInputDivDomElement.hidden = false;
        playerObject.sceneText.helloText.shouldBeActiveNow = false;
        playerObject.sceneText.escapeToLeaveChat.shouldBeActiveNow = true;
        playerObject.chatInputDivDomElement.style.width = `${
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
      playerObject.sceneText.escapeToLeaveChat.shouldBeActiveNow = false;
      // https://stackoverflow.com/a/1232046/4982408
      playerObject.chatInputTextArray.length = 0;
      // Otherwise it still has text on it when you open it again:
      playerObject.chatInputElement.innerHTML = '';
      playerObject.chatInputDivDomElement.hidden = true;
      // Hide scrolling text box chat now too
      playerObject.sceneText.incomingChatText.shouldBeActiveNow = false;
      playerObject.sceneText.notConnectedCommandResponse.shouldBeActiveNow = false;
    } else if (event.key === 'Enter') {
      // Enter is used to 'send' the chat/command.

      if (playerObject.chatInputTextArray[0] === '/') {
        // A / is used to begin commands instead of sending chat text.
        const inputText = playerObject.chatInputTextArray.slice(0);
        inputText.shift(); // Remove the /
        const inputTextSpaceDelimitedArray = inputText.join('').split(' ');
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
            playerObject.chatInputElement.innerHTML = '';
          }
        } else if (
          communicationsObject.socket.readyState === WebSocketClient.OPEN
        ) {
          reportFunctions.reportCommand(inputText.join(''));
          // https://stackoverflow.com/a/1232046/4982408
          playerObject.chatInputTextArray.length = 0;
          // Otherwise it still has text on it when you open it again:
          playerObject.chatInputElement.innerHTML = '';
        } else {
          // Warn user that text cannot be sent due to lack of server connection.
          // TODO: the scrollingTextOverlayInputText should have a function to update it,
          //  so it can do things like scroll, dump stuff off the end, etc.
          playerObject.sceneText.notConnectedCommandResponse.shouldBeActiveNow = true;
        }
      } else if (
        communicationsObject.socket.readyState === WebSocketClient.OPEN
      ) {
        reportFunctions.reportChat(playerObject.chatInputTextArray.join(''));
        // Clear text after sending.
        playerObject.chatInputTextArray.length = 0;
        playerObject.chatInputElement.innerHTML = '';
      } else {
        // Warn user that text cannot be sent due to lack of server connection.
        // TODO: the scrollingTextOverlayInputText should have a function to update it,
        //  so it can do things like scroll, dump stuff off the end, etc.
        playerObject.sceneText.notConnectedCommandResponse.shouldBeActiveNow = true;
      }
    } else {
      // Only input individual ASCII characters
      if (event.key.length === 1 && !/[^ -~]+/.test(event.key)) {
        playerObject.chatInputTextArray.push(event.key);
      } else if (event.key === 'Backspace') {
        // I TOLD you we have to emulate text input features! :)
        playerObject.chatInputTextArray.pop();
      } else {
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
      playerObject.chatInputElement.innerHTML = playerObject.chatInputTextArray.join(
        '',
      );
    }
  }
}

export default handleKeyboardInput;
