import Phaser from 'phaser';
import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import clientSprites from '../objects/clientSprites.js';
import calculateVelocityFromDirection from '../utilities/calculateVelocityFromDirection.js';
import getSpawnPointFromMap from '../utilities/getSpawnPointFromMap.js';

function npcBehavior(delta, sceneName, map) {
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

      let hadronUpdated = false;
      const newHadronData = { ...hadron };

      let rayCastFoundTarget = false;

      // NPC TELEPORTATION
      // TODO: After an NPC is murdled, it needs to respawn in the original scene, not where it was killed at.
      if (hadron.hasOwnProperty('de')) {
        // NPCs that hit a teleport layer have the 'de' property on them,
        // and need to be updated
        const spawnPoint = getSpawnPointFromMap(map, hadron.de);

        // Allow a scene entrance to specify to carry over the X or Y value from the previous scene so that you can enter at any point along the edge in a wide doorway.
        if (
          spawnPoint &&
          spawnPoint.hasOwnProperty('properties') &&
          Array.isArray(spawnPoint.properties)
        ) {
          if (
            spawnPoint.properties.find((x) => x.name === 'allowCustomX')
              ?.value &&
            hadron?.px
          ) {
            spawnPoint.x = hadron.px;
          }

          if (
            spawnPoint.properties.find((x) => x.name === 'allowCustomY')
              ?.value &&
            hadron?.py
          ) {
            spawnPoint.y = hadron.py;
          }
        }

        newHadronData.x = spawnPoint.x;
        newHadronData.y = spawnPoint.y;
        delete newHadronData.px;
        delete newHadronData.py;
        delete newHadronData.de;
        const clientSprite = clientSprites.get(key);
        if (clientSprite) {
          // If the sprite exists, we need to update it now, lest it get overwritten.
          clientSprite.sprite.setPosition(newHadronData.x, newHadronData.y);
          clientSprite.sprite.body.setVelocityX(newHadronData.vlx);
          clientSprite.sprite.body.setVelocityY(newHadronData.vly);
        }
        hadronUpdated = true;
      }

      if (hadron.hlt <= 0 && !hadron.off) {
        // Turn the NPC "off" if the health falls to 0 or below.
        hadronUpdated = true;
        newHadronData.off = true;
        newHadronData.tmo = Math.floor(Date.now() / 1000);
        // TODO: A massive explosion would be appreciated.
      } else if (
        hadron.off &&
        hadron.tmo &&
        hadron.ris &&
        Math.floor(Date.now() / 1000) - hadron.tmo > hadron.ris
      ) {
        hadronUpdated = true;

        // Resurrect the hadron on a timer if it exists.
        newHadronData.hlt = newHadronData.mxh;
        newHadronData.off = false;
        // Always respawn at your "home" location
        if (hadron.stx) {
          newHadronData.x = hadron.stx;
        }
        if (hadron.sty) {
          newHadronData.y = hadron.sty;
        }
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
          let currentTargetDistance;
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
                rayCastFoundTarget = true;

                const distance = Phaser.Math.Distance.Between(
                  hadron.x,
                  hadron.y,
                  entry.x,
                  entry.y,
                );
                if (
                  !currentTargetDistance ||
                  distance < currentTargetDistance
                ) {
                  // Always focus on the nearest target.
                  currentTargetDistance = distance;

                  // Rotate toward it
                  // TODO: Only rotate if the NPC has this feature.
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
                  let difference =
                    ((newAngleDeg - hadron.dir + 180) % 360) - 180;
                  difference =
                    difference < -180 ? difference + 360 : difference;

                  const t = 0.05;

                  let newHadronDir = hadron.dir + t * difference;
                  // Let Achilles go ahead and catch the Tortoise
                  if (Math.abs(difference) < 1) {
                    newHadronDir = newAngleDeg;
                  }
                  if (newHadronData.dir !== newHadronDir) {
                    hadronUpdated = true;
                    newHadronData.dir = newHadronDir;
                  }
                }
              }
            }
          });

          // TODO: Probably some other thing should specify this, like the raycasting and spell shooting.
          if (hadron.sub === 'mobileTankTestOne') {
            const clientSprite = clientSprites.get(key);
            if (clientSprite) {
              if (rayCastFoundTarget) {
                clientSprite.sprite.body.setVelocityX(10);
                clientSprite.sprite.body.setVelocityY(10);
              } else {
                clientSprite.sprite.body.setVelocityX(0);
                clientSprite.sprite.body.setVelocityY(0);
              }
            }
          }
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
          let newAni = 'stationary';
          if (rayCastFoundTarget) {
            newAni = 'casting';
          }
          if (newHadronData.ani !== newAni) {
            newHadronData.ani = newAni;
            hadronUpdated = true;
          }
        }
        if (clientSprites.has(key)) {
          // There is a moment before the client sprite exists.
          clientSprites.get(key).spellCastTimer = spellCastTimer;
        }
      }

      if (hadronUpdated === true) {
        hadrons.set(key, newHadronData);
      }
    }
  });
}

export default npcBehavior;
