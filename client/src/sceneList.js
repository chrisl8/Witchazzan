/*
 * This loads up all of the scenes.
 * It is literally just copy/paste of the import lines,
 * and scenes array with the names of the tile maps.
 *
 * TODO: Write a script to generate this file based on the names
 *  of the files in the tile map folder,
 *  which would run before the Parcel build.
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
import gameLoopAndSceneFactory from './gameLoopAndSceneFactory.js';

// Lorule Scenes
import LoruleA1 from './assets/tileMaps/LoruleA1.json';
import LoruleA2 from './assets/tileMaps/LoruleA2.json';
import LoruleA3 from './assets/tileMaps/LoruleA3.json';
import LoruleA4 from './assets/tileMaps/LoruleA4.json';
import LoruleA5 from './assets/tileMaps/LoruleA5.json';
import LoruleA6 from './assets/tileMaps/LoruleA6.json';
import LoruleA7 from './assets/tileMaps/LoruleA7.json';
import LoruleA8 from './assets/tileMaps/LoruleA8.json';
import LoruleA9 from './assets/tileMaps/LoruleA9.json';

import LoruleB1 from './assets/tileMaps/LoruleB1.json';
import LoruleB2 from './assets/tileMaps/LoruleB2.json';
import LoruleB3 from './assets/tileMaps/LoruleB3.json';
import LoruleB4 from './assets/tileMaps/LoruleB4.json';
import LoruleB5 from './assets/tileMaps/LoruleB5.json';
import LoruleB6 from './assets/tileMaps/LoruleB6.json';
import LoruleB7 from './assets/tileMaps/LoruleB7.json';
import LoruleB8 from './assets/tileMaps/LoruleB8.json';

import LoruleC1 from './assets/tileMaps/LoruleC1.json';
import LoruleC2 from './assets/tileMaps/LoruleC2.json';
import LoruleC3 from './assets/tileMaps/LoruleC3.json';
import LoruleC4 from './assets/tileMaps/LoruleC4.json';
import LoruleC5 from './assets/tileMaps/LoruleC5.json';
import LoruleC6 from './assets/tileMaps/LoruleC6.json';
import LoruleC7 from './assets/tileMaps/LoruleC7.json';
import LoruleC8 from './assets/tileMaps/LoruleC8.json';

import LoruleD1 from './assets/tileMaps/LoruleD1.json';
import LoruleD2 from './assets/tileMaps/LoruleD2.json';
import LoruleD3 from './assets/tileMaps/LoruleD3.json';
import LoruleD4 from './assets/tileMaps/LoruleD4.json';
import LoruleD5 from './assets/tileMaps/LoruleD5.json';
import LoruleD6 from './assets/tileMaps/LoruleD6.json';
import LoruleD7 from './assets/tileMaps/LoruleD7.json';
import LoruleD8 from './assets/tileMaps/LoruleD8.json';

import LoruleE1 from './assets/tileMaps/LoruleE1.json';
import LoruleE2 from './assets/tileMaps/LoruleE2.json';
import LoruleE3 from './assets/tileMaps/LoruleE3.json';
import LoruleE4 from './assets/tileMaps/LoruleE4.json';
import LoruleE5 from './assets/tileMaps/LoruleE5.json';
import LoruleE6 from './assets/tileMaps/LoruleE6.json';
import LoruleE7 from './assets/tileMaps/LoruleE7.json';
import LoruleE8 from './assets/tileMaps/LoruleE8.json';

import LoruleF1 from './assets/tileMaps/LoruleF1.json';
import LoruleF2 from './assets/tileMaps/LoruleF2.json';
import LoruleF3 from './assets/tileMaps/LoruleF3.json';
import LoruleF4 from './assets/tileMaps/LoruleF4.json';
import LoruleF5 from './assets/tileMaps/LoruleF5.json';
import LoruleF6 from './assets/tileMaps/LoruleF6.json';
import LoruleF7 from './assets/tileMaps/LoruleF7.json';
import LoruleF8 from './assets/tileMaps/LoruleF8.json';

import LoruleG1 from './assets/tileMaps/LoruleG1.json';
import LoruleG2 from './assets/tileMaps/LoruleG2.json';
import LoruleG3 from './assets/tileMaps/LoruleG3.json';
import LoruleG4 from './assets/tileMaps/LoruleG4.json';
import LoruleG5 from './assets/tileMaps/LoruleG5.json';
import LoruleG6 from './assets/tileMaps/LoruleG6.json';
import LoruleG7 from './assets/tileMaps/LoruleG7.json';
import LoruleG8 from './assets/tileMaps/LoruleG8.json';

import LoruleH1 from './assets/tileMaps/LoruleH1.json';
import LoruleH2 from './assets/tileMaps/LoruleH2.json';
import LoruleH3 from './assets/tileMaps/LoruleH3.json';
import LoruleH4 from './assets/tileMaps/LoruleH4.json';
import LoruleH5 from './assets/tileMaps/LoruleH5.json';
import LoruleH6 from './assets/tileMaps/LoruleH6.json';
import LoruleH7 from './assets/tileMaps/LoruleH7.json';
import LoruleH8 from './assets/tileMaps/LoruleH8.json';

import LoruleI1 from './assets/tileMaps/LoruleI1.json';
import LoruleI2 from './assets/tileMaps/LoruleI2.json';
import LoruleI3 from './assets/tileMaps/LoruleI3.json';
import LoruleI4 from './assets/tileMaps/LoruleI4.json';
import LoruleI5 from './assets/tileMaps/LoruleI5.json';
import LoruleI6 from './assets/tileMaps/LoruleI6.json';
import LoruleI7 from './assets/tileMaps/LoruleI7.json';
import LoruleI8 from './assets/tileMaps/LoruleI8.json';

import LoruleJ1 from './assets/tileMaps/LoruleJ1.json';
import LoruleJ2 from './assets/tileMaps/LoruleJ2.json';
import LoruleJ3 from './assets/tileMaps/LoruleJ3.json';
import LoruleJ4 from './assets/tileMaps/LoruleJ4.json';
import LoruleJ5 from './assets/tileMaps/LoruleJ5.json';
import LoruleJ6 from './assets/tileMaps/LoruleJ6.json';
import LoruleJ7 from './assets/tileMaps/LoruleJ7.json';
import LoruleJ8 from './assets/tileMaps/LoruleJ8.json';

import LoruleK1 from './assets/tileMaps/LoruleK1.json';
import LoruleK2 from './assets/tileMaps/LoruleK2.json';
import LoruleK3 from './assets/tileMaps/LoruleK3.json';
import LoruleK4 from './assets/tileMaps/LoruleK4.json';
import LoruleK5 from './assets/tileMaps/LoruleK5.json';
import LoruleK6 from './assets/tileMaps/LoruleK6.json';
import LoruleK7 from './assets/tileMaps/LoruleK7.json';
import LoruleK8 from './assets/tileMaps/LoruleK8.json';

import LoruleL1 from './assets/tileMaps/LoruleL1.json';
import LoruleL2 from './assets/tileMaps/LoruleL2.json';
import LoruleL3 from './assets/tileMaps/LoruleL3.json';
import LoruleL4 from './assets/tileMaps/LoruleL4.json';
import LoruleL5 from './assets/tileMaps/LoruleL5.json';
import LoruleL6 from './assets/tileMaps/LoruleL6.json';
import LoruleL7 from './assets/tileMaps/LoruleL7.json';
import LoruleL8 from './assets/tileMaps/LoruleL8.json';

import LoruleM1 from './assets/tileMaps/LoruleM1.json';
import LoruleM2 from './assets/tileMaps/LoruleM2.json';
import LoruleM3 from './assets/tileMaps/LoruleM3.json';
import LoruleM4 from './assets/tileMaps/LoruleM4.json';
import LoruleM5 from './assets/tileMaps/LoruleM5.json';
import LoruleM6 from './assets/tileMaps/LoruleM6.json';
import LoruleM7 from './assets/tileMaps/LoruleM7.json';
import LoruleM8 from './assets/tileMaps/LoruleM8.json';

import LoruleN1 from './assets/tileMaps/LoruleN1.json';
import LoruleN2 from './assets/tileMaps/LoruleN2.json';
import LoruleN3 from './assets/tileMaps/LoruleN3.json';
import LoruleN4 from './assets/tileMaps/LoruleN4.json';
import LoruleN5 from './assets/tileMaps/LoruleN5.json';
import LoruleN6 from './assets/tileMaps/LoruleN6.json';
import LoruleN7 from './assets/tileMaps/LoruleN7.json';
import LoruleN8 from './assets/tileMaps/LoruleN8.json';

import LoruleO1 from './assets/tileMaps/LoruleO1.json';
import LoruleO2 from './assets/tileMaps/LoruleO2.json';
import LoruleO3 from './assets/tileMaps/LoruleO3.json';
import LoruleO4 from './assets/tileMaps/LoruleO4.json';
import LoruleO5 from './assets/tileMaps/LoruleO5.json';
import LoruleO6 from './assets/tileMaps/LoruleO6.json';
import LoruleO7 from './assets/tileMaps/LoruleO7.json';
import LoruleO8 from './assets/tileMaps/LoruleO8.json';

import LoruleP1 from './assets/tileMaps/LoruleP1.json';
import LoruleP2 from './assets/tileMaps/LoruleP2.json';
import LoruleP3 from './assets/tileMaps/LoruleP3.json';
import LoruleP4 from './assets/tileMaps/LoruleP4.json';
import LoruleP5 from './assets/tileMaps/LoruleP5.json';
import LoruleP6 from './assets/tileMaps/LoruleP6.json';
import LoruleP7 from './assets/tileMaps/LoruleP7.json';
import LoruleP8 from './assets/tileMaps/LoruleP8.json';

import backYard1 from './assets/tileMaps/backYard1.json';
import arena1 from './assets/tileMaps/arena1.json';

import EmptyCave from './assets/tileMaps/EmptyCave.json';
import SlimeCave from './assets/tileMaps/SlimeCave.json';
import EmptySpace from './assets/tileMaps/EmptySpace.json';

import CaveA8 from './assets/tileMaps/CaveA8.json';
import CaveC3 from './assets/tileMaps/CaveC3.json';
import CaveE1 from './assets/tileMaps/CaveE1.json';
import CaveE5 from './assets/tileMaps/CaveE5.json';
import CaveE7 from './assets/tileMaps/CaveE7.json';
import CaveF3 from './assets/tileMaps/CaveF3.json';
import CaveK1 from './assets/tileMaps/CaveK1.json';
import CaveK5 from './assets/tileMaps/CaveK5.json';
import CaveL1 from './assets/tileMaps/CaveL1.json';
import CaveM1 from './assets/tileMaps/CaveM1.json';
import CaveM4 from './assets/tileMaps/CaveM4.json';
import CaveO6 from './assets/tileMaps/CaveO6.json';
import CaveP2 from './assets/tileMaps/CaveP2.json';
import CaveP7 from './assets/tileMaps/CaveP7.json';

// NOTE: You must also add any new scenes to witchazzan-server/config/default-config.edn

/*
  To "FIX" tile sets so they don't have weird lines around them caused by GPU rendering
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

// Tile Sets
import tileset1bit16x16 from './assets/tileSets/tileset_1bit-16x16-extruded.png';
import tilesetZoriaOverworld from './assets/tileSets/zoria_overworld-extruded.png';
import dungeonTileset from './assets/tileSets/Dungeon_Tileset.png';

// Each entry consists of an image and a name.
// The name is used for tagging the imported tile set image,
// but it is also used by Phaser
// WARNING: Phaser requires that this name match the tilesets.name in the Tiled tile map!
const tileSets = {
  OneBit16x16: {
    image: tileset1bit16x16, // Image file from above.
    name: 'tileset_1bit-16x16', // Must match the name used in the tile map itself!
  },
  dungeonTileset: { image: dungeonTileset, name: 'Dungeon_Tileset' },
  ZoriaOverworld: { image: tilesetZoriaOverworld, name: 'Zoria Overworld' },
};

// Game Sizes
// In theory the "game" can be a different size than the scene,
// which is why this exists,
// but in practice this is not implemented and so far there is no plan to do so.
// Typically the size is just 2 less than the height and width,
// accounting for the "hidden" teleport tiles on the outside of every scene.
// TODO: If we are happy with always viewing the full scene, should this data just come from the tile map itself?
const gameSizes = {
  lorule: {
    width: 16 * 16, // In Pixels
    height: 16 * 11, // Tile pixel count * tile count
  },
  // 19/11 is the closest to 16:9 that I can get with tiles.
  loruleWide: {
    width: 16 * 19,
    height: 16 * 11,
  },
  cave: {
    width: 16 * 18,
    height: 16 * 13,
  },
  arena: {
    width: 16 * 40,
    height: 16 * 22,
  },
};

// HTML Parameters
// TODO: Wrap up the htmlElementParameters options into an object too like gameSizes and tileSets.

const loruleUpperLeftFontSize = '.03';
const loruleScrollingFontSize = loruleUpperLeftFontSize;

const loruleHtmlElementParameters = {
  Center: {
    fontSize: '.1', // percent of scene height.
    color: '#5a8ab7',
    background: '255,255,255,0.9', // rgba
  },
  Fading: {
    fontSize: '.05', // percent of scene height.
    color: '#981c9e',
    background: '255,255,255,0.9', // rgba
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

const caveHtmlElementParameters = {
  Center: {
    fontSize: '.1', // percent of scene height.
    color: 'red',
  },
  Fading: {
    fontSize: '.05', // percent of scene height.
    color: '#981c9e',
    background: '255,255,255,0.9', // rgba
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

// Scenes
const scenes = [
  {
    sceneName: 'LoruleH8',
    tileMap: LoruleH8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.loruleWide,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI8',
    tileMap: LoruleI8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.loruleWide,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH7',
    tileMap: LoruleH7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG7',
    tileMap: LoruleG7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG8',
    tileMap: LoruleG8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF8',
    tileMap: LoruleF8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH6',
    tileMap: LoruleH6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI7',
    tileMap: LoruleI7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ8',
    tileMap: LoruleJ8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE8',
    tileMap: LoruleE8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF7',
    tileMap: LoruleF7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG6',
    tileMap: LoruleG6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH5',
    tileMap: LoruleH5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI6',
    tileMap: LoruleI6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ7',
    tileMap: LoruleJ7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK8',
    tileMap: LoruleK8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK7',
    tileMap: LoruleK7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL8',
    tileMap: LoruleL8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ6',
    tileMap: LoruleJ6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI4',
    tileMap: LoruleI4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI5',
    tileMap: LoruleI5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH4',
    tileMap: LoruleH4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG5',
    tileMap: LoruleG5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF6',
    tileMap: LoruleF6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE7',
    tileMap: LoruleE7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD8',
    tileMap: LoruleD8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD7',
    tileMap: LoruleD7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL1',
    tileMap: LoruleL1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL2',
    tileMap: LoruleL2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM1',
    tileMap: LoruleM1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM2',
    tileMap: LoruleM2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM3',
    tileMap: LoruleM3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN1',
    tileMap: LoruleN1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN2',
    tileMap: LoruleN2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN3',
    tileMap: LoruleN3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN4',
    tileMap: LoruleN4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO1',
    tileMap: LoruleO1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO2',
    tileMap: LoruleO2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO3',
    tileMap: LoruleO3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO4',
    tileMap: LoruleO4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO5',
    tileMap: LoruleO5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP1',
    tileMap: LoruleP1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP2',
    tileMap: LoruleP2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP3',
    tileMap: LoruleP3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP4',
    tileMap: LoruleP4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP5',
    tileMap: LoruleP5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP6',
    tileMap: LoruleP6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP7',
    tileMap: LoruleP7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO6',
    tileMap: LoruleO6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN5',
    tileMap: LoruleN5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM4',
    tileMap: LoruleM4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL3',
    tileMap: LoruleL3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ1',
    tileMap: LoruleJ1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK1',
    tileMap: LoruleK1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK2',
    tileMap: LoruleK2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE1',
    tileMap: LoruleE1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE2',
    tileMap: LoruleE2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE3',
    tileMap: LoruleE3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF1',
    tileMap: LoruleF1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD1',
    tileMap: LoruleD1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD2',
    tileMap: LoruleD2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD3',
    tileMap: LoruleD3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC1',
    tileMap: LoruleC1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC2',
    tileMap: LoruleC2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC3',
    tileMap: LoruleC3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC4',
    tileMap: LoruleC4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB1',
    tileMap: LoruleB1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB2',
    tileMap: LoruleB2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB3',
    tileMap: LoruleB3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB4',
    tileMap: LoruleB4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB5',
    tileMap: LoruleB5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA1',
    tileMap: LoruleA1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA2',
    tileMap: LoruleA2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA3',
    tileMap: LoruleA3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA4',
    tileMap: LoruleA4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA5',
    tileMap: LoruleA5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA6',
    tileMap: LoruleA6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL4',
    tileMap: LoruleL4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK3',
    tileMap: LoruleK3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ2',
    tileMap: LoruleJ2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI1',
    tileMap: LoruleI1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF2',
    tileMap: LoruleF2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD4',
    tileMap: LoruleD4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC5',
    tileMap: LoruleC5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB6',
    tileMap: LoruleB6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA7',
    tileMap: LoruleA7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM5',
    tileMap: LoruleM5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN6',
    tileMap: LoruleN6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO7',
    tileMap: LoruleO7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleP8',
    tileMap: LoruleP8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleO8',
    tileMap: LoruleO8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN7',
    tileMap: LoruleN7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM6',
    tileMap: LoruleM6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL5',
    tileMap: LoruleL5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK4',
    tileMap: LoruleK4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ3',
    tileMap: LoruleJ3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI2',
    tileMap: LoruleI2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH1',
    tileMap: LoruleH1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG1',
    tileMap: LoruleG1,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG2',
    tileMap: LoruleG2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF3',
    tileMap: LoruleF3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE4',
    tileMap: LoruleE4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD5',
    tileMap: LoruleD5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC6',
    tileMap: LoruleC6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB7',
    tileMap: LoruleB7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA8',
    tileMap: LoruleA8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleA9',
    tileMap: LoruleA9,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleN8',
    tileMap: LoruleN8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM7',
    tileMap: LoruleM7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL6',
    tileMap: LoruleL6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK5',
    tileMap: LoruleK5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ4',
    tileMap: LoruleJ4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH2',
    tileMap: LoruleH2,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleI3',
    tileMap: LoruleI3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG3',
    tileMap: LoruleG3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF4',
    tileMap: LoruleF4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE5',
    tileMap: LoruleE5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleD6',
    tileMap: LoruleD6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC7',
    tileMap: LoruleC7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleB8',
    tileMap: LoruleB8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleM8',
    tileMap: LoruleM8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleL7',
    tileMap: LoruleL7,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleK6',
    tileMap: LoruleK6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleH3',
    tileMap: LoruleH3,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleJ5',
    tileMap: LoruleJ5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleG4',
    tileMap: LoruleG4,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleF5',
    tileMap: LoruleF5,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleE6',
    tileMap: LoruleE6,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'LoruleC8',
    tileMap: LoruleC8,
    tileSet: tileSets.OneBit16x16,
    gameSize: gameSizes.lorule,
    htmlElementParameters: loruleHtmlElementParameters,
  },
  {
    sceneName: 'backYard1',
    tileMap: backYard1,
    tileSet: tileSets.ZoriaOverworld,
    gameSize: gameSizes.loruleWide,
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
    tileSet: tileSets.ZoriaOverworld,
    gameSize: gameSizes.arena,
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
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'EmptySpace',
    tileMap: EmptySpace,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'SlimeCave',
    tileMap: SlimeCave,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveA8',
    tileMap: CaveA8,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveC3',
    tileMap: CaveC3,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveF3',
    tileMap: CaveF3,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveE1',
    tileMap: CaveE1,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveE5',
    tileMap: CaveE5,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveE7',
    tileMap: CaveE7,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveK1',
    tileMap: CaveK1,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveK5',
    tileMap: CaveK5,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveL1',
    tileMap: CaveL1,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveM1',
    tileMap: CaveM1,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveP2',
    tileMap: CaveP2,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveP7',
    tileMap: CaveP7,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveO6',
    tileMap: CaveO6,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
  {
    sceneName: 'CaveM4',
    tileMap: CaveM4,
    tileSet: tileSets.dungeonTileset,
    gameSize: gameSizes.cave,
    htmlElementParameters: caveHtmlElementParameters,
  },
];

// Code below here automatically generates all of the scenes from the lists above,
// which is used by the phaserConfigObject.js for the Phaser scene array.
const sceneList = [];
scenes.forEach((scene) => {
  sceneList.push(gameLoopAndSceneFactory(scene));
});

export default sceneList;
