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

// Camelopardalis Scenes
import CamelopardalisA1 from './assets/tileMaps/CamelopardalisA1.json';
import CamelopardalisA2 from './assets/tileMaps/CamelopardalisA2.json';
import CamelopardalisA3 from './assets/tileMaps/CamelopardalisA3.json';
import CamelopardalisA4 from './assets/tileMaps/CamelopardalisA4.json';
import CamelopardalisA5 from './assets/tileMaps/CamelopardalisA5.json';
import CamelopardalisA6 from './assets/tileMaps/CamelopardalisA6.json';
import CamelopardalisA7 from './assets/tileMaps/CamelopardalisA7.json';
import CamelopardalisA8 from './assets/tileMaps/CamelopardalisA8.json';
import CamelopardalisA9 from './assets/tileMaps/CamelopardalisA9.json';

import CamelopardalisB1 from './assets/tileMaps/CamelopardalisB1.json';
import CamelopardalisB2 from './assets/tileMaps/CamelopardalisB2.json';
import CamelopardalisB3 from './assets/tileMaps/CamelopardalisB3.json';
import CamelopardalisB4 from './assets/tileMaps/CamelopardalisB4.json';
import CamelopardalisB5 from './assets/tileMaps/CamelopardalisB5.json';
import CamelopardalisB6 from './assets/tileMaps/CamelopardalisB6.json';
import CamelopardalisB7 from './assets/tileMaps/CamelopardalisB7.json';
import CamelopardalisB8 from './assets/tileMaps/CamelopardalisB8.json';

import CamelopardalisC1 from './assets/tileMaps/CamelopardalisC1.json';
import CamelopardalisC2 from './assets/tileMaps/CamelopardalisC2.json';
import CamelopardalisC3 from './assets/tileMaps/CamelopardalisC3.json';
import CamelopardalisC4 from './assets/tileMaps/CamelopardalisC4.json';
import CamelopardalisC5 from './assets/tileMaps/CamelopardalisC5.json';
import CamelopardalisC6 from './assets/tileMaps/CamelopardalisC6.json';
import CamelopardalisC7 from './assets/tileMaps/CamelopardalisC7.json';
import CamelopardalisC8 from './assets/tileMaps/CamelopardalisC8.json';

import CamelopardalisD1 from './assets/tileMaps/CamelopardalisD1.json';
import CamelopardalisD2 from './assets/tileMaps/CamelopardalisD2.json';
import CamelopardalisD3 from './assets/tileMaps/CamelopardalisD3.json';
import CamelopardalisD4 from './assets/tileMaps/CamelopardalisD4.json';
import CamelopardalisD5 from './assets/tileMaps/CamelopardalisD5.json';
import CamelopardalisD6 from './assets/tileMaps/CamelopardalisD6.json';
import CamelopardalisD7 from './assets/tileMaps/CamelopardalisD7.json';
import CamelopardalisD8 from './assets/tileMaps/CamelopardalisD8.json';

import CamelopardalisE1 from './assets/tileMaps/CamelopardalisE1.json';
import CamelopardalisE2 from './assets/tileMaps/CamelopardalisE2.json';
import CamelopardalisE3 from './assets/tileMaps/CamelopardalisE3.json';
import CamelopardalisE4 from './assets/tileMaps/CamelopardalisE4.json';
import CamelopardalisE5 from './assets/tileMaps/CamelopardalisE5.json';
import CamelopardalisE6 from './assets/tileMaps/CamelopardalisE6.json';
import CamelopardalisE7 from './assets/tileMaps/CamelopardalisE7.json';
import CamelopardalisE8 from './assets/tileMaps/CamelopardalisE8.json';

import CamelopardalisF1 from './assets/tileMaps/CamelopardalisF1.json';
import CamelopardalisF2 from './assets/tileMaps/CamelopardalisF2.json';
import CamelopardalisF3 from './assets/tileMaps/CamelopardalisF3.json';
import CamelopardalisF4 from './assets/tileMaps/CamelopardalisF4.json';
import CamelopardalisF5 from './assets/tileMaps/CamelopardalisF5.json';
import CamelopardalisF6 from './assets/tileMaps/CamelopardalisF6.json';
import CamelopardalisF7 from './assets/tileMaps/CamelopardalisF7.json';
import CamelopardalisF8 from './assets/tileMaps/CamelopardalisF8.json';

import CamelopardalisG1 from './assets/tileMaps/CamelopardalisG1.json';
import CamelopardalisG2 from './assets/tileMaps/CamelopardalisG2.json';
import CamelopardalisG3 from './assets/tileMaps/CamelopardalisG3.json';
import CamelopardalisG4 from './assets/tileMaps/CamelopardalisG4.json';
import CamelopardalisG5 from './assets/tileMaps/CamelopardalisG5.json';
import CamelopardalisG6 from './assets/tileMaps/CamelopardalisG6.json';
import CamelopardalisG7 from './assets/tileMaps/CamelopardalisG7.json';
import CamelopardalisG8 from './assets/tileMaps/CamelopardalisG8.json';

import CamelopardalisH1 from './assets/tileMaps/CamelopardalisH1.json';
import CamelopardalisH2 from './assets/tileMaps/CamelopardalisH2.json';
import CamelopardalisH3 from './assets/tileMaps/CamelopardalisH3.json';
import CamelopardalisH4 from './assets/tileMaps/CamelopardalisH4.json';
import CamelopardalisH5 from './assets/tileMaps/CamelopardalisH5.json';
import CamelopardalisH6 from './assets/tileMaps/CamelopardalisH6.json';
import CamelopardalisH7 from './assets/tileMaps/CamelopardalisH7.json';
import CamelopardalisH8 from './assets/tileMaps/CamelopardalisH8.json';

import CamelopardalisI1 from './assets/tileMaps/CamelopardalisI1.json';
import CamelopardalisI2 from './assets/tileMaps/CamelopardalisI2.json';
import CamelopardalisI3 from './assets/tileMaps/CamelopardalisI3.json';
import CamelopardalisI4 from './assets/tileMaps/CamelopardalisI4.json';
import CamelopardalisI5 from './assets/tileMaps/CamelopardalisI5.json';
import CamelopardalisI6 from './assets/tileMaps/CamelopardalisI6.json';
import CamelopardalisI7 from './assets/tileMaps/CamelopardalisI7.json';
import CamelopardalisI8 from './assets/tileMaps/CamelopardalisI8.json';

import CamelopardalisJ1 from './assets/tileMaps/CamelopardalisJ1.json';
import CamelopardalisJ2 from './assets/tileMaps/CamelopardalisJ2.json';
import CamelopardalisJ3 from './assets/tileMaps/CamelopardalisJ3.json';
import CamelopardalisJ4 from './assets/tileMaps/CamelopardalisJ4.json';
import CamelopardalisJ5 from './assets/tileMaps/CamelopardalisJ5.json';
import CamelopardalisJ6 from './assets/tileMaps/CamelopardalisJ6.json';
import CamelopardalisJ7 from './assets/tileMaps/CamelopardalisJ7.json';
import CamelopardalisJ8 from './assets/tileMaps/CamelopardalisJ8.json';

import CamelopardalisK1 from './assets/tileMaps/CamelopardalisK1.json';
import CamelopardalisK2 from './assets/tileMaps/CamelopardalisK2.json';
import CamelopardalisK3 from './assets/tileMaps/CamelopardalisK3.json';
import CamelopardalisK4 from './assets/tileMaps/CamelopardalisK4.json';
import CamelopardalisK5 from './assets/tileMaps/CamelopardalisK5.json';
import CamelopardalisK6 from './assets/tileMaps/CamelopardalisK6.json';
import CamelopardalisK7 from './assets/tileMaps/CamelopardalisK7.json';
import CamelopardalisK8 from './assets/tileMaps/CamelopardalisK8.json';

import CamelopardalisL1 from './assets/tileMaps/CamelopardalisL1.json';
import CamelopardalisL2 from './assets/tileMaps/CamelopardalisL2.json';
import CamelopardalisL3 from './assets/tileMaps/CamelopardalisL3.json';
import CamelopardalisL4 from './assets/tileMaps/CamelopardalisL4.json';
import CamelopardalisL5 from './assets/tileMaps/CamelopardalisL5.json';
import CamelopardalisL6 from './assets/tileMaps/CamelopardalisL6.json';
import CamelopardalisL7 from './assets/tileMaps/CamelopardalisL7.json';
import CamelopardalisL8 from './assets/tileMaps/CamelopardalisL8.json';

import CamelopardalisM1 from './assets/tileMaps/CamelopardalisM1.json';
import CamelopardalisM2 from './assets/tileMaps/CamelopardalisM2.json';
import CamelopardalisM3 from './assets/tileMaps/CamelopardalisM3.json';
import CamelopardalisM4 from './assets/tileMaps/CamelopardalisM4.json';
import CamelopardalisM5 from './assets/tileMaps/CamelopardalisM5.json';
import CamelopardalisM6 from './assets/tileMaps/CamelopardalisM6.json';
import CamelopardalisM7 from './assets/tileMaps/CamelopardalisM7.json';
import CamelopardalisM8 from './assets/tileMaps/CamelopardalisM8.json';

import CamelopardalisN1 from './assets/tileMaps/CamelopardalisN1.json';
import CamelopardalisN2 from './assets/tileMaps/CamelopardalisN2.json';
import CamelopardalisN3 from './assets/tileMaps/CamelopardalisN3.json';
import CamelopardalisN4 from './assets/tileMaps/CamelopardalisN4.json';
import CamelopardalisN5 from './assets/tileMaps/CamelopardalisN5.json';
import CamelopardalisN6 from './assets/tileMaps/CamelopardalisN6.json';
import CamelopardalisN7 from './assets/tileMaps/CamelopardalisN7.json';
import CamelopardalisN8 from './assets/tileMaps/CamelopardalisN8.json';

import CamelopardalisO1 from './assets/tileMaps/CamelopardalisO1.json';
import CamelopardalisO2 from './assets/tileMaps/CamelopardalisO2.json';
import CamelopardalisO3 from './assets/tileMaps/CamelopardalisO3.json';
import CamelopardalisO4 from './assets/tileMaps/CamelopardalisO4.json';
import CamelopardalisO5 from './assets/tileMaps/CamelopardalisO5.json';
import CamelopardalisO6 from './assets/tileMaps/CamelopardalisO6.json';
import CamelopardalisO7 from './assets/tileMaps/CamelopardalisO7.json';
import CamelopardalisO8 from './assets/tileMaps/CamelopardalisO8.json';

import CamelopardalisP1 from './assets/tileMaps/CamelopardalisP1.json';
import CamelopardalisP2 from './assets/tileMaps/CamelopardalisP2.json';
import CamelopardalisP3 from './assets/tileMaps/CamelopardalisP3.json';
import CamelopardalisP4 from './assets/tileMaps/CamelopardalisP4.json';
import CamelopardalisP5 from './assets/tileMaps/CamelopardalisP5.json';
import CamelopardalisP6 from './assets/tileMaps/CamelopardalisP6.json';
import CamelopardalisP7 from './assets/tileMaps/CamelopardalisP7.json';
import CamelopardalisP8 from './assets/tileMaps/CamelopardalisP8.json';

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
import camelopardalisColor16x16 from './assets/tileSets/CamelopardalisColor16x16.png';
import tilesetZoriaOverworld from './assets/tileSets/zoria_overworld-extruded.png';
import dungeonTileset from './assets/tileSets/Dungeon_Tileset.png';

// Each entry consists of an image and a name.
// The name is used for tagging the imported tile set image,
// but it is also used by Phaser
// WARNING: Phaser requires that this name match the tilesets.name in the Tiled tile map!
const tileSets = {
  CamelopardalisColor16x16: {
    image: camelopardalisColor16x16,
    name: 'CamelopardalisColor16x16',
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
  CamelopardalisColor16x16: {
    width: 40 * 16, // In Pixels
    height: 32 * 11, // Tile pixel count * tile count
    teleportLayerWidth: 16 * 2, // In pixels
  },
  cave: {
    width: 16 * 18,
    height: 16 * 13,
    teleportLayerWidth: 16, // In pixels
  },
  arena: {
    width: 16 * 40,
    height: 16 * 22,
    teleportLayerWidth: 16, // In pixels
  },
  backYard: {
    width: 16 * 19,
    height: 16 * 11,
    teleportLayerWidth: 16, // In pixels
  },
};

// HTML Parameters
// TODO: Wrap up the htmlElementParameters options into an object too like gameSizes and tileSets.

const camelopardalisUpperLeftFontSize = '.03';
const camelopardalisScrollingFontSize = camelopardalisUpperLeftFontSize;

const camelopardalisHtmlElementParameters = {
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
    fontSize: camelopardalisUpperLeftFontSize, // percent of scene height.
    color: 'blue',
    background: '255,255,255,0.9', // rgba
  },
  Scrolling: {
    fontSize: camelopardalisScrollingFontSize, // percent of scene height.
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
    fontSize: camelopardalisUpperLeftFontSize, // percent of scene height.
    color: 'black',
    background: '255,255,255,0.8', // rgba
  },
  Scrolling: {
    fontSize: camelopardalisScrollingFontSize, // percent of scene height.
    color: 'black',
    background: '255,255,255,0.8', // rgba
  },
};

const camelopardalisColor16x16AnimatedTileReplacementStrategy = {
  'Stuff You Run Into': {
    probability: 0.4,
    76: 'GreenMountainWallSparkleOne',
    244: 'BrownMountainWallSparkleOne',
  },
  'Stuff You Walk Under': {
    probability: 0.08,
    363: 'SkullWink',
  },
  Ground: {
    probability: 0.2,
    163: 'GroundSparkleOne',
  },
  Water: {
    110: 'BlueWater',
    98: 'BlueWaterNorthShore',
    97: 'BlueWaterNorthWestShore',
    109: 'BlueWaterWestShore',
  },
};

// Scenes
const scenes = [
  {
    sceneName: 'CamelopardalisH8',
    tileMap: CamelopardalisH8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI8',
    tileMap: CamelopardalisI8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH7',
    tileMap: CamelopardalisH7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG7',
    tileMap: CamelopardalisG7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG8',
    tileMap: CamelopardalisG8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF8',
    tileMap: CamelopardalisF8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH6',
    tileMap: CamelopardalisH6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI7',
    tileMap: CamelopardalisI7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ8',
    tileMap: CamelopardalisJ8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE8',
    tileMap: CamelopardalisE8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF7',
    tileMap: CamelopardalisF7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG6',
    tileMap: CamelopardalisG6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH5',
    tileMap: CamelopardalisH5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI6',
    tileMap: CamelopardalisI6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ7',
    tileMap: CamelopardalisJ7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK8',
    tileMap: CamelopardalisK8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK7',
    tileMap: CamelopardalisK7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL8',
    tileMap: CamelopardalisL8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ6',
    tileMap: CamelopardalisJ6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI4',
    tileMap: CamelopardalisI4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI5',
    tileMap: CamelopardalisI5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH4',
    tileMap: CamelopardalisH4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG5',
    tileMap: CamelopardalisG5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF6',
    tileMap: CamelopardalisF6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE7',
    tileMap: CamelopardalisE7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD8',
    tileMap: CamelopardalisD8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD7',
    tileMap: CamelopardalisD7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL1',
    tileMap: CamelopardalisL1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL2',
    tileMap: CamelopardalisL2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM1',
    tileMap: CamelopardalisM1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM2',
    tileMap: CamelopardalisM2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM3',
    tileMap: CamelopardalisM3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN1',
    tileMap: CamelopardalisN1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN2',
    tileMap: CamelopardalisN2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN3',
    tileMap: CamelopardalisN3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN4',
    tileMap: CamelopardalisN4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO1',
    tileMap: CamelopardalisO1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO2',
    tileMap: CamelopardalisO2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO3',
    tileMap: CamelopardalisO3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO4',
    tileMap: CamelopardalisO4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO5',
    tileMap: CamelopardalisO5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP1',
    tileMap: CamelopardalisP1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP2',
    tileMap: CamelopardalisP2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP3',
    tileMap: CamelopardalisP3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP4',
    tileMap: CamelopardalisP4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP5',
    tileMap: CamelopardalisP5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP6',
    tileMap: CamelopardalisP6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP7',
    tileMap: CamelopardalisP7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO6',
    tileMap: CamelopardalisO6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN5',
    tileMap: CamelopardalisN5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM4',
    tileMap: CamelopardalisM4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL3',
    tileMap: CamelopardalisL3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ1',
    tileMap: CamelopardalisJ1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK1',
    tileMap: CamelopardalisK1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK2',
    tileMap: CamelopardalisK2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE1',
    tileMap: CamelopardalisE1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE2',
    tileMap: CamelopardalisE2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE3',
    tileMap: CamelopardalisE3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF1',
    tileMap: CamelopardalisF1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD1',
    tileMap: CamelopardalisD1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD2',
    tileMap: CamelopardalisD2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD3',
    tileMap: CamelopardalisD3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC1',
    tileMap: CamelopardalisC1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC2',
    tileMap: CamelopardalisC2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC3',
    tileMap: CamelopardalisC3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC4',
    tileMap: CamelopardalisC4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB1',
    tileMap: CamelopardalisB1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB2',
    tileMap: CamelopardalisB2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB3',
    tileMap: CamelopardalisB3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB4',
    tileMap: CamelopardalisB4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB5',
    tileMap: CamelopardalisB5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA1',
    tileMap: CamelopardalisA1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA2',
    tileMap: CamelopardalisA2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA3',
    tileMap: CamelopardalisA3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA4',
    tileMap: CamelopardalisA4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA5',
    tileMap: CamelopardalisA5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA6',
    tileMap: CamelopardalisA6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL4',
    tileMap: CamelopardalisL4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK3',
    tileMap: CamelopardalisK3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ2',
    tileMap: CamelopardalisJ2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI1',
    tileMap: CamelopardalisI1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF2',
    tileMap: CamelopardalisF2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD4',
    tileMap: CamelopardalisD4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC5',
    tileMap: CamelopardalisC5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB6',
    tileMap: CamelopardalisB6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA7',
    tileMap: CamelopardalisA7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM5',
    tileMap: CamelopardalisM5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN6',
    tileMap: CamelopardalisN6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO7',
    tileMap: CamelopardalisO7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisP8',
    tileMap: CamelopardalisP8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisO8',
    tileMap: CamelopardalisO8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN7',
    tileMap: CamelopardalisN7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM6',
    tileMap: CamelopardalisM6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL5',
    tileMap: CamelopardalisL5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK4',
    tileMap: CamelopardalisK4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ3',
    tileMap: CamelopardalisJ3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI2',
    tileMap: CamelopardalisI2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH1',
    tileMap: CamelopardalisH1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG1',
    tileMap: CamelopardalisG1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG2',
    tileMap: CamelopardalisG2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF3',
    tileMap: CamelopardalisF3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE4',
    tileMap: CamelopardalisE4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD5',
    tileMap: CamelopardalisD5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC6',
    tileMap: CamelopardalisC6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB7',
    tileMap: CamelopardalisB7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA8',
    tileMap: CamelopardalisA8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisA9',
    tileMap: CamelopardalisA9,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisN8',
    tileMap: CamelopardalisN8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM7',
    tileMap: CamelopardalisM7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL6',
    tileMap: CamelopardalisL6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK5',
    tileMap: CamelopardalisK5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ4',
    tileMap: CamelopardalisJ4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH2',
    tileMap: CamelopardalisH2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisI3',
    tileMap: CamelopardalisI3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG3',
    tileMap: CamelopardalisG3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF4',
    tileMap: CamelopardalisF4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE5',
    tileMap: CamelopardalisE5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisD6',
    tileMap: CamelopardalisD6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC7',
    tileMap: CamelopardalisC7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisB8',
    tileMap: CamelopardalisB8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisM8',
    tileMap: CamelopardalisM8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisL7',
    tileMap: CamelopardalisL7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisK6',
    tileMap: CamelopardalisK6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisH3',
    tileMap: CamelopardalisH3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisJ5',
    tileMap: CamelopardalisJ5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisG4',
    tileMap: CamelopardalisG4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisF5',
    tileMap: CamelopardalisF5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisE6',
    tileMap: CamelopardalisE6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'CamelopardalisC8',
    tileMap: CamelopardalisC8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileReplacementStrategy:
      camelopardalisColor16x16AnimatedTileReplacementStrategy,
  },
  {
    sceneName: 'backYard1',
    tileMap: backYard1,
    tileSet: tileSets.ZoriaOverworld,
    gameSize: gameSizes.backYard,
    htmlElementParameters: {
      Center: {
        fontSize: '.1', // percent of scene height.
        color: 'red',
      },
      UpperLeft: {
        fontSize: camelopardalisUpperLeftFontSize, // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: camelopardalisScrollingFontSize, // percent of scene height.
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
        fontSize: camelopardalisUpperLeftFontSize, // percent of scene height.
        color: 'black',
        background: '255,255,255,0.8', // rgba
      },
      Scrolling: {
        fontSize: camelopardalisScrollingFontSize, // percent of scene height.
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
