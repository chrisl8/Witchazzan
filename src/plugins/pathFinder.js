import Phaser from 'phaser';
import EasyStar from 'easystarjs';

/*
 This is a self-made Phaser plugin to use EasyStar.
 https://easystarjs.com/

 This code is based on these tutorials:
 https://gamedevacademy.org/how-to-use-pathfinding-in-phaser/
 and
 https://www.dynetisgames.com/2018/03/06/pathfinding-easystar-phaser-3/
 */

class PathFinder extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    this.easyStar = new EasyStar.js();
  }

  init(map) {
    // Build a simple nested array based "grid" from the tilemap data
    // for use by EasyStar.
    // This game determines "walk-ability" by tile map layer, NOT by any
    // tile ID or setting within the tile layers themselves.
    // So we set the default to -1, and then replace every grid tile
    // with anything if the layer contains it, otherwise it stays -1
    // Then -1 is the only walkable tile.
    // Logging out the grid to the console should present a pretty clear
    // image of the area that is walkable in the array data.
    const grid = [];
    for (let y = 0; y < map.height; y++) {
      const col = [];
      for (let x = 0; x < map.width; x++) {
        // In each cell we store the ID of the tile, which corresponds
        // to its index in the tileset of the map ("ID" field in Tiled)
        const layers = map.getTileLayerNames();
        // Default is -1, meaning walkable,
        // meaning ANYTHING that exists in the given layer
        // is not walkable.
        let tileIndex = -1;
        for (const layer of layers) {
          if (
            layer === 'Stuff You Run Into' ||
            layer === 'Water' || // Could make this configurable if we want "swimming" NPCs.
            layer.includes('Teleport') // Otherwise they may walk off/around the map!
          ) {
            const tile = map.getTileAt(x, y, true, layer);
            // Only "upgrade" tiles, don't "downgrade" them,
            // as we are iterating over several layers.
            if (tile.index !== -1) {
              tileIndex = tile.index;
            }
          }
        }
        col.push(tileIndex);
      }
      grid.push(col);
    }

    this.gridDimensions = {
      row: map.height,
      column: map.width,
    };

    this.easyStar.setGrid(grid);
    // Again, anything that exists in the layer is not walkable.
    this.easyStar.setAcceptableTiles([-1]);
    this.tileDimensions = { x: map.tileWidth, y: map.tileHeight };

    return this;
  }

  generatePath(origin, target, callback, context) {
    const originCoordinate = this.getCoordinateFromPoint(origin);
    const targetCoordinate = this.getCoordinateFromPoint(target);

    if (
      !this.outsideGrid(originCoordinate) &&
      !this.outsideGrid(targetCoordinate)
    ) {
      this.easyStar.findPath(
        originCoordinate.column,
        originCoordinate.row,
        targetCoordinate.column,
        targetCoordinate.row,
        this.callCallbackFunction.bind(this, callback, context),
      );
      this.easyStar.calculate();
      return true;
    }
    return false;
  }

  callCallbackFunction(callback, context, path) {
    const pathPositions = [];
    if (path !== null) {
      path.forEach((pathCoordinate) => {
        pathPositions.push(
          this.getPointFromCoordinate({
            row: pathCoordinate.y,
            column: pathCoordinate.x,
          }),
        );
      }, this);
    }
    callback.call(context, pathPositions);
  }

  outsideGrid(coord) {
    return (
      coord.row < 0 ||
      coord.row > this.gridDimensions.row - 1 ||
      coord.column < 0 ||
      coord.column > this.gridDimensions.column - 1
    );
  }

  getCoordinateFromPoint(point) {
    const row = Math.floor(point.y / this.tileDimensions.y);
    const column = Math.floor(point.x / this.tileDimensions.x);
    return { row, column };
  }

  getPointFromCoordinate(coord) {
    const x = coord.column * this.tileDimensions.x + this.tileDimensions.x / 2;
    const y = coord.row * this.tileDimensions.y + this.tileDimensions.y / 2;
    return { x, y };
  }
}

export default PathFinder;
