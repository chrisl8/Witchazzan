import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';

function handleLibrary(sceneName) {
  // Spawn player's inventory into hadrons if they do not already exist
  playerObject.inventory.forEach((item) => {
    if (!hadrons.get(item.id)) {
      // console.log(item.id);
      // const newHadronData = { ...item };
      //
      // // If the x/y doesn't have a position, spawn at the player position.
      // if (!newHadronData.x) {
      //   newHadronData.x = playerObject.player.x;
      // }
      // if (!newHadronData.y) {
      //   newHadronData.y = playerObject.player.y;
      // }
      //
      // newHadronData.scn = sceneName;
      // console.log(newHadronData);
      // hadrons.set(newHadronData.id, newHadronData);
    }
  });
}

export default handleLibrary;
