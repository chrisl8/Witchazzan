/* eslint-disable no-param-reassign */
import paths from '../objects/paths.js';
import npcRotateToFaceTarget from './npcRotateToFaceTarget.js';
import npcFollowTarget from './npcFollowTarget.js';
import npcCheckIfStuck from './npcCheckIfStuck.js';
import playerObject from '../objects/playerObject.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';

function npcNavigatePath({
  hadron,
  clientSprite,
  newHadronData,
  hadronUpdated,
}) {
  const path = paths.get(newHadronData.nph);
  if (newHadronData.cpd === undefined) {
    hadronUpdated = true;
    newHadronData.cpd = 0;
  }

  const nextWaypoint = path.get(newHadronData.cpd);
  if (nextWaypoint && clientSprite) {
    // Obtain and store a path if we don't have one yet.
    if (
      !clientSprite.sprite.getData('path') ||
      clientSprite.sprite.getData('pathDestination') !== nextWaypoint
    ) {
      // For local sprites, we must build and store a path locally to use.
      if (playerObject.enableDebug) {
        console.log('Generating new path...');
      }
      // Note that this path ONLY takes the tilemap into account,
      // so it will just barge into obstacles, although the "stuck" logic
      // will get it to move on eventually.
      // If we want it to navigate around sprites, we will need to update
      // the code to put those in the tileset that is used to build the path,
      // and we will need to update the path more often, not just when we reach
      // the end.

      if (!clientSprite.sprite.getData('pathGenerationInProgress')) {
        clientSprite.sprite.setData('pathGenerationInProgress', true);
        this.pathFinder.generatePath(
          { x: clientSprite.sprite.x, y: clientSprite.sprite.y },
          {
            x: nextWaypoint.x,
            y: nextWaypoint.y,
          },
          (newPath) => {
            clientSprite.sprite.setData('nextPathPointIndex', 0);
            clientSprite.sprite.setData('pathDestination', nextWaypoint);
            clientSprite.sprite.setData('path', newPath);
            clientSprite.sprite.setData('pathGenerationInProgress', false);

            // Display options when in debug mode.
            if (newPath && Array.isArray(newPath) && newPath.length > 0) {
              if (playerObject.enableDebug) {
                console.log(newPath);
              }

              // Display Path
              // Remove dots if they existed
              if (
                playerObject.showPathDots &&
                playerObject.showPathDots.length > 0
              ) {
                playerObject.showPathDots.forEach((dot) => {
                  dot.destroy();
                });
                playerObject.showPathDots = null;
              }

              // Display new dots for new path if debugging is on.
              if (playerObject.enableDebug) {
                const fillColor = 0x00ff00;
                const width = 5;
                const height = 5;
                if (!playerObject.showPathDots) {
                  playerObject.showPathDots = [];
                }
                for (const pathEntry of newPath) {
                  const dot = this.add
                    .rectangle(
                      pathEntry.x,
                      pathEntry.y,
                      width,
                      height,
                      fillColor,
                    )
                    .setDepth(objectDepthSettings.showPathDots);
                  playerObject.showPathDots.push(dot);
                }
              }
            }
          },
        );
      } else if (playerObject.enableDebug) {
        console.log('Path generation already in progress.');
      }
    } else if (clientSprite.sprite.getData('path').length === 0) {
      // We generated a path to the waypoint we are already at
      hadronUpdated = true;
      newHadronData.cpd++;
      if (!path.has(newHadronData.cpd)) {
        // Reset to 0 if we are at the end of the waypoint list.
        newHadronData.cpd = 0;
      }
    } else {
      const isStuck = npcCheckIfStuck(clientSprite);
      // Keep this tight or it won't make it around corners!
      // This isn't like the blind "FollowPath", because the path should in theory
      // be 100% followable without getting obstructed.
      const closeEnoughProximity = 2;
      const nextPathPoint =
        clientSprite.sprite.getData('path')[
          clientSprite.sprite.getData('nextPathPointIndex')
        ];
      if (
        isStuck ||
        (Math.abs(Math.trunc(newHadronData.x) - Math.trunc(nextPathPoint.x)) <
          closeEnoughProximity &&
          Math.abs(Math.trunc(newHadronData.y) - Math.trunc(nextPathPoint.y)) <
            closeEnoughProximity)
      ) {
        // TODO: Should generate a new path, not switch waypoints,
        //       but at some point, it might need to switch waypoints?
        //       Perhaps based on path length?
        if (isStuck && playerObject.enableDebug) {
          console.log('stuck!');
        }
        // If we are at the destination stop and set next destination in path
        hadronUpdated = true;
        // Use the next point on the path.
        let nextPathPointIndex =
          clientSprite.sprite.getData('nextPathPointIndex');
        nextPathPointIndex++;
        clientSprite.sprite.setData('nextPathPointIndex', nextPathPointIndex);
        // If we used up our path, then switch to the next waypoint
        if (
          nextPathPointIndex >
          clientSprite.sprite.getData('path').length - 1
        ) {
          if (playerObject.enableDebug) {
            console.log('Reached end of path.');
          }
          newHadronData.cpd++;
          if (!path.has(newHadronData.cpd)) {
            // Reset to 0 if we are at the end of the waypoint list.
            newHadronData.cpd = 0;
          }
        }
        // and stop
        newHadronData.vlx = 0;
        newHadronData.vly = 0;
        if (clientSprite) {
          clientSprite.sprite.body.setVelocityX(0);
          clientSprite.sprite.body.setVelocityY(0);
        }
      } else {
        // NOTE: If your velocity causes the sprites to overshoot the destination, they
        // can get caught in a loop of passing it, turning around, and passing it again.
        // The fix is to slow them down or increase the closeEnoughProximity
        let isRotating = false;
        [newHadronData, hadronUpdated, isRotating] = npcRotateToFaceTarget({
          newHadronData,
          hadronUpdated,
          rayCastTargetPosition: { x: nextPathPoint.x, y: nextPathPoint.y },
          isRotating,
        });
        if (isRotating) {
          // Stop if we are trying to rotate, otherwise we fly off into the void while trying to realign ourselves.
          /*
        NOTE: If they seem to "jerk" across the screen to their destination, it is because they are continually
        getting slightly off course and stopping to adjust their rotation.
         */
          newHadronData.vlx = 0;
          newHadronData.vly = 0;
          if (clientSprite) {
            clientSprite.sprite.body.setVelocityX(0);
            clientSprite.sprite.body.setVelocityY(0);
          }
        } else {
          npcFollowTarget({
            hadron,
            rayCastTargetPosition: { x: nextPathPoint.x, y: nextPathPoint.y },
            clientSprite,
          });
        }
      }
    }
  }
  return [newHadronData, hadronUpdated];
}

export default npcNavigatePath;
