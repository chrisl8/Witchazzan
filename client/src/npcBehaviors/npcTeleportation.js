/* eslint-disable no-param-reassign */
import getSpawnPointFromMap from '../utilities/getSpawnPointFromMap.js';
import clientSprites from '../objects/clientSprites.js';

function npcTeleportation({ hadron, map, newHadronData, hadronUpdated, key }) {
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
        spawnPoint.properties.find((x) => x.name === 'allowCustomX')?.value &&
        hadron?.px
      ) {
        spawnPoint.x = hadron.px;
      }

      if (
        spawnPoint.properties.find((x) => x.name === 'allowCustomY')?.value &&
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

  return [newHadronData, hadronUpdated];
}

export default npcTeleportation;
