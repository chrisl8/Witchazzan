import communicationsObject from './objects/communicationsObject';
import playerObject from './objects/playerObject';
import textObject from './objects/textObject';
import processCommandInput from './processCommandInput';

// Local keys will work even if the server is disconnected.
// I suggest making these RARE, and also not recording their state,
// as we assume you can act on them without doing that.
const localKeys = ['c'];

function handleKeyboardInput(event) {
  // Everything is different if in the "chat" window.
  // We literally use the visibility of the chatInputDiv to determine this,
  // because that is empirically the most literal reality for the user.
  if (playerObject.domElements.chatInputDiv.style.display === 'none') {
    if (localKeys.indexOf(event.key) > -1) {
      // Some (ok, one right now) events can happen when the server isn't connected.
      if (event.key === 'c' && event.type === 'keyup') {
        // If we do this on 'keydown', we end up with a 'c'
        // stuck in the input box.

        // Go into chat/command mode if 'c' is pressed.
        // This works even if we are not connected,
        // and this is NOT sent to the server at this time.
        // (If the server needs to know that we are in "chat/command input mode" we can find
        // a way to send that.

        // .hidden = true/false is not compatible with display: flex
        playerObject.chatOpen = true; // Broadcast to other players that chat is open
        playerObject.domElements.chatInputDiv.style.display = 'flex';
        playerObject.domElements.chatInput.focus();
        textObject.escapeToLeaveChat.shouldBeActiveNow = true;
        playerObject.domElements.chatInputDiv.style.width = `${
          playerObject.canvasDomElement.item(0).offsetWidth
        }px`;
        playerObject.scrollingTextBox.display(false);
      }
    } else if (
      communicationsObject.socket.readyState ===
      communicationsObject.status.OPEN
    ) {
      // Other events only happen while connected

      // Anything that isn't a special game command is tracked in
      // the player object, and acted upon during the next Phaser
      // game loop.
      if (playerObject.keyState[event.key] !== event.type) {
        playerObject.keyState[event.key] = event.type;
      }
    }
  } else if (event.type === 'keydown') {
    // If the command input box is open, then it hijacks all keyboard input.
    // Operate on key down, not up for special operations while the chat box is open.

    processCommandInput(event);
  }
}

export default handleKeyboardInput;
