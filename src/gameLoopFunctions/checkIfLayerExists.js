function checkIfLayerExists(layer, map) {
  const tilemapList = map.getTileLayerNames();
  return tilemapList.findIndex((entry) => entry === layer) > -1;
}

export default checkIfLayerExists;
