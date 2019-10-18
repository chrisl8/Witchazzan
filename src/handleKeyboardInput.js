import WebSocketClient from '@gamestdio/websocket';
import communicationsObject from './communicationsObject';
import playerObject from './playerObject';

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
        communicationsObject.socket.send(`${event.key},${event.type}`);
      }
    }
  } else {
    // If the command input box is open, then it hijacks all keyboard input.

    // Operate on key down, not up for text input.
    // Note that since we hijacked the keyboard, we will have to emulate text input features
    // that we want to support. TL;DR: It might act weird.
    if (event.type === 'keydown') {
      if (event.key === 'Escape') {
        // Escape is used to exit the chat/command input box.
        playerObject.sceneText.escapeToLeaveChat.shouldBeActiveNow = false;
        // https://stackoverflow.com/a/1232046/4982408
        playerObject.chatInputTextArray.length = 0;
        // Otherwise it still has text on it when you open it again:
        playerObject.chatInputElement.value = '';
        playerObject.chatInputDivDomElement.hidden = true;
      } else if (event.key === 'Enter') {
        // Enter is used to 'send' the chat/command.
        // TODO: Check if this is a command, and only behave differently if it is.
        if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
          communicationsObject.socket.send(
            `msg,${playerObject.chatInputTextArray.join('')}`,
          );
          playerObject.chatInputTextArray.length = 0;
          // Otherwise it still has text on it when you open it again:
          playerObject.chatInputElement.value = '';
        } else {
          // Warn user that text cannot be sent due to lack of server connection.
          // TODO: the scrollingTextOverlayInputText should have a function to update it,
          //  so it can do things like scroll, dump stuff off the end, etc.
          playerObject.scrollingTextOverlayInputText = `${playerObject.scrollingTextOverlayInputText}<br/>Not connected, cannot send chat text.`;
          playerObject.scrollingTextOverlayInput.innerHTML =
            playerObject.scrollingTextOverlayInputText;
          playerObject.scrollingTextOverlayDivDomElement.hidden = false;
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
        // "Display" the current chat/command queue content:
        playerObject.chatInputElement.value = playerObject.chatInputTextArray.join(
          '',
        );
      }
      /* TODO:
       *  2. Implement a "Command" character like / to say, "this is a command. not text."
       *  4. Start a list of commands
       *     a. Start with one to call various functions from inside of the code.
       *  5. Implement a way to display output to player
       *     a. Can we overlay a div on the screen or do we have to use Canvas text?
       */
    }
  }
}

function reportChat(text) {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    var obj = new Object();
    obj.message_type = "chat";
    obj.text = text;
    var jsonString= JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
}
function reportLocation() {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    var obj = new Object();
    obj.message_type = "location-update";
    obj.x = playerObject.player.body.x;
    obj.y = playerObject.player.body.y;
    var jsonString= JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
}
function reportLogin(username, password) {
  if (communicationsObject.socket.readyState === WebSocketClient.OPEN) {
    var obj = new Object();
    obj.message_type = "login";
    obj.username = username;
    obj.password = password;
    var jsonString= JSON.stringify(obj);
    communicationsObject.socket.send(jsonString);
  }
}

export default handleKeyboardInput;
