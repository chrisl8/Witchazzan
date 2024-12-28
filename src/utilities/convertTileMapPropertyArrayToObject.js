function convertTileMapPropertyArrayToObject(object) {
  const properties = {};
  if (object.hasOwnProperty('properties') && Array.isArray(object.properties)) {
    object.properties.forEach((entry) => {
      if (entry.hasOwnProperty('name') && entry.hasOwnProperty('value')) {
        properties[entry.name] = entry.value;
      }
    });
  }
  return properties;
}

export default convertTileMapPropertyArrayToObject;
