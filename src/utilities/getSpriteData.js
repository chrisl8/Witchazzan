import spriteSheetList from '../objects/spriteSheetList';
import playerObject from '../objects/playerObject';

function getSpriteData(spriteName) {
  if (!spriteName) {
    // eslint-disable-next-line no-param-reassign
    spriteName = playerObject.defaultSpriteName;
  }
  let spriteIndex = spriteSheetList.findIndex((x) => x.name === spriteName);
  if (spriteIndex < 0) {
    // fall back to the default if the sprite doesn't exist
    // eslint-disable-next-line no-param-reassign
    spriteName = playerObject.defaultSpriteName;
    spriteIndex = spriteSheetList.findIndex((x) => x.name === spriteName);
  }
  return spriteSheetList[spriteIndex];
}

export default getSpriteData;
