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
import testSceneOne from '../assets/tileMaps/testScene1';

// TileSets
import tileset1bit16x16 from '../assets/tileSets/tileset_1bit-16x16.png';
import tilesetTown32x32 from '../assets/tileSets/tileset_town-32x32.png';
import tilesetZoriaOverworld from '../assets/tileSets/zoria_overworld.png';

const scenes = [
  {
    sceneName: 'openingScene',
    tileMap: openingSceneTileMap,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: {
      width: 16 * 16,
      height: 16 * 11,
    },
    htmlElementParameters: {
      Center: {
        fontSize: '.1', // percent of scene height.
        color: 'red',
      },
      UpperLeft: {
        fontSize: '.05', // percent of scene height.
        color: 'blue',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: '.03', // percent of scene height.
        color: 'blue',
        background: '255,255,255,0.8', // rgba
      },
    },
  },
  {
    sceneName: 'openingSceneRight1',
    tileMap: openingSceneRight1TileMap,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: {
      width: 16 * 16,
      height: 16 * 11,
    },
    htmlElementParameters: {
      Center: {
        fontSize: '.1', // percent of scene height.
        color: 'red',
      },
      UpperLeft: {
        fontSize: '.05', // percent of scene height.
        color: 'blue',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: '.03', // percent of scene height.
        color: 'blue',
        background: '255,255,255,0.8', // rgba
      },
    },
  },
  {
    sceneName: 'testSceneOne',
    tileMap: testSceneOne,
    tileSet: tilesetZoriaOverworld,
    tileSetName: 'Zoria Overworld',
    gameSize: {
      width: 16 * 40,
      height: 16 * 22,
    },
    htmlElementParameters: {
      Center: {
        fontSize: '.1', // percent of scene height.
        color: 'red',
      },
      UpperLeft: {
        fontSize: '.05', // percent of scene height.
        color: 'white',
      },
      Scrolling: {
        fontSize: '.03', // percent of scene height.
        color: 'blue',
      },
    },
  },
  // TODO: This scene is rubbish. Consider not using 32x32 tiles or change player size?
  {
    sceneName: 'colorSceneOne',
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
  sceneList.push(sceneFactory(scene));
});

export default sceneList;
