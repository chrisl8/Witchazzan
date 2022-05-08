/* globals crypto:true */
/* globals $:true */
// noinspection JSJQueryEfficiency

import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';

function castSpell({ sceneName, spell, direction, initialX, initialY, owner }) {
  if (spell === 'writeMessage') {
    playerObject.externalDialogOpen = true;
    // Clear any data left from last time the dialog was opened,
    // and reset state.
    $('#new_message_text').val('');
    $('#message_always_visible').prop('checked', false);
    $('#message_visible_when_online').prop('checked', true);
    $('.checkbox_radio').checkboxradio({ icon: false });
    const dialog = $('#new_message_dialog_div').dialog({
      width: '50%',
      modal: true,
      buttons: {
        Ok() {
          const message = $('#new_message_text').val();
          if (message) {
            const newHadronData = {
              id: crypto.randomUUID(),
              own: owner,
              typ: 'message',
              sprt: 'writtenPaper',
              x: initialX,
              y: initialY,
              dir: 'up',
              scn: sceneName,
              velX: 0,
              velY: 0,
              txt: message,
              tcwls: true,
              pod: $('#message_always_visible').is(':checked'),
            };
            hadrons.set(newHadronData.id, newHadronData);
          }
          dialog.dialog('close');
        },
        Cancel() {
          dialog.dialog('close');
        },
      },
      close() {
        playerObject.externalDialogOpen = false;
      },
    });
  } else {
    const velocity = 150; // TODO: Should be set "per spell"
    // TODO: Should the velocity be ADDED to the player's current velocity?
    // TODO: This is a bit hacked to deal with numeric velocities, which should probably be improved.
    if (direction === -90) {
      // eslint-disable-next-line no-param-reassign
      direction = 'right';
    }
    let velocityX = 0;
    let velocityY = 0;
    if (direction === 'left') {
      velocityX = -velocity;
    } else if (direction === 'right') {
      velocityX = velocity;
    } else if (direction === 'up') {
      velocityY = -velocity;
    } else if (direction === 'down') {
      velocityY = velocity;
    }

    // TODO: Using a different spell is more than just a matter of changing the sprite,
    //       but that is what we have here for now.
    // TODO: Each spell should have an entire description in some sort of spells file.
    const newHadronData = {
      id: crypto.randomUUID(),
      own: owner,
      typ: 'spell',
      sub: spell,
      sprt: spell,
      x: initialX,
      y: initialY,
      dir: direction,
      scn: sceneName,
      velX: velocityX,
      velY: velocityY,
      tcwls: true,
    };
    hadrons.set(newHadronData.id, newHadronData);
  }
}

export default castSpell;
