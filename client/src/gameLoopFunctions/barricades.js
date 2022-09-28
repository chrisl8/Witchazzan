import playerObject from '../objects/playerObject.js';
import barricadeSprites from '../objects/barricadeSprites.js';

function barricades(map, gameSize) {
  // Barricade Layers
  map.layers.forEach((layer) => {
    const splitLayerName = layer.name.split('/');
    if (splitLayerName.length > 1 && splitLayerName[0] === 'Barricade') {
      const keyName = splitLayerName[1];
      if (
        !barricadeSprites.has(keyName) &&
        playerObject.importantItems.indexOf(keyName) === -1
      ) {
        const spriteList = [];
        map.filterTiles(
          (tile) => {
            if (tile.index > -1) {
              const newSprite = this.physics.add
                .sprite(
                  tile.pixelX + tile.width / 2,
                  tile.pixelY + tile.width / 2,
                  'atlasOne',
                  `${splitLayerName[0]}-${keyName.replace(/\s+/g, '')}`,
                )
                .setImmovable(true)
                .setDepth(300);
              // Player cannot cross barricades
              this.physics.add.collider(playerObject.player, newSprite);
              spriteList.push(newSprite);
            }
          },
          this,
          1,
          1,
          gameSize.width,
          gameSize.height,
          { isNotEmpty: true },
          layer.name,
        );
        barricadeSprites.set(keyName, spriteList);
      } else if (
        barricadeSprites.has(keyName) &&
        playerObject.importantItems.indexOf(keyName) > -1
      ) {
        barricadeSprites.get(keyName).forEach((sprite) => {
          sprite.destroy();
        });
        barricadeSprites.delete(keyName);
      }
    }
  });
}

export default barricades;
