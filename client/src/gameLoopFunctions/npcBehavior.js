import Phaser from 'phaser';
import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import clientSprites from '../objects/clientSprites.js';

function npcBehavior(delta, sceneName) {
  hadrons.forEach((hadron, key) => {
    // Only perform behavior operations on hadrons under our control.
    if (
      hadron.typ === 'quark' &&
      hadron.flv === 'NPC' &&
      hadron.ctr === playerObject.playerId &&
      hadron.scn === sceneName
    ) {
      // This is all of the "base NPC" behavior.
      // Remember that you can further control or limit the behavior for specific NPCs
      // by checking the hadron.sub field in your if/else statements below.
      // Feel free to exclude a given hadron.sub from these more generic checks at the top.

      const newHadronData = { ...hadron };

      let rayCastFoundTarget = false;

      if (hadron.hlt <= 0 && !hadron.off) {
        // Turn the NPC "off" if the health falls to 0 or below.
        hadrons.get(key).off = true;
        hadrons.get(key).tmo = Math.floor(Date.now() / 1000);
        // TODO: A massive explosion would be appreciated.
      } else if (
        hadron.off &&
        hadron.tmo &&
        hadron.ris &&
        Math.floor(Date.now() / 1000) - hadron.tmo > hadron.ris
      ) {
        // Resurrect the hadron on a timer if it exists.
        hadrons.get(key).hlt = hadrons.get(key).mxh;
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
          // eslint-disable-next-line no-restricted-globals
          if (hadron.dir && !isNaN(hadron.dir)) {
            ray.setAngleDeg(hadron.dir);
          }
          if (hadron.rtp === 'cone') {
            if (hadron.rcd) {
              ray.setConeDeg(120); // hadron.rcd
            }
            ray.castCone();
          } else if (hadron.rtp === 'circle') {
            // Circle is default.
            ray.castCircle();
          } else {
            // Line is default.
            ray.cast();
          }

          // get all game objects in field of view (which bodies overlap ray's field of view)
          const visibleObjects = ray.overlap();
          visibleObjects.forEach((entry) => {
            if (entry.data) {
              const id = entry.getData('hadronId');
              if (
                hadrons.get(id)?.typ && // Can be undefined momentarily during initial creation
                id !== key && // Not NPC itself
                hadrons.get(id)?.typ !== 'spell' && // Not a spell
                hadrons.get(id)?.typ !== 'message' && // not a message
                hadrons.get(id)?.flv !== 'NPC' // Don't shoot each other
              ) {
                // We found a target
                rayCastFoundTarget = true; // TODO: Uncomment

                // Rotate toward it
                // TODO: Only rotate if the NPC has this feature.
                // TODO: Deal with multiples players in view
                //       Any method of picking is fine, but it should be sticky, not easily distracted
                const newAngleRad = Phaser.Math.Angle.Between(
                  hadron.x,
                  hadron.y,
                  entry.x,
                  entry.y,
                );
                // Deal with angles that are physically close to each other but cross boundaries,
                // making them numerically distant
                // This should work regardless of where that boundary is.
                // https://stackoverflow.com/a/28037434/4982408
                const newAngleDeg = newAngleRad * Phaser.Math.RAD_TO_DEG;
                let difference = ((newAngleDeg - hadron.dir + 180) % 360) - 180;
                difference = difference < -180 ? difference + 360 : difference;

                const t = 0.05;
                newHadronData.dir = hadron.dir + t * difference;
                // Let Achilles go ahead and catch the Tortoise
                if (Math.abs(difference) < 1) {
                  newHadronData.dir = newAngleDeg;
                }
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
          newHadronData.ani = 'stationary';
          if (rayCastFoundTarget) {
            newHadronData.ani = 'casting';
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
