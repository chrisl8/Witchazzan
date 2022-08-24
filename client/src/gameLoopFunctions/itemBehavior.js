import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';
import getUUID from '../utilities/getUUID.js';
import sendDataToServer from '../sendDataToServer.js';

function generateNewHadron(hadron, sceneName) {
  // Generate an ID for this new hadron
  const id = getUUID();
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
  };
  if (hadron.hasOwnProperty('iin')) {
    newHadron.iin = hadron.iin;
  }
  return newHadron;
}

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
      // TODO: When player grabs an important item, suggest to them to put it somewhere safe.

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
              // Wipe the tmo field of the spawner
              delete newHadronData.tmo;
              hadronUpdated = true;

              const newHadron = generateNewHadron(hadron, sceneName);

              // Set it in the .lid field of the item spawner.
              newHadronData.lid = newHadron.id;

              // Ask server to create new item hadron with this ID.
              sendDataToServer.createHadron(newHadron);
            }
          } else if (hadron.tmo) {
            // Always reset the timeout if it exists when a hadron exists.
            hadronUpdated = true;
            delete newHadronData.tmo;
          }
          break;
        case 'allNPCsOff':
          // If no hadron exists in the scene with the last ID spawned for this item,
          if (!hadron.lid || !hadrons.get(hadron.lid)) {
            // Check if all NPCs are off in this scene.
            let allNPCsOff = true;
            hadrons.forEach((sceneHadron) => {
              if (sceneHadron.flv === 'NPC' && !sceneHadron.off) {
                allNPCsOff = false;
              }
            });
            // Check to see if we already spawned since then (Someone took the item already)
            if (allNPCsOff && !hadron.dap) {
              // If all NPCs are off and we have not already spawned: Set the "already spawned" flag and create item.
              hadronUpdated = true;
              newHadronData.dap = true; // Flag as spawned, so we don't do it more than once.
              hadronUpdated = true;

              const newHadron = generateNewHadron(hadron, sceneName);

              // Set it in the .lid field of the item spawner.
              newHadronData.lid = newHadron.id;

              // Ask server to create new item hadron with this ID.
              sendDataToServer.createHadron(newHadron);
            } else if (!allNPCsOff && hadron.dap) {
              // Reset the "already spawned" flag if any NPCs are not off.
              hadronUpdated = true;
              delete newHadronData.dap; // Remove spawned flag for next time.
            }
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
