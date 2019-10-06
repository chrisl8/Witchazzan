/*
 * This loads up all of the scenes.
 * It is literally just copy/paste of the import lines,
 * and scenes array with the names of the tilemaps.
 *
 * TODO: Write a script to generate this file based on the names
 *  of the files in the tilemap folder,
 *  which would run before the webpack build.
 *
 * For now, to add a scene:
 * 1. Add an import line for it.
 * 2. Add an entry to the scenes array for it.
 *
 * Good advice on Pixel Art:
 * https://weareludicrous.com/blog/2018/baby-steps-in-pixel-art/
 *
 * The Zoom level is the size of the map on screen. Anything beyond that
 * will scroll about to follow the user.
 * Typically this wil be a 20 x 11 32 pixel map with a 16:9 aspect ratio.
 * Although for the old school maps it can be 16 x 11 16 pixel maps for 4:3.
 */
import sceneFactory from './sceneFactory';

// Scenes
import openingSceneTileMap from '../assets/tileMaps/openingScene';
import openingSceneRight1TileMap from '../assets/tileMaps/openingSceneRight1';
import colorSceneOne from '../assets/tileMaps/colorSceneOne';

// TileSets
import tileset1bit16x16 from '../assets/tileSets/tileset_1bit-16x16.png';
import tilesetTown32x32 from '../assets/tileSets/tileset_town-32x32.png';

const scenes = [
  {
    name: 'openingScene',
    tileMap: openingSceneTileMap,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: {
      width: 16 * 16,
      height: 16 * 11,
    },
  },
  {
    name: 'openingSceneRight1',
    tileMap: openingSceneRight1TileMap,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: {
      width: 16 * 16,
      height: 16 * 11,
    },
  },
  {
    name: 'colorSceneOne',
    tileMap: colorSceneOne,
    tileSet: tilesetTown32x32,
    tileSetName: 'tileset_town-32x32',
    gameSize: {
      width: 32 * 20,
      height: 32 * 11,
    },
  },
];

// Code below here automatically generates all of the scenes from the lists above,
// which is used by the rootGameObjects.js for the Phaser scene array.

const sceneList = [];
scenes.forEach((scene) => {
  sceneList.push(
    sceneFactory({
      sceneName: scene.name,
      tileMap: scene.tileMap,
      tileSet: scene.tileSet,
      tileSetName: scene.tileSetName,
      gameSize: scene.gameSize,
    }),
  );
});

export default sceneList;
