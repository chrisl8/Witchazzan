import getSpriteData from './utilities/getSpriteData.js';
import objectDepthSettings from './objects/objectDepthSettings.js';

function replaceTilemapTilesWithAnimatedSprites(
  map,
  gameSize,
  animatedTileReplacementStrategy,
) {
  map.layers.forEach((layer) => {
    const splitLayerName = layer.name.split('/');
    if (splitLayerName.length === 1) {
      if (animatedTileReplacementStrategy[layer.name]) {
        map.filterTiles(
          (tile) => {
            if (
              animatedTileReplacementStrategy[layer.name][tile.index] !==
                undefined &&
              // A probability can be set for a layer, and then only X percentage will randomly be replaced, instead of all of them.
              (!animatedTileReplacementStrategy[layer.name].hasOwnProperty(
                'probability',
              ) ||
                // https://stackoverflow.com/a/36756480/4982408
                Math.random() <
                  animatedTileReplacementStrategy[layer.name].probability)
            ) {
              const spriteData = getSpriteData(
                animatedTileReplacementStrategy[layer.name][tile.index],
              );
              const newThing = this.physics.add
                .sprite(tile.pixelX, tile.pixelY, spriteData.name)
                .setSize(tile.width, tile.height)
                .setOrigin(0, 0);
              newThing.displayHeight = tile.height;
              newThing.displayWidth = tile.width;
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

              // There is no reason for these to have physics bodies,
              // they are just for animation. In theory this will improve performance?
              newThing.disableBody();
              // Uncomment this section to see what tiles are not being replaced.
              // } else {
              //   console.log(layer.name, tile.index);
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

export default replaceTilemapTilesWithAnimatedSprites;
