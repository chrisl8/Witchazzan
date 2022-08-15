import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import getUUID from '../utilities/getUUID.js';
import sendDataToServer from '../sendDataToServer.js';

function itemBehavior(delta, sceneName) {
  hadrons.forEach((hadron, key) => {
    // Only perform behavior operations on hadrons under our control.
    if (
      hadron.hasOwnProperty('fnc') && // Only "spawner" items with functions are evaluated, not their children.
      hadron.typ === 'quark' &&
      hadron.flv === 'Item' &&
      hadron.ctr === playerObject.playerId && // Only items WE are controlling.
      hadron.scn === sceneName // This should always be the case, but just in case.
    ) {
      // This is all of the "base NPC" behavior.
      // Remember that you can further control or limit the behavior for specific NPCs
      // by checking the hadron.sub field in your if/else statements below.
      // Feel free to exclude a given hadron.sub from these more generic checks at the top.

      let hadronUpdated = false;
      const newHadronData = { ...hadron };
      // TODO: Some items should be one per person (you can only have one), but you can still see them.
      // TODO: New fucntion to spawn item when all enemies in the room are dead, and then not again until they respawn.

      // The "last ID" .lid is the last ID that was spawned for this item
      // If there is no.lid, then no hadron has ever been created, and one should be now.
      // If no hadron with the .lid ID exists in the current scene, then a new one should be spawned.
      // However, wait for the .ris time to pass before spawning a new one.
      // This means that when you take an item and leave the room with it, a new one will later spawn.

      switch (hadron.fnc) {
        case 'respawn':
          // If no hadron exists in the scene with the last ID spawned for this item
          if (!hadron.lid || !hadrons.get(hadron.lid)) {
            if (!hadron.tmo) {
              // We start the timer from the moment that we see this condition
              newHadronData.tmo = Math.floor(Date.now() / 1000);
              hadronUpdated = true;
            } else if (
              Math.floor(Date.now() / 1000) - hadron.tmo >
              hadron.ris
            ) {
              // If the timer has run out, then spawn a new one.
              // Generate an ID for this new hadron
              const id = getUUID();
              // Set it in the .lid field of the item spawner.
              newHadronData.lid = id;
              // Wipe the tmo field of the spawner
              delete newHadronData.tmo;
              hadronUpdated = true;
              const newHadron = {
                id,
                own: id, // Item will own itself until someone claims it.
                x: hadron.x,
                y: hadron.y,
                spr: hadron.spr,
                typ: 'quark',
                flv: 'Item',
                scn: sceneName,
                dod: hadron.dod,
                pod: hadron.pod,
                tcw: true, // Items need to do this.
                ani: hadron.ani,
                dir: hadron.dir,
                // How do we set rotation on the items and allow user to rotate them?
              };
              // Ask server to create new item hadron with this ID.
              sendDataToServer.createHadron(newHadron);
            }
          } else if (hadron.tmo) {
            // Always reset the timeout if it exists when a hadron exists.
            hadronUpdated = true;
            delete newHadronData.tmo;
          }
          break;
        default:
          console.error(`Hadron ${key} has unknown Function ${hadron.fnc}.`);
      }
      if (hadronUpdated) {
        hadrons.set(key, newHadronData);
      }
    }
  });
}

export default itemBehavior;
