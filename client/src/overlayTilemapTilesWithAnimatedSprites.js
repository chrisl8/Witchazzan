import getSpriteData from './utilities/getSpriteData.js';
import objectDepthSettings from './objects/objectDepthSettings.js';

function overlayTilemapTilesWithAnimatedSprites(
  map,
  gameSize,
  animatedTileOverlayStrategy,
) {
  map.layers.forEach((layer) => {
    const splitLayerName = layer.name.split('/');
    if (splitLayerName.length === 1) {
      if (animatedTileOverlayStrategy[layer.name]) {
        map.filterTiles(
          (tile) => {
            if (
              animatedTileOverlayStrategy[layer.name][tile.index] !==
                undefined &&
              // A probability can be set for a layer, and then only X percentage will randomly be overlaid, instead of all of them.
              (!animatedTileOverlayStrategy[layer.name][
                tile.index
              ].hasOwnProperty('probability') ||
                // https://stackoverflow.com/a/36756480/4982408
                Math.random() <
                  animatedTileOverlayStrategy[layer.name][tile.index]
                    .probability)
            ) {
              const spriteData = getSpriteData(
                animatedTileOverlayStrategy[layer.name][tile.index].sprite,
              );
              const newThing = this.add.sprite(
                tile.pixelX + tile.width / 2,
                tile.pixelY + tile.width / 2,
                spriteData.name,
              );
              newThing.flipX = spriteData.faces === 'right';

              if (
                this.anims.anims.entries.hasOwnProperty(
                  `${spriteData.name}-move-stationary`,
                )
              ) {
                newThing.anims.play(`${spriteData.name}-move-stationary`, true);
              }

              // Set the depth for the sprite.
              if (spriteData.hasOwnProperty('depth')) {
                newThing.setDepth(spriteData.depth);
              } else {
                newThing.setDepth(
                  objectDepthSettings.tileMapSprites[layer.name],
                );
              }
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
      }
    }
  });
}

export default overlayTilemapTilesWithAnimatedSprites;
