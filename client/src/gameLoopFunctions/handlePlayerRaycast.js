import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';
import { displayMessage, setMessage } from '../utilities/displayMessage.js';

function handlePlayerRaycast() {
  // Currently a player raycast is ONLY used in the library.
  let rayCastFoundTarget = false;
  if (!playerObject.ray) {
    playerObject.ray = this.raycaster.createRay();
  }
  // RAYCAST UPDATE
  const ray = playerObject.ray;
  if (ray) {
    // enable auto slicing field of view
    ray.autoSlice = true;
    // enable arcade physics body
    ray.enablePhysics();
    // Update ray origin
    ray.setOrigin(playerObject.player.x, playerObject.player.y);

    // NOTE: IF we ever need the raycast to perform multiple duties,
    // the code could be changed to just do a big circle, and then
    // act on hits accordingly, rather than relying on the raycast
    // itself it narrow down what we receive.

    ray.setCollisionRange(25);

    ray.setAngleDeg(playerObject.playerDirection);
    // ray.castCircle();
    // ray.cast();
    ray.setConeDeg(10); // hadron.rcd
    ray.castCone();

    // get all game objects in field of view (which bodies overlap ray's field of view)
    const visibleObjects = ray.overlap();
    visibleObjects.forEach((entry) => {
      if (!rayCastFoundTarget && entry.data) {
        // Always target the first thing, not the last.
        const id = entry.getData('hadronId');
        if (
          hadrons.get(id)?.typ && // Can be undefined momentarily during initial creation
          hadrons.get(id)?.flv === 'Item' &&
          !hadrons.get(id)?.hld && // Exclude currently held items
          id !== playerObject.playerId && // Not player itself
          hadrons.get(id)?.typ !== 'spell' // Not a spell
        ) {
          // We found a target
          rayCastFoundTarget = true;
          if (!playerObject.nearbyTargetObject.rectangle) {
            // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/#create-shape-object
            playerObject.nearbyTargetObject.rectangle = this.add
              .rectangle(0, 0, 15, 15, 0x000000, 0)
              .setDepth(objectDepthSettings.targetObjectHighlight)
              .setStrokeStyle(1, 0x00ff00, 1);
          }

          if (playerObject.nearbyTargetObject.id !== id) {
            if (
              hadrons.get(id)?.scn !== 'Library' &&
              hadrons.get(id)?.iin &&
              (playerObject.importantItems.indexOf(hadrons.get(id)?.iin) > -1 ||
                playerObject.heldItemList
                  .map((heldItem) => hadrons.get(heldItem)?.iin)
                  .indexOf(hadrons.get(id)?.iin) > -1)
            ) {
              playerObject.nearbyTargetObject.rectangle.setStrokeStyle(
                1,
                0xff0000,
                1,
              );
              setMessage('You already have one of these. Nobody can have two.');
              displayMessage();
            } else {
              playerObject.nearbyTargetObject.id = id;
            }
          }
          playerObject.nearbyTargetObject.rectangle.setPosition(
            hadrons.get(id)?.x,
            hadrons.get(id)?.y,
          );
        }
      }
    });
    if (!rayCastFoundTarget && playerObject.nearbyTargetObject.rectangle) {
      playerObject.nearbyTargetObject.rectangle.destroy();
      playerObject.nearbyTargetObject.rectangle = null;
      playerObject.nearbyTargetObject.id = null;
    }
  }
}

export default handlePlayerRaycast;
