/*
 * This loads up all of the scenes.
 * It is literally just copy/paste of the import lines,
 * and scenes array with the names of the tile maps.
 *
 * To add a scene:
 * 1. Add an import line for it.
 * 2. Add an entry to the scenes array for it.
 */

// Camelopardalis Scenes
import CamelopardalisA1 from '../../assets/tileMaps/CamelopardalisA1.json';
import CamelopardalisA2 from '../../assets/tileMaps/CamelopardalisA2.json';
import CamelopardalisA3 from '../../assets/tileMaps/CamelopardalisA3.json';
import CamelopardalisA4 from '../../assets/tileMaps/CamelopardalisA4.json';
import CamelopardalisA5 from '../../assets/tileMaps/CamelopardalisA5.json';
import CamelopardalisA6 from '../../assets/tileMaps/CamelopardalisA6.json';
import CamelopardalisA7 from '../../assets/tileMaps/CamelopardalisA7.json';
import CamelopardalisA8 from '../../assets/tileMaps/CamelopardalisA8.json';
import CamelopardalisA9 from '../../assets/tileMaps/CamelopardalisA9.json';

import CamelopardalisB1 from '../../assets/tileMaps/CamelopardalisB1.json';
import CamelopardalisB2 from '../../assets/tileMaps/CamelopardalisB2.json';
import CamelopardalisB3 from '../../assets/tileMaps/CamelopardalisB3.json';
import CamelopardalisB4 from '../../assets/tileMaps/CamelopardalisB4.json';
import CamelopardalisB5 from '../../assets/tileMaps/CamelopardalisB5.json';
import CamelopardalisB6 from '../../assets/tileMaps/CamelopardalisB6.json';
import CamelopardalisB7 from '../../assets/tileMaps/CamelopardalisB7.json';
import CamelopardalisB8 from '../../assets/tileMaps/CamelopardalisB8.json';

import CamelopardalisC1 from '../../assets/tileMaps/CamelopardalisC1.json';
import CamelopardalisC2 from '../../assets/tileMaps/CamelopardalisC2.json';
import CamelopardalisC3 from '../../assets/tileMaps/CamelopardalisC3.json';
import CamelopardalisC4 from '../../assets/tileMaps/CamelopardalisC4.json';
import CamelopardalisC5 from '../../assets/tileMaps/CamelopardalisC5.json';
import CamelopardalisC6 from '../../assets/tileMaps/CamelopardalisC6.json';
import CamelopardalisC7 from '../../assets/tileMaps/CamelopardalisC7.json';
import CamelopardalisC8 from '../../assets/tileMaps/CamelopardalisC8.json';

import CamelopardalisD1 from '../../assets/tileMaps/CamelopardalisD1.json';
import CamelopardalisD2 from '../../assets/tileMaps/CamelopardalisD2.json';
import CamelopardalisD3 from '../../assets/tileMaps/CamelopardalisD3.json';
import CamelopardalisD4 from '../../assets/tileMaps/CamelopardalisD4.json';
import CamelopardalisD5 from '../../assets/tileMaps/CamelopardalisD5.json';
import CamelopardalisD6 from '../../assets/tileMaps/CamelopardalisD6.json';
import CamelopardalisD7 from '../../assets/tileMaps/CamelopardalisD7.json';
import CamelopardalisD8 from '../../assets/tileMaps/CamelopardalisD8.json';

import CamelopardalisE1 from '../../assets/tileMaps/CamelopardalisE1.json';
import CamelopardalisE2 from '../../assets/tileMaps/CamelopardalisE2.json';
import CamelopardalisE3 from '../../assets/tileMaps/CamelopardalisE3.json';
import CamelopardalisE4 from '../../assets/tileMaps/CamelopardalisE4.json';
import CamelopardalisE5 from '../../assets/tileMaps/CamelopardalisE5.json';
import CamelopardalisE6 from '../../assets/tileMaps/CamelopardalisE6.json';
import CamelopardalisE7 from '../../assets/tileMaps/CamelopardalisE7.json';
import CamelopardalisE8 from '../../assets/tileMaps/CamelopardalisE8.json';

import CamelopardalisF1 from '../../assets/tileMaps/CamelopardalisF1.json';
import CamelopardalisF2 from '../../assets/tileMaps/CamelopardalisF2.json';
import CamelopardalisF3 from '../../assets/tileMaps/CamelopardalisF3.json';
import CamelopardalisF4 from '../../assets/tileMaps/CamelopardalisF4.json';
import CamelopardalisF5 from '../../assets/tileMaps/CamelopardalisF5.json';
import CamelopardalisF6 from '../../assets/tileMaps/CamelopardalisF6.json';
import CamelopardalisF7 from '../../assets/tileMaps/CamelopardalisF7.json';
import CamelopardalisF8 from '../../assets/tileMaps/CamelopardalisF8.json';

import CamelopardalisG1 from '../../assets/tileMaps/CamelopardalisG1.json';
import CamelopardalisG2 from '../../assets/tileMaps/CamelopardalisG2.json';
import CamelopardalisG3 from '../../assets/tileMaps/CamelopardalisG3.json';
import CamelopardalisG4 from '../../assets/tileMaps/CamelopardalisG4.json';
import CamelopardalisG5 from '../../assets/tileMaps/CamelopardalisG5.json';
import CamelopardalisG6 from '../../assets/tileMaps/CamelopardalisG6.json';
import CamelopardalisG7 from '../../assets/tileMaps/CamelopardalisG7.json';
import CamelopardalisG8 from '../../assets/tileMaps/CamelopardalisG8.json';

import CamelopardalisH1 from '../../assets/tileMaps/CamelopardalisH1.json';
import CamelopardalisH2 from '../../assets/tileMaps/CamelopardalisH2.json';
import CamelopardalisH3 from '../../assets/tileMaps/CamelopardalisH3.json';
import CamelopardalisH4 from '../../assets/tileMaps/CamelopardalisH4.json';
import CamelopardalisH5 from '../../assets/tileMaps/CamelopardalisH5.json';
import CamelopardalisH6 from '../../assets/tileMaps/CamelopardalisH6.json';
import CamelopardalisH7 from '../../assets/tileMaps/CamelopardalisH7.json';
import CamelopardalisH8 from '../../assets/tileMaps/CamelopardalisH8.json';

import CamelopardalisI1 from '../../assets/tileMaps/CamelopardalisI1.json';
import CamelopardalisI2 from '../../assets/tileMaps/CamelopardalisI2.json';
import CamelopardalisI3 from '../../assets/tileMaps/CamelopardalisI3.json';
import CamelopardalisI4 from '../../assets/tileMaps/CamelopardalisI4.json';
import CamelopardalisI5 from '../../assets/tileMaps/CamelopardalisI5.json';
import CamelopardalisI6 from '../../assets/tileMaps/CamelopardalisI6.json';
import CamelopardalisI7 from '../../assets/tileMaps/CamelopardalisI7.json';
import CamelopardalisI8 from '../../assets/tileMaps/CamelopardalisI8.json';

import CamelopardalisJ1 from '../../assets/tileMaps/CamelopardalisJ1.json';
import CamelopardalisJ2 from '../../assets/tileMaps/CamelopardalisJ2.json';
import CamelopardalisJ3 from '../../assets/tileMaps/CamelopardalisJ3.json';
import CamelopardalisJ4 from '../../assets/tileMaps/CamelopardalisJ4.json';
import CamelopardalisJ5 from '../../assets/tileMaps/CamelopardalisJ5.json';
import CamelopardalisJ6 from '../../assets/tileMaps/CamelopardalisJ6.json';
import CamelopardalisJ7 from '../../assets/tileMaps/CamelopardalisJ7.json';
import CamelopardalisJ8 from '../../assets/tileMaps/CamelopardalisJ8.json';

import CamelopardalisK1 from '../../assets/tileMaps/CamelopardalisK1.json';
import CamelopardalisK2 from '../../assets/tileMaps/CamelopardalisK2.json';
import CamelopardalisK3 from '../../assets/tileMaps/CamelopardalisK3.json';
import CamelopardalisK4 from '../../assets/tileMaps/CamelopardalisK4.json';
import CamelopardalisK5 from '../../assets/tileMaps/CamelopardalisK5.json';
import CamelopardalisK6 from '../../assets/tileMaps/CamelopardalisK6.json';
import CamelopardalisK7 from '../../assets/tileMaps/CamelopardalisK7.json';
import CamelopardalisK8 from '../../assets/tileMaps/CamelopardalisK8.json';

import CamelopardalisL1 from '../../assets/tileMaps/CamelopardalisL1.json';
import CamelopardalisL2 from '../../assets/tileMaps/CamelopardalisL2.json';
import CamelopardalisL3 from '../../assets/tileMaps/CamelopardalisL3.json';
import CamelopardalisL4 from '../../assets/tileMaps/CamelopardalisL4.json';
import CamelopardalisL5 from '../../assets/tileMaps/CamelopardalisL5.json';
import CamelopardalisL6 from '../../assets/tileMaps/CamelopardalisL6.json';
import CamelopardalisL7 from '../../assets/tileMaps/CamelopardalisL7.json';
import CamelopardalisL8 from '../../assets/tileMaps/CamelopardalisL8.json';

import CamelopardalisM1 from '../../assets/tileMaps/CamelopardalisM1.json';
import CamelopardalisM2 from '../../assets/tileMaps/CamelopardalisM2.json';
import CamelopardalisM3 from '../../assets/tileMaps/CamelopardalisM3.json';
import CamelopardalisM4 from '../../assets/tileMaps/CamelopardalisM4.json';
import CamelopardalisM5 from '../../assets/tileMaps/CamelopardalisM5.json';
import CamelopardalisM6 from '../../assets/tileMaps/CamelopardalisM6.json';
import CamelopardalisM7 from '../../assets/tileMaps/CamelopardalisM7.json';
import CamelopardalisM8 from '../../assets/tileMaps/CamelopardalisM8.json';

import CamelopardalisN1 from '../../assets/tileMaps/CamelopardalisN1.json';
import CamelopardalisN2 from '../../assets/tileMaps/CamelopardalisN2.json';
import CamelopardalisN3 from '../../assets/tileMaps/CamelopardalisN3.json';
import CamelopardalisN4 from '../../assets/tileMaps/CamelopardalisN4.json';
import CamelopardalisN5 from '../../assets/tileMaps/CamelopardalisN5.json';
import CamelopardalisN6 from '../../assets/tileMaps/CamelopardalisN6.json';
import CamelopardalisN7 from '../../assets/tileMaps/CamelopardalisN7.json';
import CamelopardalisN8 from '../../assets/tileMaps/CamelopardalisN8.json';

import CamelopardalisO1 from '../../assets/tileMaps/CamelopardalisO1.json';
import CamelopardalisO2 from '../../assets/tileMaps/CamelopardalisO2.json';
import CamelopardalisO3 from '../../assets/tileMaps/CamelopardalisO3.json';
import CamelopardalisO4 from '../../assets/tileMaps/CamelopardalisO4.json';
import CamelopardalisO5 from '../../assets/tileMaps/CamelopardalisO5.json';
import CamelopardalisO6 from '../../assets/tileMaps/CamelopardalisO6.json';
import CamelopardalisO7 from '../../assets/tileMaps/CamelopardalisO7.json';
import CamelopardalisO8 from '../../assets/tileMaps/CamelopardalisO8.json';

import CamelopardalisP1 from '../../assets/tileMaps/CamelopardalisP1.json';
import CamelopardalisP2 from '../../assets/tileMaps/CamelopardalisP2.json';
import CamelopardalisP3 from '../../assets/tileMaps/CamelopardalisP3.json';
import CamelopardalisP4 from '../../assets/tileMaps/CamelopardalisP4.json';
import CamelopardalisP5 from '../../assets/tileMaps/CamelopardalisP5.json';
import CamelopardalisP6 from '../../assets/tileMaps/CamelopardalisP6.json';
import CamelopardalisP7 from '../../assets/tileMaps/CamelopardalisP7.json';
import CamelopardalisP8 from '../../assets/tileMaps/CamelopardalisP8.json';

import backYard1 from '../../assets/tileMaps/backYard1.json';
import arena1 from '../../assets/tileMaps/arena1.json';

import EmptyCave from '../../assets/tileMaps/EmptyCave.json';
import SlimeCave from '../../assets/tileMaps/SlimeCave.json';

import CaveA8 from '../../assets/tileMaps/CaveA8.json';
import CaveC3 from '../../assets/tileMaps/CaveC3.json';
import CaveE1 from '../../assets/tileMaps/CaveE1.json';
import CaveE5 from '../../assets/tileMaps/CaveE5.json';
import CaveE7 from '../../assets/tileMaps/CaveE7.json';
import CaveF3 from '../../assets/tileMaps/CaveF3.json';
import CaveK1 from '../../assets/tileMaps/CaveK1.json';
import CaveK5 from '../../assets/tileMaps/CaveK5.json';
import CaveM1 from '../../assets/tileMaps/CaveM1.json';
import CaveM4 from '../../assets/tileMaps/CaveM4.json';
import CaveO6 from '../../assets/tileMaps/CaveO6.json';
import CaveP2 from '../../assets/tileMaps/CaveP2.json';
import CaveP7 from '../../assets/tileMaps/CaveP7.json';

import Library from '../../assets/tileMaps/Library.json';

// NOTE: You must also add any new scenes to witchazzan-server/config/default-config.edn

// Tile Sets
import camelopardalisColor16x16 from '../../assets/tileSets/CamelopardalisColor16x16.png';
import tilesetZoriaOverworld from '../../assets/tileSets/zoria_overworld.png';
import dungeonTileset from '../../assets/tileSets/Dungeon_Tileset.png';
import roguelikeSheetTransparent from '../../assets/tileSets/roguelikeSheet_transparent.png';
import Loading from '../../assets/tileMaps/Loading.json';
import CaveL1 from '../../assets/tileMaps/CaveL1.json';
import gameLoopAndSceneFactory from './gameLoopAndSceneFactory.js';

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
  roguelikeSheetTransparent: {
    image: roguelikeSheetTransparent,
    name: 'roguelikeSheet_transparent',
  },
};

// Game Sizes
// In theory the "game" can be a different size than the scene,
// which is why this exists,
// but in practice this is not implemented and so far there is no plan to do so.
// Typically the size is just 2 less than the height and width,
// accounting for the "hidden" teleport tiles on the outside of every scene.
// TODO: If we are happy with always viewing the full scene, should this data just come from the tile map itself?
const gameSizes = {
  Loading: {
    width: 16 * 19,
    height: 16 * 11,
    teleportLayerSize: 0, // In pixels
  },
  CamelopardalisColor16x16: {
    width: 40 * 16, // In Pixels
    height: 32 * 11, // Tile pixel count * tile count
    teleportLayerSize: 16 * 2, // In pixels
  },
  cave: {
    width: 16 * 18,
    height: 16 * 13,
    teleportLayerSize: 16, // In pixels
  },
  arena: {
    width: 16 * 40,
    height: 16 * 22,
    teleportLayerSize: 16, // In pixels
  },
  backYard: {
    width: 16 * 19,
    height: 16 * 11,
    teleportLayerSize: 16, // In pixels
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
  Coordinates: {
    fontSize: '.04', // percent of scene height.
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
  Coordinates: {
    fontSize: '.04', // percent of scene height.
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

const camelopardalisColor16x16AnimatedTileOverlayStrategy = {
  'Stuff You Run Into': {
    76: {
      probability: 0.4,
      sprite: 'MountainWallSparkleOne',
    },
    82: {
      probability: 0.4,
      sprite: 'MountainWallSparkleOne',
    },
    93: {
      probability: 0.1,
      sprite: 'MountainWallSparkleTwo',
    },
    5: {
      probability: 0.1,
      sprite: 'SilverSparkleForTree',
    },
    //
  },
  'Stuff You Walk Under': {
    148: { probability: 0.08, sprite: 'SkullWink' },
  },
  Ground: {
    14: { probability: 0.2, sprite: 'GroundSparkleOne' },
    38: { probability: 0.2, sprite: 'GroundSparkleTwo' },
    110: { sprite: 'BlueWater' },
    111: { sprite: 'BlueWaterEastShore' },
    49: { sprite: 'BlackFlowingDown' },
  },
  Water: {
    110: { sprite: 'BlueWater' },
    98: { sprite: 'BlueWaterNorthShore' },
    97: { sprite: 'BlueWaterNorthWestShore' },
    99: { sprite: 'BlueWaterNorthEastShore' },
    121: { sprite: 'BlueWaterSouthWestShore' },
    123: { sprite: 'BlueWaterSouthEastShore' },
    100: { sprite: 'BlueWaterSouthEastShoreCorner' },
    101: { sprite: 'BlueWaterSouthWestShoreCorner' },
    109: { sprite: 'BlueWaterWestShore' },
    111: { sprite: 'BlueWaterEastShore' },
    85: { sprite: 'BlueWaterFlowingDown' },
    122: { sprite: 'BlueWaterSouthShore' },
    113: { sprite: 'BlueWaterNorthWestShoreCorner' },
  },
};

const libraryTileOverlayStrategy = {
  Ground: {
    286: { sprite: 'PurpleRunningRunes' },
  },
};

// Scenes
const scenes = [
  {
    sceneName: 'Loading',
    tileMap: Loading,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.Loading,
    htmlElementParameters: camelopardalisHtmlElementParameters,
  },
  {
    sceneName: 'CamelopardalisH8',
    tileMap: CamelopardalisH8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI8',
    tileMap: CamelopardalisI8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH7',
    tileMap: CamelopardalisH7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG7',
    tileMap: CamelopardalisG7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG8',
    tileMap: CamelopardalisG8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF8',
    tileMap: CamelopardalisF8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH6',
    tileMap: CamelopardalisH6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI7',
    tileMap: CamelopardalisI7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ8',
    tileMap: CamelopardalisJ8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE8',
    tileMap: CamelopardalisE8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF7',
    tileMap: CamelopardalisF7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG6',
    tileMap: CamelopardalisG6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH5',
    tileMap: CamelopardalisH5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI6',
    tileMap: CamelopardalisI6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ7',
    tileMap: CamelopardalisJ7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK8',
    tileMap: CamelopardalisK8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK7',
    tileMap: CamelopardalisK7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL8',
    tileMap: CamelopardalisL8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ6',
    tileMap: CamelopardalisJ6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI4',
    tileMap: CamelopardalisI4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI5',
    tileMap: CamelopardalisI5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH4',
    tileMap: CamelopardalisH4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG5',
    tileMap: CamelopardalisG5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF6',
    tileMap: CamelopardalisF6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE7',
    tileMap: CamelopardalisE7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD8',
    tileMap: CamelopardalisD8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD7',
    tileMap: CamelopardalisD7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL1',
    tileMap: CamelopardalisL1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL2',
    tileMap: CamelopardalisL2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM1',
    tileMap: CamelopardalisM1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM2',
    tileMap: CamelopardalisM2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM3',
    tileMap: CamelopardalisM3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN1',
    tileMap: CamelopardalisN1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN2',
    tileMap: CamelopardalisN2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN3',
    tileMap: CamelopardalisN3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN4',
    tileMap: CamelopardalisN4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO1',
    tileMap: CamelopardalisO1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO2',
    tileMap: CamelopardalisO2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO3',
    tileMap: CamelopardalisO3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO4',
    tileMap: CamelopardalisO4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO5',
    tileMap: CamelopardalisO5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP1',
    tileMap: CamelopardalisP1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP2',
    tileMap: CamelopardalisP2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP3',
    tileMap: CamelopardalisP3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP4',
    tileMap: CamelopardalisP4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP5',
    tileMap: CamelopardalisP5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP6',
    tileMap: CamelopardalisP6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP7',
    tileMap: CamelopardalisP7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO6',
    tileMap: CamelopardalisO6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN5',
    tileMap: CamelopardalisN5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM4',
    tileMap: CamelopardalisM4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL3',
    tileMap: CamelopardalisL3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ1',
    tileMap: CamelopardalisJ1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK1',
    tileMap: CamelopardalisK1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK2',
    tileMap: CamelopardalisK2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE1',
    tileMap: CamelopardalisE1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE2',
    tileMap: CamelopardalisE2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE3',
    tileMap: CamelopardalisE3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF1',
    tileMap: CamelopardalisF1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD1',
    tileMap: CamelopardalisD1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD2',
    tileMap: CamelopardalisD2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD3',
    tileMap: CamelopardalisD3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC1',
    tileMap: CamelopardalisC1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC2',
    tileMap: CamelopardalisC2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC3',
    tileMap: CamelopardalisC3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC4',
    tileMap: CamelopardalisC4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB1',
    tileMap: CamelopardalisB1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB2',
    tileMap: CamelopardalisB2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB3',
    tileMap: CamelopardalisB3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB4',
    tileMap: CamelopardalisB4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB5',
    tileMap: CamelopardalisB5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA1',
    tileMap: CamelopardalisA1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA2',
    tileMap: CamelopardalisA2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA3',
    tileMap: CamelopardalisA3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA4',
    tileMap: CamelopardalisA4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA5',
    tileMap: CamelopardalisA5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA6',
    tileMap: CamelopardalisA6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL4',
    tileMap: CamelopardalisL4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK3',
    tileMap: CamelopardalisK3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ2',
    tileMap: CamelopardalisJ2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI1',
    tileMap: CamelopardalisI1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF2',
    tileMap: CamelopardalisF2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD4',
    tileMap: CamelopardalisD4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC5',
    tileMap: CamelopardalisC5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB6',
    tileMap: CamelopardalisB6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA7',
    tileMap: CamelopardalisA7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM5',
    tileMap: CamelopardalisM5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN6',
    tileMap: CamelopardalisN6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO7',
    tileMap: CamelopardalisO7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisP8',
    tileMap: CamelopardalisP8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisO8',
    tileMap: CamelopardalisO8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN7',
    tileMap: CamelopardalisN7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM6',
    tileMap: CamelopardalisM6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL5',
    tileMap: CamelopardalisL5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK4',
    tileMap: CamelopardalisK4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ3',
    tileMap: CamelopardalisJ3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI2',
    tileMap: CamelopardalisI2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH1',
    tileMap: CamelopardalisH1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG1',
    tileMap: CamelopardalisG1,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG2',
    tileMap: CamelopardalisG2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF3',
    tileMap: CamelopardalisF3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE4',
    tileMap: CamelopardalisE4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD5',
    tileMap: CamelopardalisD5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC6',
    tileMap: CamelopardalisC6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB7',
    tileMap: CamelopardalisB7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA8',
    tileMap: CamelopardalisA8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisA9',
    tileMap: CamelopardalisA9,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisN8',
    tileMap: CamelopardalisN8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM7',
    tileMap: CamelopardalisM7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL6',
    tileMap: CamelopardalisL6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK5',
    tileMap: CamelopardalisK5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ4',
    tileMap: CamelopardalisJ4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH2',
    tileMap: CamelopardalisH2,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisI3',
    tileMap: CamelopardalisI3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG3',
    tileMap: CamelopardalisG3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF4',
    tileMap: CamelopardalisF4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE5',
    tileMap: CamelopardalisE5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisD6',
    tileMap: CamelopardalisD6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC7',
    tileMap: CamelopardalisC7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisB8',
    tileMap: CamelopardalisB8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisM8',
    tileMap: CamelopardalisM8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisL7',
    tileMap: CamelopardalisL7,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisK6',
    tileMap: CamelopardalisK6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisH3',
    tileMap: CamelopardalisH3,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisJ5',
    tileMap: CamelopardalisJ5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisG4',
    tileMap: CamelopardalisG4,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisF5',
    tileMap: CamelopardalisF5,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisE6',
    tileMap: CamelopardalisE6,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'CamelopardalisC8',
    tileMap: CamelopardalisC8,
    tileSet: tileSets.CamelopardalisColor16x16,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy:
      camelopardalisColor16x16AnimatedTileOverlayStrategy,
  },
  {
    sceneName: 'backYard1',
    tileMap: backYard1,
    tileSet: tileSets.ZoriaOverworld,
    gameSize: gameSizes.backYard,
    htmlElementParameters: camelopardalisHtmlElementParameters,
  },
  {
    sceneName: 'arena1',
    tileMap: arena1,
    tileSet: tileSets.ZoriaOverworld,
    gameSize: gameSizes.arena,
    htmlElementParameters: camelopardalisHtmlElementParameters,
  },
  {
    sceneName: 'EmptyCave',
    tileMap: EmptyCave,
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
  {
    sceneName: 'Library',
    tileMap: Library,
    tileSet: tileSets.roguelikeSheetTransparent,
    gameSize: gameSizes.CamelopardalisColor16x16,
    htmlElementParameters: camelopardalisHtmlElementParameters,
    animatedTileOverlayStrategy: libraryTileOverlayStrategy,
  },
];

// Code below here automatically generates all of the scenes from the lists above,
// which is used by the phaserConfigObject.js for the Phaser scene array.
const sceneList = [];
scenes.forEach((scene) => {
  sceneList.push(gameLoopAndSceneFactory(scene));
});

export default sceneList;
