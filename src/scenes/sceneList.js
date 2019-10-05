/*
 * As the scene count increases, I expect the scene logic to become more
 * complex. This is where to start it.
 */
import sceneFactory from './sceneFactory';
import openingSceneTileMap from '../assets/openingScene';
import openingSceneRight1TileMap from '../assets/openingSceneRight1';

// To add a scene to the game:
// 1. Create a new Tilemap.
// 2. Save it to the assets folder.
// 3. Add the Tilemap name to the 'scenes' array
const scenes = [
  { name: 'openingScene', tileMap: openingSceneTileMap },
  { name: 'openingSceneRight1', tileMap: openingSceneRight1TileMap },
];

// Code below here automatically generates all of the scenes from the list above.

const sceneList = [];
scenes.forEach((scene) => {
  sceneList.push(
    sceneFactory({ sceneName: scene.name, tileMap: scene.tileMap }),
  );
});

export default sceneList;
