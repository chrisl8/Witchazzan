import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import clientSprites from '../objects/clientSprites.js';
import sendDataToServer from '../sendDataToServer.js';
import paths from '../objects/paths.js';
import calculateEventualDirectionTowardLocation from '../utilities/calculateEventualDirectionTowardLocation.js';
import moveSpriteInDirection from '../utilities/moveSpriteInDirection.js';
import npcTeleportation from '../npcBehaviors/npcTeleportation.js';
import npcRaycastUpdate from '../npcBehaviors/npcRaycastUpdate.js';
import npcSpellCaster from '../npcBehaviors/npcSpellCaster.js';
import npcRotateToFaceTarget from '../npcBehaviors/npcRotateToFaceTarget.js';
import npcFollowTarget from '../npcBehaviors/npcFollowTarget.js';
import npcFollowPath from '../npcBehaviors/npcFollowPath.js';

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

      const movementPriority = new Map();
      const movementBehaviorObject = {
        active: false,
        move: false,
        stop: true,
        stopWhileRotating: false,
        destination: {
          x: null,
          y: null,
        },
        rotate: true,
      };
      movementPriority.set('followRaycastTarget', {
        ...movementBehaviorObject,
      });
      movementPriority.set('proceedToWaypoint', {
        ...movementBehaviorObject,
      });
      movementPriority.set('stop', {
        ...movementBehaviorObject,
      });
      movementPriority.get('stop').active = true;
      movementPriority.get('stop').rotate = false;

      let newHadronData = { ...hadron };

      [newHadronData, hadronUpdated] = npcTeleportation({
        hadron,
        map,
        newHadronData,
        hadronUpdated,
        key,
      });

      if (hadron.hlt <= 0 && !hadron.off) {
        // Turn the NPC "off" if the health falls to 0 or below.
        hadronUpdated = true;
        newHadronData.off = true;
        newHadronData.tmo = Math.floor(Date.now() / 1000);
        if (hadron.stc && hadron.stc !== sceneName) {
          // Send de-spawned NPCs back to their original scene
          newHadronData.scn = hadron.stc;
          // X/Y position will be dealt with when it is resurrected.
          // We must manually send hadron data when we set a scene other than the current one on it.
          sendDataToServer.hadronData(newHadronData, key);
        }
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
        if (hadron.sdi) {
          newHadronData.dir = hadron.sdi;
        }
      } else if (!hadron.off) {
        // If the hadron is active, then...

        const [rayCastFoundTarget, rayCastTargetPosition] = npcRaycastUpdate({
          hadron,
          key,
        });

        let isRotating = false;
        if (rayCastFoundTarget && hadron.hasOwnProperty('fac') && hadron.fac) {
          [newHadronData, hadronUpdated, isRotating] = npcRotateToFaceTarget({
            hadron,
            newHadronData,
            hadronUpdated,
            rayCastTargetPosition,
            isRotating,
          });
        }

        const clientSprite = clientSprites.get(key);
        if (
          rayCastFoundTarget &&
          hadron.hasOwnProperty('fol') &&
          hadron.fol &&
          (!isRotating || !hadron.swr)
        ) {
          npcFollowTarget({
            hadron,
            rayCastTargetPosition,
            clientSprite,
          });
        }

        if (
          hadron.hasOwnProperty('fph') &&
          hadron.fph &&
          paths.has(hadron.fph)
        ) {
          [newHadronData, hadronUpdated] = npcFollowPath({
            hadron,
            clientSprite,
            newHadronData,
            hadronUpdated,
          });
        }

        [newHadronData, hadronUpdated] = npcSpellCaster({
          hadron,
          key,
          rayCastFoundTarget,
          delta,
          newHadronData,
          hadronUpdated,
        });
      }

      if (hadronUpdated === true) {
        hadrons.set(key, newHadronData);
      }
    }
  });
}

export default npcBehavior;
