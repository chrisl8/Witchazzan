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
 * The Zoom level is the size of the map on screen.
 * Anything beyond that
 * will scroll about to follow the user.
 * Typically this wil be a 20 x 11 32 pixel map with a 16:9 aspect ratio.
 * Although for the old school maps it can be 16 x 11 16 pixel maps for 4:3.
 */
import sceneFactory from './sceneFactory';

// Scenes
import LoruleH8 from '../assets/tileMaps/LoruleH8.json';
import LoruleI8 from '../assets/tileMaps/LoruleI8.json';
import LoruleH7 from '../assets/tileMaps/LoruleH7.json';
import LoruleG7 from '../assets/tileMaps/LoruleG7.json';
import LoruleG8 from '../assets/tileMaps/LoruleG8.json';
import LoruleF8 from '../assets/tileMaps/LoruleF8.json';
import LoruleH6 from '../assets/tileMaps/LoruleH6.json';
import LoruleI7 from '../assets/tileMaps/LoruleI7.json';
import LoruleJ8 from '../assets/tileMaps/LoruleJ8.json';
import LoruleE8 from '../assets/tileMaps/LoruleE8.json';
import LoruleF7 from '../assets/tileMaps/LoruleF7.json';
import LoruleG6 from '../assets/tileMaps/LoruleG6.json';
import LoruleH5 from '../assets/tileMaps/LoruleH5.json';
import LoruleI6 from '../assets/tileMaps/LoruleI6.json';
import LoruleJ7 from '../assets/tileMaps/LoruleJ7.json';
import LoruleK8 from '../assets/tileMaps/LoruleK8.json';

import backYard1 from '../assets/tileMaps/backYard1.json';
import arena1 from '../assets/tileMaps/arena1.json';

import EmptyCave from '../assets/tileMaps/EmptyCave.json';
import SlimeCave from '../assets/tileMaps/SlimeCave.json';
import CaveF8 from '../assets/tileMaps/CaveF8.json';

// NOTE: You must also add any new scenes to witchazzan-server/config/default-config.edn

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
import Dungeon_Tileset from '../assets/tileSets/Dungeon_Tileset.png';

const loruleUpperLeftFontSize = '.03';
const loruleScrollingFontSize = loruleUpperLeftFontSize;
const loruleGameSize = {
  width: 16 * 16,
  height: 16 * 11,
};
const loruleHtmlElementParameters = {
  Center: {
    fontSize: '.1', // percent of scene height.
    color: 'red',
  },
  UpperLeft: {
    fontSize: loruleUpperLeftFontSize, // percent of scene height.
    color: 'blue',
    background: '255,255,255,0.9', // rgba
  },
  Scrolling: {
    fontSize: loruleScrollingFontSize, // percent of scene height.
    color: '#d84b65',
    background: '255,255,255,0.9', // rgba
  },
};

const caveGameSize = {
  width: 16 * 18,
  height: 16 * 13,
};
const caveHtmlElementParameters = {
  Center: {
    fontSize: '.1', // percent of scene height.
    color: 'red',
  },
  UpperLeft: {
    fontSize: loruleUpperLeftFontSize, // percent of scene height.
    color: 'black',
    background: '255,255,255,0.8', // rgba
  },
  Scrolling: {
    fontSize: loruleScrollingFontSize, // percent of scene height.
    color: 'black',
    background: '255,255,255,0.8', // rgba
  },
};

const scenes = [
  {
    sceneName: 'LoruleH8',
    tileMap: LoruleH8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI8',
    tileMap: LoruleI8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH7',
    tileMap: LoruleH7,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG7',
    tileMap: LoruleG7,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG8',
    tileMap: LoruleG8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF8',
    tileMap: LoruleF8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH6',
    tileMap: LoruleH6,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI7',
    tileMap: LoruleI7,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ8',
    tileMap: LoruleJ8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE8',
    tileMap: LoruleE8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF7',
    tileMap: LoruleF7,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG6',
    tileMap: LoruleG6,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH5',
    tileMap: LoruleH5,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI6',
    tileMap: LoruleI6,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ7',
    tileMap: LoruleJ7,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK8',
    tileMap: LoruleK8,
    tileSet: tileset1bit16x16,
    tileSetName: 'tileset_1bit-16x16',
    gameSize: loruleGameSize,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'backYard1',
    tileMap: backYard1,
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
        fontSize: loruleUpperLeftFontSize, // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: loruleScrollingFontSize, // percent of scene height.
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
        fontSize: loruleUpperLeftFontSize, // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: loruleScrollingFontSize, // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
    },
  },
  {
    sceneName: 'EmptyCave',
    tileMap: EmptyCave,
    tileSet: Dungeon_Tileset,
    tileSetName: 'Dungeon_Tileset',
    gameSize: caveGameSize,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'SlimeCave',
    tileMap: SlimeCave,
    tileSet: Dungeon_Tileset,
    tileSetName: 'Dungeon_Tileset',
    gameSize: caveGameSize,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveF8',
    tileMap: CaveF8,
    tileSet: Dungeon_Tileset,
    tileSetName: 'Dungeon_Tileset',
    gameSize: caveGameSize,
    htmlElementParameters: caveHtmlElementParameters,
  },
];

// Code below here automatically generates all of the scenes from the lists above,
// which is used by the phaserConfigObject.js for the Phaser scene array.

const sceneList = [];
scenes.forEach((scene) => {
  sceneList.push(sceneFactory(scene));
});

export default sceneList;
