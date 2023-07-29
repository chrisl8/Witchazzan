/* eslint-disable no-param-reassign */
import clientSprites from '../objects/clientSprites.js';
import castSpell from '../castSpell.js';

function npcSpellCaster({
  hadron,
  key,
  rayCastFoundTarget,
  delta,
  newHadronData,
  hadronUpdated,
}) {
  if (
    clientSprites.has(key) &&
    hadron.hasOwnProperty('rof') &&
    hadron.hasOwnProperty('spl')
  ) {
    // There is a moment before the client sprite exists.
    let spellCastTimer = clientSprites.get(key)?.spellCastTimer;
    // Store local rapidly updating data in clientSprites,
    // to avoid clogging the network with hadron updates that other
    // clients don't need to see.
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(spellCastTimer)) {
      spellCastTimer += delta;
    } else {
      spellCastTimer = 0;
    }

    if (spellCastTimer > hadron.rof) {
      if (rayCastFoundTarget || !hadron.rac) {
        castSpell({
          sceneName: hadron.scn,
          spell: hadron.spl,
          direction: hadron.dir,
          initialX: hadron.x,
          initialY: hadron.y,
          owner: hadron.id,
          dps: hadron.dps,
        });
      }
      spellCastTimer = 0;
    }
    clientSprites.get(key).spellCastTimer = spellCastTimer;
  }
  return [newHadronData, hadronUpdated];
}

export default npcSpellCaster;
