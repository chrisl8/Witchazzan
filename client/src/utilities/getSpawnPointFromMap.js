import convertTileMapPropertyArrayToObject from './convertTileMapPropertyArrayToObject.js';

function getSpawnPointFromMap(map, destinationEntrance) {
  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the .json file, there's an object layer with a point named "Default Spawn Point"
  let spawnPoint = map.findObject(
    'Objects',
    (obj) => obj.name === 'Default Spawn Point',
  );
  if (destinationEntrance) {
    const entranceList = map.filterObjects(
      'Objects',
      (obj) => convertTileMapPropertyArrayToObject(obj).Type === 'Entrance',
    );
    if (entranceList && entranceList.length > 0) {
      const requestedEntranceIndex = entranceList.findIndex(
        (x) => x.name === destinationEntrance,
      );
      if (requestedEntranceIndex > -1) {
        spawnPoint = entranceList[requestedEntranceIndex];
      }
    }
  }
  return spawnPoint;
}

export default getSpawnPointFromMap;
