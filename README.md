[![Build Status](https://travis-ci.com/chrisl8/witchazzan-client.svg)](https://travis-ci.com/chrisl8/witchazzan-client)

**This project has come to an end. It was fun, but we are not maintaining it or developing any further on it now.**

# Witchazzan - A Game!

This is the start of a game that [doby162](https://github.com/doby162) and [chrisl8](https://github.com/chrisl8) are building.  

The game exists in two parts:  
1. A Phaser 3 based web front end.  
2. A Node.js based server.  

Both parts are required for the game to function.

We started with the [Phaser 3 Webpack Project Template](https://github.com/photonstorm/phaser3-project-template).

The instructions here are split up into Client and Server.

# Client

## Location

    /client/

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command         | Description |
|-----------------|-------------|
| `npm ci`        | Install project dependencies |
| `npm start`     | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, enter the client folder `cd witchazzan/client`, run `npm ci`, then, you can start the local development instance of the client by running `npm start`.


After starting the development server with `npm start`, you can edit any files in the `client/src` folder
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

## Deploying Code in Production
### Initial setup
NOTE: Webpack does pretty much all of its work in RAM, which means that for a site with a lot of assets it can use up a lot of memory just to build the site. if you keep getting "killed" when you run `npm run build` on a low cost virtual host, check how much memory it has. If it is equal to ro less than 1GB, you may need to increase it to reliably run webpack. 

The production server must have a recent LTS version of Node.js installed.  
`node -v`

If it is not, I suggest using [nvm](https://github.com/nvm-sh/nvm) to install node.js:
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install --lts
node -v
```

Use pm2 to keep the server running.  
`pm2 --version`  
If it isn't installed, install it:
```
npm install -g pm2
pm2 --version
```

Pull down and build the code:

```
git clone https://github.com/chrisl8/Witchazzan.git
cd ../server
npm ci
cd Witchazzan/client
npm ci
npm run build
```

Add to crontab:  
`crontab -e`  
Add this line:  
`@reboot /home/<userID>/Witchazzan/startpm2.sh`  
which should automatically run at startup.



### Updating code


## Code Standards

I am using [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/). The configurations for both are in the code.  
Don't worry about it if you don't want to run them, I will not reject any pull requests based on formatting, but if you want to "fit in" run your code through Prettier and Eslint first.  
NOTE: I assume you may and will set some things that Eslint complains about to "ignore" inline. That is perfectly fine and legitimate. Do not be a slave to Eslint, just run it and see what it says, and if you want to fix it, do so, if not, mark it as ignored inline.  
They are [easy to set up](https://imgs.xkcd.com/comics/will_it_work.png), and your IDE and VIM should both support them easily.

## Updating dependencies

Running `npm ci` uses the exact stack of dependencies that were set by the developer who commited the `package-loc.json` file. If you want to update dependencies:  
1. Run `npm outdated` to see what dependencies are out of date.
2. Anything in red will automatically update, so ignore it.
3. Anything in yellow will **not** be updated **unless* you incremeent the version number in `package.json`.
4. Update the `package.json` file with new version numbers for the ones you want to update.
5. Run `rm package-lock.json;rm -rf node_modules;npm install;npm outdated`.
6. If you are happy with the results, then TEST the client and server to make sure that your new upgrades didn't break anything!
7. Commit the changes to **both** the `package.json` and `package-lock.json` files.

Now `npm ci` will use the new dependencies.

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

### Tilemap Exits

TODO: Document more of how to make them work.

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
- Old Carrot [8-Bit PixelArt Carrot](https://opengameart.org/content/8-bit-pixelart-carrot)  
Author: sufan02  
License [CC0](https://creativecommons.org/publicdomain/zero/1.0/)  
~~Filename: carrot.png~~
- New Carrot [Veggy friends](https://opengameart.org/content/veggy-friends)  
Author: [SCay](https://opengameart.org/users/scay)  
License: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
Filename: carrot.png
- [Panting Dog](https://www.pinterest.com/pin/329888741428973815/)  
Source: Pinterest  
Filename: panting-dog.png  

#### These images were created by our own team!
- bloomby
- chest
- ChristmasTree
- deadTree
- fireball
- gloob-scaryman
- greenTree
- joosh
- Lilolyon
- pinkTree
- Teleport

### If you want to keep building the NES Hyrule map

The map can be found [here](https://www.spriters-resource.com/resources/sheets/116/119176.png)

### Good Tutorials for learning Phaser
- [Modular Game Worlds in Phaser 3](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)
- [How to Make a Mario-style Platformer with Phaser 3](https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/)
- [Create A Basic Multiplayer Game In Phaser 3 With Socket.io](https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/)

