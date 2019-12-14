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
import testScene1 from '../assets/tileMaps/testScene1';
import arena1 from '../assets/tileMaps/arena1';

/*
  To "FIX" tilesets so they don't have weird lines around them caused by GPU rendering
As noted:
https://www.html5gamedevs.com/topic/38119-tilemap-displays-grid-lines-render-artifacts/

Use:
https://github.com/sporadic-labs/tile-extruder

 1. cd to the tileset folder and run this:
    npx tile-extruder --tileWidth 16 --tileHeight 16 --input tileset_1bit-16x16.png --output tileset_1bit-16x16-extruded.png
 2. Now you have a 1 pixel Margin and 2 pixel Spacing, so you have to reload the tileset in tiled,
    Per the instructions from the github site:
    "Extrude the tileset and then update your existing tileset in Tiled. In the "Tilesets" panel, click on the edit tileset icon (the wrench) and then click on "Tileset Properties" under the Tileset menu bar item. Edit the "Image" field, replacing the tileset image with the new extruded image and updating to the margin to 1px and spacing to 2px."

 NOTE: Do NOT delete the old non-extruded tileset, because you can't reliably edit the extruded set. Edit the non-extruded one and reexport it.

 */

// TileSets
import tileset1bit16x16 from '../assets/tileSets/tileset_1bit-16x16-extruded.png';
import tilesetZoriaOverworld from '../assets/tileSets/zoria_overworld-extruded.png';

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
        background: '255,255,255,0.9', // rgba
      },
      Scrolling: {
        fontSize: '.03', // percent of scene height.
        color: '#d84b65',
        background: '255,255,255,0.9', // rgba
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
        background: '255,255,255,0.9', // rgba
      },
      Scrolling: {
        fontSize: '.04', // percent of scene height.
        color: '#d84b65',
        background: '255,255,255,0.9', // rgba
      },
    },
  },
  {
    sceneName: 'testScene1',
    tileMap: testScene1,
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
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: '.03', // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
    },
  },
  {
    sceneName: 'arena1',
    tileMap: arena1,
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
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: '.03', // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
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
