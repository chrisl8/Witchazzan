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
  /* eslint-disable no-param-reassign */
  if (spell === 'writeMessage') {
    playerObject.externalDialogOpen = true;
    // Clear any data left from last time the dialog was opened,
    // and reset state.
    $('#new_message_text').val('');
    $('#message_always_visible').prop('checked', false);
    $('#message_visible_when_online').prop('checked', true);
    $('.checkbox_radio').checkboxradio({ icon: false });
    const dialog = $('#new_message_dialog_div').dialog({
      minWidth: 250,
      modal: true,
      buttons: {
        Ok() {
          const message = $('#new_message_text').val();
          if (message) {
            const newHadronData = {
              id: getUUID(),
              own: owner,
              typ: 'message',
              spr: 'writtenPaper',
              x: initialX,
              y: initialY,
              dir: 'up',
              scn: sceneName,
              vlx: 0,
              vly: 0,
              txt: `${playerObject.name} says, ${message}`,
              tcw: true,
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
    const newHadronData = {
      id: getUUID(),
      own: owner,
      typ: 'spell',
      sub: spell,
      spr: spells[spell].sprite,
      x: initialX,
      y: initialY,
      dir: direction,
      scn: sceneName,
      // Absolute Unit Circle
      // 0 is right
      // Except the Y is inverted in screen coordinates from Unit Circle,
      // but it still works, so don't ask too many questions.
      // cosine is the X component
      // sine is the y component
      // Also Math.sin and cos require angles in Radians!
      // 150 * Math.cos(90 * Math.PI / 180)
      // 150 * Math.cos(90 * Math.PI / 180)
      vlx: spells[spell].velocity * Math.cos((direction * Math.PI) / 180),
      vly: spells[spell].velocity * Math.sin((direction * Math.PI) / 180),
      tcw: true,
      dps,
    };
    hadrons.set(newHadronData.id, newHadronData);
  }
}

export default castSpell;
