import Phaser from 'phaser';
import clientSprites from '../objects/clientSprites.js';
import hadrons from '../objects/hadrons.js';

function npcRaycastUpdate({ hadron, key }) {
  let rayCastFoundTarget;
  let rayCastTargetPosition;
  // RAYCAST UPDATE
  const ray = clientSprites.get(key)?.ray;
  if (ray) {
    // enable auto slicing field of view
    ray.autoSlice = true;
    // enable arcade physics body
    ray.enablePhysics();
    // Update ray origin
    ray.setOrigin(hadron.x, hadron.y);

    // If "nearby detection" is enabled, first make a small circle and look at it.
    let nearbyObjects = [];
    if (hadron.nbc) {
      ray.castCircle();
      ray.setCollisionRange(hadron.nbc);
      ray.cast();
      nearbyObjects = [...ray.overlap()];
    }

    if (
      hadron.rdt &&
      // eslint-disable-next-line no-restricted-globals
      !isNaN(hadron.rdt)
    ) {
      ray.setCollisionRange(hadron.rdt);
    }
    // eslint-disable-next-line no-restricted-globals
    if (hadron.dir && !isNaN(hadron.dir)) {
      ray.setAngleDeg(hadron.dir);
    }
    if (hadron.rtp.toLowerCase() === 'cone') {
      if (hadron.rcd) {
        ray.setConeDeg(hadron.rcd);
      }
      ray.castCone();
    } else if (hadron.rtp.toLowerCase() === 'circle') {
      // Circle is default.
      ray.castCircle();
    } else {
      // Line is default.
      ray.cast();
    }

    // get all game objects in field of view (which bodies overlap ray's field of view)
    const visibleObjects = nearbyObjects.concat(ray.overlap());
    let currentTargetDistance;
    visibleObjects.forEach((entry) => {
      if (entry.data) {
        const id = entry.getData('hadronId');
        if (
          hadrons.get(id)?.typ && // Can be undefined momentarily during initial creation
          id !== key && // Not NPC itself
          hadrons.get(id)?.typ !== 'spell' && // Not a spell
          hadrons.get(id)?.typ !== 'message' && // not a message
          hadrons.get(id)?.flv !== 'NPC' && // Don't shoot each other
          hadrons.get(id)?.typ !== 'quark' && // Not the quarks either
          (!hadrons.get(id)?.iin || !hadrons.get(id)?.iin.includes('Key')) // Don't shoot the keys
        ) {
          // We found a target
          rayCastFoundTarget = true;

          const distance = Phaser.Math.Distance.Between(
            hadron.x,
            hadron.y,
            entry.x,
            entry.y,
          );
          if (!currentTargetDistance || distance < currentTargetDistance) {
            // Always focus on the nearest target.
            currentTargetDistance = distance;

            rayCastTargetPosition = {
              x: entry.x,
              y: entry.y,
            };
          }
        }
      }
    });
  }

  return [rayCastFoundTarget, rayCastTargetPosition];
}

export default npcRaycastUpdate;
