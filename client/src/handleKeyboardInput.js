/* globals localStorage:true */
import playerObject from './objects/playerObject.js';
import spellAssignments from './objects/spellAssignments.js';
import textObject from './objects/textObject.js';
import processCommandInput from './processCommandInput.js';
import fancyNames from '../../shared/fancyNames.mjs';

function handleKeyboardInput(event) {
  if (!playerObject.externalDialogOpen) {
    // Everything is different if in the "chat" window.
    // We literally use the visibility of the chatInputDiv to determine this,
    // because that is empirically the most literal reality for the user.
    if (playerObject.domElements.chatInputDiv.style.display === 'none') {
      if (
        ((event.key === 't' || event.key === 'T' || event.key === 'Enter') &&
          event.type === 'keyup') ||
        (event.key === '/' && event.type === 'keydown')
      ) {
        // If we do this on 'keydown', we end up with a 't'
        // stuck in the input box.

        // Go into chat/command mode if 't' is pressed.
        // This works even if we are not connected,
        // and this is NOT sent to the server at this time.
        // (If the server needs to know that we are in "chat/command input mode" we can find
        // a way to send that.

        // .hidden = true/false is not compatible with display: flex
        playerObject.chatOpen = true; // Broadcast to other players that chat is open
        playerObject.domElements.chatInputDiv.style.display = 'flex';
        playerObject.domElements.chatInput.focus();
        textObject.escapeToLeaveChat.shouldBeActiveNow = true;
        if (!playerObject.isMobileBrowser) {
          // Normally the left margin is 15px, so we split that to make it comfortable
          playerObject.domElements.chatInputDiv.style.width = `${
            playerObject.canvasDomElement.item(0).offsetWidth - 30
          }px`;
        } else {
          // but for mobile it is 30px to account for curved cornered screens, so we split that.
          playerObject.domElements.chatInputDiv.style.width = `${
            playerObject.canvasDomElement.item(0).offsetWidth - 60
          }px`; // This is shifted to the right 30 px on mobile to account for curved screen corners.
        }
        if (playerObject.domElements.Scrolling.hidden) {
          playerObject.scrollingTextBox.display(false);
        }
      } else if (
        playerObject.spellKeys.indexOf(event.key) > -1 ||
        playerObject.shiftedSpellKeys.indexOf(event.key) > -1
      ) {
        let spellKey = event.key;
        const shiftedSpellKeyIndex =
          playerObject.shiftedSpellKeys.indexOf(spellKey);
        if (shiftedSpellKeyIndex > -1) {
          // Convert shifted keys to un-shifted keys,
          // in case somebody tried to hit a spell key while sprinting
          spellKey = playerObject.spellKeys[shiftedSpellKeyIndex];
        }
        if (spellAssignments.has(spellKey)) {
          playerObject.activeSpell = spellAssignments.get(spellKey);
        } else {
          // Catch keys that are outside of currently assigned list.
          playerObject.activeSpell = spellAssignments.get(
            playerObject.spellKeys[0],
          );
        }
        localStorage.setItem(`activeSpell`, playerObject.activeSpell);
        textObject.spellSetText.text = fancyNames(playerObject.activeSpell);
        textObject.spellSetText.shouldBeActiveNow = true;
        textObject.spellSetText.disappearMessageLater();
      } else if (event.key.length === 1) {
        // Anything that isn't a special game command is tracked in
        // the player object, and acted upon during the next Phaser
        // game loop.

        // Translate all single letter keys to lower case. We do not have "cased" keyboard inputs.

        // This solves a few weird issues:
        // 1. Catching both w & W is easy to forget.
        // 2. If you hold s, then shift, then release S, then s never gets a 'keyup' signal
        playerObject.keyState[event.key.toLowerCase()] = event.type;
      } else {
        playerObject.keyState[event.key] = event.type;
      }
    } else if (event.type === 'keydown') {
      // If the command input box is open, then it hijacks all keyboard input.
      // Operate on key down, not up for special operations while the chat box is open.

      processCommandInput(event);
    }
  }
}

export default handleKeyboardInput;
