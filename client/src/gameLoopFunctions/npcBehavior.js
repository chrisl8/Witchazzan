import Phaser from 'phaser';
import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import castSpell from '../castSpell.js';
import clientSprites from '../objects/clientSprites.js';
import getSpawnPointFromMap from '../utilities/getSpawnPointFromMap.js';
import sendDataToServer from '../sendDataToServer.js';
import paths from '../objects/paths.js';
import calculateDirectionToLocation from '../utilities/calculateDirectionToLocation.js';
import moveSpriteTowardLocation from '../utilities/moveSpriteTowardLocation.js';

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

      const newHadronData = { ...hadron };

      let rayCastFoundTarget = false;

      // NPC TELEPORTATION
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
        if (clientSprite?.sprite?.body) {
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
                if (
                  !currentTargetDistance ||
                  distance < currentTargetDistance
                ) {
                  // Always focus on the nearest target.
                  currentTargetDistance = distance;

                  movementPriority.get('followRaycastTarget').active = true;
                  movementPriority.get('followRaycastTarget').destination = {
                    x: entry.x,
                    y: entry.y,
                  };
                }
              }
            }
          });

          if (hadron.hasOwnProperty('fol') && hadron.fol) {
            movementPriority.get('followRaycastTarget').move = true;
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

        // Path following
        if (hadron.fph && paths.has(hadron.fph)) {
          const path = paths.get(hadron.fph);
          let nextWaypoint;
          if (hadron.cpd === undefined) {
            hadronUpdated = true;
            newHadronData.cpd = 0;
            nextWaypoint = path.get(0);
          } else {
            nextWaypoint = path.get(hadron.cpd);
          }

          if (nextWaypoint) {
            movementPriority.get('proceedToWaypoint').active = true;
            movementPriority.get('proceedToWaypoint').move = true;
            movementPriority.get('proceedToWaypoint').stop = false;
            movementPriority.get('proceedToWaypoint').destination = {
              x: nextWaypoint.x,
              y: nextWaypoint.y,
            };

            const closeEnoughProximity = 2;
            const clientSprite = clientSprites.get(key);
            if (clientSprite) {
              if (
                Math.abs(Math.trunc(hadron.x) - Math.trunc(nextWaypoint.x)) <
                  closeEnoughProximity &&
                Math.abs(Math.trunc(hadron.y) - Math.trunc(nextWaypoint.y)) <
                  closeEnoughProximity
              ) {
                // If we are at the destination set next destination in path
                movementPriority.get('proceedToWaypoint').move = false;
                movementPriority.get('proceedToWaypoint').stop = true;
                hadronUpdated = true;
                newHadronData.cpd++;
                if (!path.has(newHadronData.cpd)) {
                  // Reset to 0 if we are at the end of the path.
                  newHadronData.cpd = 0;
                }
              }
            }
          }
        }
      }

      // Movement
      let done = false;
      movementPriority.forEach((data) => {
        if (!done && data.active) {
          done = data.active;
          // Rotate toward it
          // TODO: Only rotate if the NPC has this feature.
          const newHadronDirection = calculateDirectionToLocation({
            currentDirection: hadron.dir,
            fromX: hadron.x,
            fromY: hadron.y,
            toX: data.destination.x,
            toY: data.destination.y,
            rotationSpeed: hadron.rsp,
          });

          let rotating = false;
          if (newHadronData.dir !== newHadronDirection) {
            rotating = true;
            hadronUpdated = true;
            newHadronData.dir = newHadronDirection;
          }

          if (data.move && (!rotating || !data.stopWhileRotating)) {
            const clientSprite = clientSprites.get(key);
            moveSpriteTowardLocation({
              sprite: clientSprite,
              currentDirection: hadron.dir,
              velocity: hadron.vel,
              randomizeVelocity: hadron.rvl,
            });
          } else if (data.stop || (rotating && data.stopWhileRotating)) {
            const clientSprite = clientSprites.get(key);
            if (clientSprite) {
              clientSprite.sprite.body.setVelocityX(0);
              clientSprite.sprite.body.setVelocityY(0);
            }
          }
        }
      });

      if (hadronUpdated === true) {
        hadrons.set(key, newHadronData);
      }
    }
  });
}

export default npcBehavior;
