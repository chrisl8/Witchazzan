/* globals document:true */
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import spells from './objects/spells.js';
import getUUID from './utilities/getUUID.js';

const messageDialog = document.getElementById('messageDialog');
const newMessageText = document.getElementById('new_message_text');
const messageAlwaysVisible = document.getElementById('message_always_visible');
const messageVisibleWhenOnline = document.getElementById(
  'message_visible_when_online',
);
let messageHadronData;

function resetMessageDialog() {
  newMessageText.value = '';
  messageVisibleWhenOnline.checked = true;
  messageAlwaysVisible.checked = false;
  messageHadronData = null;
}

resetMessageDialog();

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof messageDialog.showModal !== 'function') {
  messageDialog.hidden = true;
}

messageDialog.addEventListener('close', () => {
  playerObject.externalDialogOpen = false;
  if (
    messageDialog.returnValue === 'OK' &&
    newMessageText.value &&
    messageHadronData
  ) {
    const newHadronData = {
      id: getUUID(),
      own: messageHadronData.owner,
      typ: 'message',
      spr: 'writtenPaper',
      x: messageHadronData.initialX,
      y: messageHadronData.initialY,
      dir: 'up',
      scn: messageHadronData.sceneName,
      vlx: 0,
      vly: 0,
      txt: `${playerObject.name} says, ${newMessageText.value}`,
      tcw: true,
      pod: messageAlwaysVisible.checked,
    };
    hadrons.set(newHadronData.id, newHadronData);
  }
  resetMessageDialog();
});

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
    resetMessageDialog();
    messageHadronData = {
      sceneName,
      initialX,
      initialY,
      owner,
    };
    messageDialog.showModal();
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
