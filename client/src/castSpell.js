/* globals document:true */
import throttle from 'lodash/throttle.js';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import spells from './objects/spells.js';
import getUUID from './utilities/getUUID.js';
import calculateVelocityFromDirection from './utilities/calculateVelocityFromDirection.js';

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
      vlx: calculateVelocityFromDirection.x(spells[spell].velocity, direction),
      vly: calculateVelocityFromDirection.y(spells[spell].velocity, direction),
      tcw: true,
      dps,
      fly: spells[spell].fly,
    };
    hadrons.set(newHadronData.id, newHadronData);
  }
}
const throttledSpellCaster = throttle(castSpell, 100);

// export default throttledSpellCaster;
export default throttledSpellCaster;
