/* globals $:true */
// noinspection JSJQueryEfficiency

import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import spells from './objects/spells.js';
import getUUID from './utilities/getUUID.js';

function castSpell({
  sceneName,
  spell,
  direction,
  initialX,
  initialY,
  owner,
  dps = 1,
}) {
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
              id: getUUID(),
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
    if (direction === -90) {
      // eslint-disable-next-line no-param-reassign
      direction = 'right';
    }
    let velocityX = 0;
    let velocityY = 0;
    if (direction === 'left') {
      velocityX = -spells[spell].velocity;
    } else if (direction === 'right') {
      velocityX = spells[spell].velocity;
    } else if (direction === 'up') {
      velocityY = -spells[spell].velocity;
    } else if (direction === 'down') {
      velocityY = spells[spell].velocity;
    }

    const newHadronData = {
      id: getUUID(),
      own: owner,
      typ: 'spell',
      sub: spell,
      sprt: spells[spell].sprite,
      x: initialX,
      y: initialY,
      dir: direction,
      scn: sceneName,
      velX: velocityX,
      velY: velocityY,
      tcwls: true,
      dps,
    };
    hadrons.set(newHadronData.id, newHadronData);
  }
}

export default castSpell;
