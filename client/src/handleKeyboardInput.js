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
    } else if (communicationsObject.socket.connected) {
      // Other events only happen while connected

      // Anything that isn't a special game command is tracked in
      // the player object, and acted upon during the next Phaser
      // game loop.

      // Keys 1-0 set the active spell
      const spellKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const shiftedSpellKeys = ['!', '@', '#', '$', '%', '^', '&', '*', '('];
      if (
        spellKeys.indexOf(event.key) > -1 ||
        shiftedSpellKeys.indexOf(event.key) > -1
      ) {
        let spellKey = event.key;
        const shiftedSpellKeyIndex = shiftedSpellKeys.indexOf(spellKey);
        if (shiftedSpellKeyIndex > -1) {
          // Convert shifted keys to number keys,
          // in case somebody tried to hit a spell key while sprinting
          spellKey = spellKeys[shiftedSpellKeyIndex];
        }
        if (playerObject.spellAssignments[spellKey] !== undefined) {
          playerObject.activeSpellKey = playerObject.spellAssignments[spellKey];
        } else {
          // Catch keys that are outside of currently assigned list,
          // so that we don't have to update code when we expand them.
          playerObject.activeSpellKey = playerObject.spellAssignments['1'];
        }
      } else if (event.key.length === 1) {
        // Translate all single letter keys to lower case. We do not have "cased" keyboard inputs.
        // This solves a few weird issues:
        // 1. Catching both w & W is easy to forget.
        // 2. If you hold s, then shift, then release S, then s never gets a 'keyup' signal
        playerObject.keyState[event.key.toLowerCase()] = event.type;
      } else {
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
