import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import clientSprites from '../objects/clientSprites.js';
import sendDataToServer from '../sendDataToServer.js';
import paths from '../objects/paths.js';
import npcTeleportation from '../npcBehaviors/npcTeleportation.js';
import npcRaycastUpdate from '../npcBehaviors/npcRaycastUpdate.js';
import npcSpellCaster from '../npcBehaviors/npcSpellCaster.js';
import npcRotateToFaceTarget from '../npcBehaviors/npcRotateToFaceTarget.js';
import npcFollowTarget from '../npcBehaviors/npcFollowTarget.js';
import npcFollowPath from '../npcBehaviors/npcFollowPath.js';
import npcNavigatePath from '../npcBehaviors/npcNavigatePath.js';

function npcBehavior(delta, sceneName, map) {
  hadrons.forEach((hadron, key) => {
    // Only perform behavior operations on hadrons under our control.
    if (
      hadron.typ === 'quark' &&
      hadron.flv === 'NPC' &&
      hadron.ctr === playerObject.playerId &&
      hadron.scn === sceneName
    ) {
      // This is all the "base NPC" behavior.
      // Remember that you can further control or limit the behavior for specific NPCs
      // by checking the hadron.sub field in your if/else statements below.
      // Feel free to exclude a given hadron.sub from these more generic checks at the top.

      let clientSprite;
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
        if (hadron.cpd) {
          newHadronData.cpd = hadron.ipd;
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
            newHadronData,
            hadronUpdated,
            rayCastTargetPosition,
            isRotating,
          });
        }

        clientSprite = clientSprites.get(key);
        if (
          rayCastFoundTarget &&
          hadron.hasOwnProperty('fol') &&
          hadron.fol &&
          !isRotating
        ) {
          npcFollowTarget({
            hadron,
            rayCastTargetPosition,
            clientSprite,
          });
        }

        if (
          !rayCastFoundTarget &&
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

        if (
          !rayCastFoundTarget &&
          hadron.hasOwnProperty('nph') &&
          hadron.nph &&
          paths.has(hadron.nph)
        ) {
          [newHadronData, hadronUpdated] = npcNavigatePath.call(this, {
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

      // Update the direction and animation for Sprite Update visuals
      if (hadronUpdated === true) {
        if (clientSprite) {
          let maximumDirectionSize = 0;
          if (clientSprite.sprite.body.velocity.y > 0) {
            newHadronData.ani = 'front';
            maximumDirectionSize = clientSprite.sprite.body.velocity.y;
          } else if (clientSprite.sprite.body.velocity.y < 0) {
            newHadronData.ani = 'back';
            maximumDirectionSize = Math.abs(
              clientSprite.sprite.body.velocity.y,
            );
          }
          // Left/right takes precedence over up/down for animations,
          // if it is a larger velocity.
          if (
            clientSprite.sprite.body.velocity.x > 0 &&
            clientSprite.sprite.body.velocity.x > maximumDirectionSize
          ) {
            newHadronData.ani = 'right';
          } else if (
            clientSprite.sprite.body.velocity.x < 0 &&
            Math.abs(clientSprite.sprite.body.velocity.x) > maximumDirectionSize
          ) {
            newHadronData.ani = 'left';
          }
        }
        hadrons.set(key, newHadronData);
      }
    }
  });
}

export default npcBehavior;
