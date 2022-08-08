import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';

function handlePlayerRaycast(sceneName) {
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

    // TODO: This also relates to grabbing multiple items. Is that even allowed?
    // get all game objects in field of view (which bodies overlap ray's field of view)
    const visibleObjects = ray.overlap();
    visibleObjects.forEach((entry) => {
      if (entry.data) {
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
            // TODO: Handle situation of an item you can target, but you cannot take. i.e. A "you can only have one" instance. Maybe use a differnet color and shape?
            // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/#create-shape-object
            playerObject.nearbyTargetObject.rectangle = this.add
              .rectangle(0, 0, 15, 15, 0x000000, 0)
              .setDepth(objectDepthSettings.targetObjectHighlight)
              .setStrokeStyle(1, 0x00ff00, 1);
          }
          playerObject.nearbyTargetObject.rectangle.setPosition(
            hadrons.get(id)?.x,
            hadrons.get(id)?.y,
          );
          playerObject.nearbyTargetObject.id = id;
          // TODO: Grab it.
        }
      }
    });
    if (!rayCastFoundTarget && playerObject.nearbyTargetObject.rectangle) {
      playerObject.nearbyTargetObject.rectangle.destroy();
      playerObject.nearbyTargetObject.rectangle = null;
      playerObject.nearbyTargetObject.id = null;
    }
  }

  // Highlight targeted objects
}

export default handlePlayerRaycast;
