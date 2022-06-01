import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import clientSprites from '../objects/clientSprites.js';

function npcBehavior(delta) {
  hadrons.forEach((hadron, key) => {
    // Only perform behavior operations on hadrons under our control.
    if (hadron.typ === 'npc' && hadron.ctrl === playerObject.playerId) {
      // This is all of the "base NPC" behavior.
      // Remember that you can further control or limit the behavior for specific NPCs
      // by checking the hadron.sub field in your if/else statements below.
      // Feel free to exclude a given hadron.sub from these more generic checks at the top.

      if (hadron.hlth <= 0 && !hadron.off) {
        // Turn the NPC "off" if the health falls to 0 or below.
        hadrons.get(key).off = true;
        hadrons.get(key).tmoff = Math.floor(Date.now() / 1000);
        // TODO: A massive explosion would be appreciated.
      } else if (
        hadron.off &&
        hadron.tmoff &&
        hadron.ris &&
        Math.floor(Date.now() / 1000) - hadron.tmoff > hadron.ris
      ) {
        // Resurrect the hadron on a timer if it exists.
        hadrons.get(key).hlth = hadrons.get(key).maxhlth;
        hadrons.get(key).off = false;
      } else if (!hadron.off) {
        // If the hadron is active, then...

        let spellCastTimer = clientSprites.get(key)?.spellCastTimer;
        if (hadron.hasOwnProperty('rof') && hadron.hasOwnProperty('spl')) {
          // TODO: Consider tying rate of fire to NPC's health (in either direction).
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
            castSpell({
              sceneName: hadron.scn,
              spell: hadron.spl,
              direction: hadron.dir,
              initialX: hadron.x,
              initialY: hadron.y,
              owner: hadron.id,
            });
            // TODO: Detect player and only fire when they are in line of fire.
            // https://phaser.io/news/2021/05/phaser-raycaster
            // TODO: Detect player distance and limit "range" that it will attempt to fire to.
            //       Note, the spells may go further than this range, but it won't TRY to fire if you aren't closer.
            //       Eventually we could limit the range?
            spellCastTimer = 0;
          }
        }
        if (clientSprites.has(key)) {
          // There is a moment before the client sprite exists.
          clientSprites.get(key).spellCastTimer = spellCastTimer;
        }
      }
    }
  });
}

export default npcBehavior;
