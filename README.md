[![Build Status](https://travis-ci.com/chrisl8/witchazzan-client.svg)](https://travis-ci.com/chrisl8/witchazzan-client)

# Witchazzan - A Game!

This is the start of a game that [doby162](https://github.com/doby162) and [chrisl8](https://github.com/chrisl8) are building.  

The game exists in two parts:  
1. This is the Phaser 3 based web front end.  
2. [A Clojure based server](https://github.com/doby162/witchazzan-server)

Both parts are required for the game to function.

We started with the [Phaser 3 Webpack Project Template](https://github.com/photonstorm/phaser3-project-template).

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.


After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Customizing The Phaser Build Environment

### Babel
You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

  ```
  "browsers": [
    ">0.25%",
    "not ie 11",
    "not op_mini all"
  ]
  ```

### Webpack
If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code
After you run the `npm run build` command, your code will be built into a single bundle located at 
`dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), 
you should be able to open `http://mycoolserver.com/index.html` and play your game.

## Code Standards

I am using [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/). The configurations for both are in the code.  
Don't worry about it if you don't want to run them, I will not reject any pull requests based on formatting, but if you want to "fit in" run your code through Prettier and Eslint first.  
They are [easy to set up](https://imgs.xkcd.com/comics/will_it_work.png), and your IDE and VIM should both support them easily.

## Editing Tile Maps

### Install and use Tiled

Install via [itch.io](https://thorbjorn.itch.io/tiled)  

From [Building a Map in Tiled](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)  
When working with Tiled to generate maps for Phaser, there are a few things you’ll want to make sure to do:  
1. When you load a tileset into your map, make sure to check the “Embed in map” option. (If you forget to do this, then you can click the embed tileset button the bottom of the screen.)  
2. Make sure you aren’t using a compressed “Tile Layer Format.” You can adjust that in map properties sidebar… which you can open by hitting “Map → Map Properties” in the top toolbar.  
3. When you export your map, save it as a JSON file.

#### Please use an existing Tilemap as an example

### New Tiled Map Settings
- Orientation: Orthogonal
- Tiled Layer Format: CSV
- Tile Render Order: Right Down
- Map Size: Fixed
  - The map should not be infinite, but the actual size is variable.
  - There are two "screen sizes" supported:
    - TODO: This is not true anymore:
    - The Normal Standard is a 16:9 "screen" that is 20 tiles wide by 11 tiles high.
    - A 4:3 aspect ratio using 16 tiles wide by 11 tiles high is also supported. This is what you need to copy a NES map for instance.
    - **However, if** you make the map bigger, in either direction, the camera will stick to 20x11 tiles, and scroll as the player moves to cover more territory. However, for the sake of memory, do not make infinite maps.
- Tile Size
  - 16x16  
  or
  - 32x32  
  There is no actual reason not to use other sizes, but these are the sizes tested and supported. If nothing else, they must be symmetrical.
- Remember to **save your map in JSON format!**
- The "Tiled Layer Format" must be CSV (or XML) for the Server to understand them (Note that these both essentially do "nothing" and just put the Data in an array that works in JSON)
- When adding a Tileset to the map be sure to check **Embed in map**

### Notes on saving Tile Maps with Tiled
Copied From [Modular Game Worlds in Phaser 3](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)  
When working with Tiled to generate maps for Phaser, there are a few things you’ll want to make sure to do:  
1. When you load a tileset into your map, make sure to check the “Embed in map” option. (If you forget to do this, then you can click the embed tileset button the bottom of the screen.)  
2. Make sure you aren't using a compressed “Tile Layer Format.” You can adjust that in map properties sidebar… which you can open by hitting “Map → Map Properties” in the top toolbar.  
3. When you export your map, save it as a JSON file.  
(There are pictures to illustrate these 3 points on the linked site above.)

### Layers

Create the following layers for tiles, which should be obvious as to how they work:
- Stuff You Walk Under
- Stuff You Run Into
  - This is the layer we collied with.
- Ground

In addition, add an Objects layer.
- Every Scen must have an Objected named "Default Spawn Point" where new characters arrive by default.
- Further, you can make points of Type "Entrance" with a name of our choosing for directing players to when entering this scene from other scenes.

### Adding Scenes to the Program
1. Create a new Tilemap with Tiled.
2. Save it in .json format to `src/assets/tileMaps`
3. Edit `src/scenes/sceneList.js` to add the scene to the game.

## Exits

Make an object layer in your tilemap.  
Draw boxes beside the "exits".
Name them the name of the scene you want to go to when the character passes that exit.
The "Type" must be "SwitchToScene".  
REMEMBER that Phaser 3 Arcade Physics only thinks in squares and circles, so don't try to get fancy. The box you draw is NOT ACTUALLY what the player will collide with. The code will draw a new box at the same location with the same width and height. So if you make a polygon, the code will still draw a rectangle.
- Add a Custom string Property to each Exit Named "Entrance" with the Value of the "Entrance" you want this exit to take you to in the other scene.

Notes on making "Exit" boxes:
1. Do not let them spill into the scene, they will be outlined in bright colors like red for debugging, so they shouldn't show up in the camera.  
2. Don't be stingy with their size:  
    a. Make them wide enough that nobody can "sneak past" them.  
    b. Make them deep enough that we can require a significant overlap before triggering them. This way if we want to ensure a character is fully or mostly off of the screen before switching rather than barely at the edge, we can, without a larger character accidentally getting over the box.  
    c. One tile width deep and wide past the edge of the door is plenty.

### Image Sources

I will keep track of the Image sources here for attribution.

- [Tileset 1bit Color](https://opengameart.org/content/tileset-1bit-color)  
Author: [Clint Bellanger](https://opengameart.org/users/clint-bellanger)  
License: [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/)
FileName: tileset_1bit-16x16.png  
- [Zoria Tileset](https://opengameart.org/content/zoria-tileset)  
Author: [DragonDePlatino](https://openga    // https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
meart.org/users/dragondeplatino)  
License: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
FileNames: zoria_overworld.png, zoria_underworld.png  
See also: [Mockups](https://opengameart.org/sites/default/files/mockups_1.png)  
- [Exterior 32x32 Town tileset](https://opengameart.org/content/exterior-32x32-town-tileset)  
Author: [n2liquid](https://opengameart.org/users/n2liquid)  
License [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
FileName: tileset_town-32x32.png  
- [Solarus Full Hyrule](http://absolute-hyrule-tutorials.solarus-games.org/)  
See Also: [Forum Post](http://forum.solarus-games.org/index.php/topic,881.0.html)  
Author: [ffomega](http://forum.solarus-games.org/index.php?action=profile;u=423)  
License: Unknown, see [Solaris Game License](https://www.solarus-games.org/en/about/faq)  
FileNames: solarus_full_hyrule.png  
- [Tiny 16: Basic](https://opengameart.org/content/tiny-16-basic)  
- [8-Bit PixelArt Carrot](https://opengameart.org/content/8-bit-pixelart-carrot)  
Author: sufan02  
License [CC0](https://creativecommons.org/publicdomain/zero/1.0/)  
Filename: carrot.png
- [Panting Dog](https://www.pinterest.com/pin/329888741428973815/)  
Source: Pinterest  
Filename: panting-dog.png  

### If you want to keep building the NES Hyrule map

The map can be found [here](https://www.spriters-resource.com/resources/sheets/116/119176.png)

### Good Tutorials for learning Phaser
- [Modular Game Worlds in Phaser 3](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)
- [How to Make a Mario-style Platformer with Phaser 3](https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/)
- [Create A Basic Multiplayer Game In Phaser 3 With Socket.io](https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/)

