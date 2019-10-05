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
 */
import sceneFactory from './sceneFactory';
import openingSceneTileMap from '../assets/tileMaps/openingScene';
import openingSceneRight1TileMap from '../assets/tileMaps/openingSceneRight1';

const scenes = [
  { name: 'openingScene', tileMap: openingSceneTileMap },
  { name: 'openingSceneRight1', tileMap: openingSceneRight1TileMap },
];

// Code below here automatically generates all of the scenes from the lists above,
// which is used by the rootGameObjects.js for the Phaser scene array.

const sceneList = [];
scenes.forEach((scene) => {
  sceneList.push(
    sceneFactory({ sceneName: scene.name, tileMap: scene.tileMap }),
  );
});

export default sceneList;
