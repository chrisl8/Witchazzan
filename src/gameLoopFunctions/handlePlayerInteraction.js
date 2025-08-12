import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';
import sendDataToServer from '../sendDataToServer.js';

function handlePlayerInteraction() {
  // TODO: Is there a way to track and keep held item order?
  // TODO: Should there be some visual indication of dropping an item?
  if (playerObject.interactNow) {
    // Interact key was pressed
    if (playerObject.nearbyTargetObject.id) {
      // An object is "targeted" by the player raycast code
      if (
        hadrons.has(playerObject.nearbyTargetObject.id) &&
        !hadrons.get(playerObject.nearbyTargetObject.id)?.hld
      ) {
        // The target object exists (don't crash game in case of shenanigans)
        // but also don't drop things if we thought we had something targeted.
        // We also checked that it isn't already held to avoid wasting the server's time and our bandwidth

        // Ask the server to "grab" it for us.
        sendDataToServer.grabHadron(playerObject.nearbyTargetObject.id);
      }
    } else if (playerObject.heldItemList.length > 0) {
      // If the key is pressed with no object targeted, then it is used to drop items in hand
      const itemToDrop = playerObject.heldItemList.pop();
      const newHadronData = hadrons.get(itemToDrop);
      if (newHadronData) {
        delete newHadronData.hld;
        newHadronData.pod = true; // Items on the ground should persist when you leave the room.
        newHadronData.tcw = true; // Items on the ground should change ownership when you leave the room.
        hadrons.set(itemToDrop, newHadronData);
      }
    }
    playerObject.interactNow = false; // Always reset this after processing it.
  }

  if (playerObject.rotateNow) {
    // Rotate objects in hand
    playerObject.rotateNow = false;
    if (playerObject.heldItemList.length > 0) {
      playerObject.heldItemList.forEach((entry) => {
        const newHadronData = { ...hadrons.get(entry) };
        newHadronData.dir += 90;
        if (newHadronData.dir >= 360) {
          newHadronData.dir = 0;
        }
        hadrons.set(entry, newHadronData);
      });
    } else {
      playerObject.newPlayerDirection += 90;
      if (playerObject.newPlayerDirection >= 360) {
        playerObject.newPlayerDirection = 0;
      }
    }
  }
}

export default handlePlayerInteraction;

/*
 TODO:
 - The order in which things are grabbed should be preserved somewhere, for use when dropping/firing.
 - Have their relative position to your position:
   - Randomized slightly so they aren't all quite together.
   - Increase their distance from you as your item count increases ("lower" in the stack is further out), to a point.
   - Changes (re-randomize) when you move, but not when you are still.
 - Pressing 'spacebar' with an item launches it like a spell.
 - You can place items in spell slots in the library, and then summon them with the spell slot's key. They are then just in your hadn as if you picked them up and you can drop or "fire" them.
 - Items in the hand are dropped/fired in reverse order of being picked up. TODO: Sort out a way to track their order.
 - Same for items placed into spell slots in the library.
 - Should items have some "properties"? i.e:
   - Blocks spells (when dropped) vs. spells pass through it (can be use as a shield)
   - "Rot", as in, it will just disappear if left for too long. Both in the map and/or in the librarY/
     - Maybe different for each?
 - Should we drop held items when killed?
 */
