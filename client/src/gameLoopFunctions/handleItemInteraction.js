import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';
import sendDataToServer from '../sendDataToServer.js';

function handleItemInteraction() {
  // TODO: Is grabbing multiple items a feature or a bug?
  // TODO: - If it is a feature, is there any rhyme or reason to order?
  // TODO: Should there be some visual indication of dropping an item?
  // TODO: Held items should either NOT be highlighted all, or have a different color highlight to make it clear that we are holding them?
  // TODO: Should this behavior work in multiplayer rooms?
  // TODO: - If so, there needs to be a way to ask the server to give us control, even if we don't have it.
  // TODO: -- Otherwise we cannot "carry" the item.
  // TODO: What should be the behavior when leaving the room with an item in hand?
  if (playerObject.interactNow) {
    // Interact key was pressed
    if (playerObject.nearbyTargetObject.id) {
      // An object is "targeted" by the player raycast code
      if (
        hadrons.get(playerObject.nearbyTargetObject.id) &&
        !hadrons.get(playerObject.nearbyTargetObject.id).hld
      ) {
        // The target object exists (don't crash game in case of shenanigans)
        // but also don't drop things if we thought we had something targeted.
        // We also checked that it isn't already held to avoid wasting the server's time and our bandwidth

        // Ask the server to "grab" it for us.
        sendDataToServer.grabHadron(playerObject.nearbyTargetObject.id);

        // TODO: Build up a list of held items in order.
        // TODO: Rebuild this list on disconnect and re-join.
      }
    } else {
      // If the key is pressed with no object targeted, then it is used to drop items in hand
      // TODO: Check if we are holding any items.
      // TODO: If so, drop the most recently picked up item.
      console.log(playerObject.heldItemList);
    }
    playerObject.interactNow = false; // Always reset this after processing it.
  }
}

export default handleItemInteraction;

/*
 TODO:
 - Items can be targeted and grabbed anywhere in the world.
   - This will require the ability to ask the server to transfer control to the "grabbing" player.
   - Meaning "grabbing" may even be a server, not a client, operation.
   - Be sure to build this and test it in multi-player.
 - Grabbing multiple things at once is totally a thing.
   - The order in which things are grabbed should be preserved somewhere, for use when dropping/firing.
     - The server must hold, at least temporarily, as the client may refresh.
 - Have their relative position to your position:
   - Randomized slightly so they aren't all quite together.
   - Increase their distance from you as your item count increases ("lower" in the stack is further out), to a point.
   - Changes (re-randomize) when you move, but not when you are still.
 - To "collect" an item, you grab it.
 - To "keep" it, you have to hit 'i' while holding it, then drop it in your library.
 - Items that are meant to be repeatedly taken will just respawn after a period of time if someone takes them, somewhat like how tanks respawn after you kill them.
 - Leaving the library, or any room, with an item in your hand carries it with you.
 - Pressing 'f' with an item drops it.
 - Pressing 'spacebar' with an item launches it like a spell.
 - You can place items in spell slots in the library, and then summon them with the spell slot's key. They are then just in your hadn as if you picked them up and you can drop or "fire" them.
 - Items in the hand are dropped/fired in reverse order of being picked up. TODO: Sort out a way to track their order.
 - Same for items placed into spell slots in the library.
 */
