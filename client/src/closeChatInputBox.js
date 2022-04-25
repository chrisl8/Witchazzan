import textObject from './objects/textObject.js';
import playerObject from './objects/playerObject.js';

function closeChatInputBox() {
  textObject.escapeToLeaveChat.shouldBeActiveNow = false;
  // https://stackoverflow.com/a/1232046/4982408
  playerObject.chatInputTextArray.length = 0;
  // Otherwise it still has text on it when you open it again:
  playerObject.domElements.chatInput.value = '';
  playerObject.chatOpen = false; // Broadcast to other players that chat is closed
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.scrollingTextBox.hide();
  textObject.notConnectedCommandResponse.shouldBeActiveNow = false;
}

export default closeChatInputBox;
