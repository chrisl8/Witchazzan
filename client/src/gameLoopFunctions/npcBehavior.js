import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import clientSprites from '../objects/clientSprites.js';

function npcBehavior(delta, sceneName) {
  hadrons.forEach((hadron, key) => {
    const newHadronData = { ...hadron };
    // Only perform behavior operations on hadrons under our control.
    if (
      hadron.typ === 'npc' &&
      hadron.ctrl === playerObject.playerId &&
      hadron.scn === sceneName
    ) {
      // This is all of the "base NPC" behavior.
      // Remember that you can further control or limit the behavior for specific NPCs
      // by checking the hadron.sub field in your if/else statements below.
      // Feel free to exclude a given hadron.sub from these more generic checks at the top.

      let rayCastFoundTarget = false;

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

        // RAYCAST UPDATE
        const ray = clientSprites.get(key)?.ray;
        if (ray) {
          // enable auto slicing field of view
          ray.autoSlice = true;
          // enable arcade physics body
          ray.enablePhysics();
          // Update ray origin
          ray.setOrigin(hadron.x, hadron.y);
          if (
            hadron.rdt &&
            // eslint-disable-next-line no-restricted-globals
            !isNaN(hadron.rdt)
          ) {
            ray.setCollisionRange(hadron.rdt);
          } else {
            ray.setCollisionRange(1000); // TODO: Maybe tie this to game size?
          }
          if (hadron.rtp === 'cone') {
            if (hadron.rcd) {
              ray.setConeDeg(hadron.rcd);
            }
            ray.castCone();
          } else if (hadron.rtp === 'circle') {
            // Circle is default.
            ray.castCircle();
          } else {
            // Line is default.
            // TODO: Set to direction NPC is facing.
            ray.setAngleDeg(0);
            ray.cast();
          }

          // get all game objects in field of view (which bodies overlap ray's field of view)
          const visibleObjects = ray.overlap();
          visibleObjects.forEach((entry) => {
            if (entry.data) {
              const id = entry.getData('hadronId');
              if (
                id !== key &&
                hadrons.get(id)?.typ !== 'spell' &&
                hadrons.get(id)?.typ !== 'message'
              ) {
                rayCastFoundTarget = true;
              }
            }
          });
        }

        let spellCastTimer = clientSprites.get(key)?.spellCastTimer;
        if (hadron.hasOwnProperty('rof') && hadron.hasOwnProperty('spl')) {
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
          newHadronData.anim = 'stationary';
          if (rayCastFoundTarget) {
            newHadronData.anim = 'casting';
          }
        }
        if (clientSprites.has(key)) {
          // There is a moment before the client sprite exists.
          clientSprites.get(key).spellCastTimer = spellCastTimer;
        }
        hadrons.set(key, newHadronData);
      }
    }
  });
}

export default npcBehavior;
