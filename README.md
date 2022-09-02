[![Server Run Test](https://github.com/chrisl8/Witchazzan/actions/workflows/server.yml/badge.svg)](https://github.com/chrisl8/Witchazzan/actions/workflows/server.yml)
[![Client Build Test](https://github.com/chrisl8/Witchazzan/actions/workflows/client.yml/badge.svg)](https://github.com/chrisl8/Witchazzan/actions/workflows/client.yml)

You can play the game at [https://witchazzan.com](https://witchazzan.com)

# Witchazzan - A Game!

## How to Play the Game

Just navigate to [https://witchazzan.com](https://witchazzan.com) where the game is up and live.

## About the Code

**IT LIVES!** After a break of almost two years, we are working on this project again!  
The back end server is now built in Node.js, and is included in this repository.  

This is the start of a game that [doby162](https://github.com/doby162) and [chrisl8](https://github.com/chrisl8) are building.  

The game exists in two parts:  
1. A Phaser 3 based JavaScript web front end.  
2. A Node.js JavaScript server.  

Both parts are required for the game to function.

## How to Run a Local Copy for DEVELOPMENT!

1. Clone the repository.
2. Run `./scripts/devSetup.sh`

That should get you going and provide some guidance if you are missing anything, along with how to run it.

## Phaser Documentation

Start with the [New Phaser API Documentation](https://newdocs.phaser.io/docs/3.55.2/Phaser).

Phaser has been through a lot of versions, so online searches are often frustrating as you find answers that don't apply anymore. If you can follow the code to figure out where in the API the function you are looking at is, and then find that in the documentation above, it helps a lot. Just be patient as JavaScript lets you assign Methods to variables and it can be difficult to trace a given variable back to exactly where in the Phaser API the variable you are looking at resides.

## Where to start

`client/src/gameLoopAndSceneFactory.js` is where the game is set up, and also the game update loop that runs every frame. Start there and follow the functions it calls.

## Persistent Data Storage Information

All persistent data is stored in a folder called `persistentData`.  
If this folder does not exist, it will be created.  
So you can just wipe the entire folder and start fresh any time you want to.

The data currently stored there is:
- `persistentData/database.sqlite` - A SQLite database that stores all of the user accounts.
- `persistentData/serverConfig.json5` - A JSON5 file that stores the server configuration data.
- `persistentData/hadrons.json5` - A JSON5 file that stores the last saved game state for retrieval upon a server restart.

### SQLite
The `.sqlite` files are SQLite databases that are not meant to be human readable or written to. The server takes care of them. There are tools to read/write such files though if you really want to.  
If you do need to edit a SQLite file, I recommend [DB Browser for SQLite](https://sqlitebrowser.org)

### JSON5
The `.json5` files are [JSON5](https://json5.org/) files that **are** meant to be human readable and editable. JSON5 is simply an ES6+ syntax JavaScript object literal in a file, so just treat it like a Javascript object. The server will warn you and refuse to start if you break the format, and it will also reformat it for you when it starts and any time it saves data to the config files, which it does do.

## Development How to...
### Hadrons
Hadrons are the silly name for the "game objects" that are used to track and control everything in the game. They are continuously spent back and forth between the clients and the server.

They are basically just JavaScript Object Literals, but are often encoded.

Because their contents are sent over the network constantly, their keys are kept short (abreviated).

You can add **any** key/value pair to a hadaron, **but** they do get valiated at various points, so if you want to use a new key, edit `shared/validateHadron.mjs` and add your new key along with a descriptoin of what it does. Remember to keep it short.

In the browser you can watch the actual data:
 - Open Developer Tools
 - Go to the Network tab
 - Click on "WS" to juts see websocket data
 - Pick the one line for the websocket connection
   - If there are more than one, find the one with the most data or that updates when you move your character on screen.
 - Look under "Messages".

You will see a lot of single integer messages, which are just Socket.io's heart beats, which you can ignore.

The others messages will be either single hadrons sent from the client to the server, or big chunks of them sent from server to client. Because they are sent over the network in plain JSON, they are easy to read and check what is happening.

The server also dumps all of its data to the file `persistentData/hadrons.json5` periodically.
 - You can open and read this file anytime to see what the data in the game looks like.
 - **When the server is shut down** you can edit this file, and when you start the server again, it will read it.
   - This is a great way to remove bad data if you messed up your code, or you can inject data if you want to.
   - When you start the server again watch for errors, as it will validate this file and crash if the data is invalid.

### Display text to a user.
All text display and input is done via HTML overlays on top of the canvas. This makes it easier to deal with font scaling across multiple devices.

client/src/objects/textObject.js contains text entries to display. You can add anything you want to here.

Putting them here allows the game update cycle to parse them and display or remove them as needed without your needing to handle that.

If you have a new text entry that you want to display, add another object entry to the list. Use the existing entries as examples.

Notice that some have functions with debounce to remove the message after a period of time, which you should use.

Each text entry uses on of the predefined locations, currently UpperLeft, Scrolling, and Center.

An example of adding text to an element anywhere in your code is:

```
        textObject.spellSetText.text = 'Hello World!';
        textObject.spellSetText.shouldBeActiveNow = true;
        textObject.spellSetText.disappearMessageLater();
```

If you want to add a new text location, code must be added in several files, at least:  
playerObject.js  
sceneList.js  
updateInGameDomElements.js

### Add a Sprite to the Game
Sprites are in "sheets" meaning a single image containing a series of "frames". I find [aseprite](https://www.aseprite.org/) to be the easiest program to use for making these.

Once you have your sprite image file put it in `client/src/assets/spriteSheets/`.

Then add the data about it to the file `client/src/objects/spriteSheetList.js`:
 - First add an `import` statement for it at the top.
 - Then add metadata about it in the big oject below.

Use the existing data as an example.

Some important things:
 - `rotatable` is indicating to the game if the sprite can be rotated. Think about a humanoid character vs. a tank. A humanoid would look dumb rotated 180 degrees to walk backwards. It should clearly be flipped. However, a tank would work perfectly to rotate.

### Add an NPC to the game.
 - First add a Sprite, see "Add a Sprite to the Game", or pick one that is already in the game.
 - Edit the Tilemap: Currently all NPCs are flagged in the tilemaps, so open the Tilemap for the scene that you want to add an NPC to in Tiled, and add an Object in the location where you want the NPC to be.
   - The Object's "Type" should be "NPC".
   - Under "Custom Properties" there are some required and some optional things to add:
     - `id` **REQUIRED** (String) - This is a GUID. Open your browser, open dev tools, and run `crypto.randomUUID()` then copy the long string, withOUT quotes, but WITH the dashes into the value for the `id`
     - `subType` **REQUIRED** (String) - This is the NPC Type to help identify it and group it with similar NPC functionalities.
     - `sprite` **REQUIRED** (String) - The name of the sprite to use for this NPC.
     - `initialSpriteDirection` Optional - Direction to start the sprite facing.
       - It can be left/right/up/down string or east/west/north/shouth string, or an intenger for rotation from 0.
     - `health` Optional (Integer) - Initial health of this NPC. Use this to make it more or less squishy. 100 is the default if nothing is set.
     - `respawnInSeconds` Optional (Integer) - How many seconds after it is destroyed before it respawns. Otherwise it only comes back if the NPC data is somehow removed from the server.
     - `dps` Optional Float - "Damage Per Shot" - This value is multiplied against any damage done by a "shot" or "spell cast" from this NPC. Use it to make this NPC's shots more or less powerful. Remember that you can also increase and decrease this in "real time" in the code later. A default of 1 is assumed, meaning no modification to default "damage".
     - `tcw` Optional Bool = "Transfer Control When Leaving Scene" - This instructs the server to transfer control of this NPC to another client when you leave the scene. **You probably want to set this to true.** Otherwise the NPC will stop working when the first client to enter the scene leaves.
     - `pod` Optional Bool - "Persist on Disconnect" - If a player disconnects, by default their hadrons are archived. This prevents that behavior. **You probably want this set to true.** Otherwise, the NPC will disappear when the first client who enters the room leaves.
     - `dod` Optional Bool - "Destroy on Disconnect" - If this is true, the NPC will be destroyed when the owner disconnects. This is probably not normally what you want for an NPC in a multi-player game, **but it is helpful during initial testing to set it true** so that your NPC is wiped and built from scratch when you refresh your browser.
     - `spriteLayerDepth` Optional (Integer) = "Sprite Layer Depth" - This is the depth used when adding the sprite to the scene. This will determine if it appears on top of or underneath other objects, based on their depth.
     - `rateOfFire` Optional (Integer) - "Rate of Fire" - If this is set, then the given spell is fired every time the last spell cast was X milliseconds ago based on the frame to frame delta. **This means the lower this number is, the faster it fires.** If this is left out, then no spell will be cast at all. You must also set the "spell" name.
     - `spell` Optional (String) - Name of the spell to cast. If you aren't sure, use 'quasar'. The spell is only cast if rateOfFire is also set.
     - **You may add other things here as well and use them in your code, but if you do, you must update the code in `client/src/gameLoopAndSceneFactory.js` under `} else if (object.type === 'NPC') {` to copy these key/value pairs into the hadron, and you must alo update `shared/validateHadron.mjs` to add your additional hadron keys as valid keys.**
   - NOTE: If you update sprite properties or add new ones, existing sprites won't get updated. use the `/deleteAllNPCs` command to clear them and make new ones. Also note that you need to not be in a scene with the sprite for the delete to work.
 - **Informational:** These sprites are imported by the client in `client/src/gameLoopAndSceneFactory.js` under `} else if (object.type === 'NPC') {`
   - You should **not need** to update any code there, but it is important to understand the flow and where to go if you do find that you need to enhance the import process.
 - Set up Collisions: Each NPC type's collisions are custom coded in the file `client/src/gameLoopFunctions/spriteCollisionHandler.js`.
   - Find the section under `} else if (obstacleSprite) {`, because this will be an "obstacleSprite" and then at the bottom of that section add to the `else if` chain to incorporate your desired collision response.
   - Note that this function can be mess, so test your work and be creative.
   - I highly recommend checking the "Enable Phaser Debugging" box form the title screen.
     - This will display the colliders for your sprites, as well as their velocity, which is very helpful in debugging.
     - You may find from looking at the colliders that you need to tweak your sprite settings in `client/src/objects/spriteSheetList.js` to get the size and shape of collider that you want.
 - Set up Behavior: Each NPC's sub-type can have custom behavior coded in the file `client/src/gameLoopFunctions/npcBehavior.js`
   - Use the existing NPCs as a model of how to add new ones.

## Code Standards

I am using [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/). The configurations for both are in the code.  
Don't worry about it if you don't want to run them, I will not reject any pull requests based on formatting.  
If you do use Eslint I assume you may and will set some things that Eslint complains about to "ignore" inline. That is perfectly fine and legitimate. Do not be a slave to Eslint, just run it and see what it says, and if you want to fix it, do so, if not, mark it as ignored inline if the red marks bother you.  
Prettier and Eslint are [easy to set up](https://imgs.xkcd.com/comics/will_it_work.png), and your IDE and VIM should both support them. If not, just commit your code and I will clean it up later. Messy code that works is better than no code.

## Deploying Code in Production
### Initial setup
**NOTE: Parcel does pretty much all of its work in RAM, which means that for a site with a lot of assets it can use up a lot of memory just to build the site. If you keep getting "killed" when you run `npm run build` on a low cost virtual host, check how much memory it has. If it is equal to or less than 2GB, you may need to increase it or alternatively [create a swap file](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-20-04) to reliably build (`npm run build`).**


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
pm2 install pm2-logrotate # Otherwise logs can grow to fill disk space
pm2 --version
```

Pull down and build the code:

```
git clone https://github.com/chrisl8/Witchazzan.git
cd Witchazzan
# Create and set up the required version number file.
./scripts/versionNumberUpdate.sh
cd Witchazzan/server
npm ci
cd Witchazzan/client
npm ci
npm run build
```

Add to crontab:  
`crontab -e`  
Add this line:  
`@reboot /home/<userID>/Witchazzan/scripts/startpm2.sh`  
which should automatically run at startup.

You will also need to set up a Web server to serve the built code, as Node.js is not fit to perform SSL and other important functions of a front end web server.

### Web server configuration.
I serve the project using Nginx as a proxy to the Node.js server.  
I suggest looking up how to set up Nginx. I use the documentatin from Digital Ocean on setting up Nginx on Ubuntu.

Here is a partial of my config file for this site.  
The important bits are that it will directly serve files, by name, only forwarding non-files to the Node.js server.  
The benefit of this is that when the server is down or restarts, you don't get a 302 error, but instead the site works normally and lets you know that the server is down.  
Note that means new file extensions must be added to it by hand.  
```
server {
    server_name witchazzan.space;
    root /home/chrisl8/Witchazzan/client/dist;

    location = / {
        index index.html;
    }

    location ~* .(png|ico|gif|jpg|jpeg|css|js|html|webmanifest|map|mp3|ogg|svg)$ {
        try_files $uri =404;
    }

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_ssl_session_reuse off;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    listen 80;
    listen [::]:80;
}
```
Note that this is **not** set up for SSL. I leave that exercise to better guides than this.

### Updating installed code
Run `./scripts/updateProduction.sh` or here is the manual process:

```
cd Witchazzan
git pull
./scripts/versionNumberUpdate.sh
cd server
npm ci
cd Witchazzan/client
npm ci
npm run build
pm2 restart Witchazzan
```

## Updating dependencies

Running `npm ci` uses the exact stack of dependencies that were set by the developer who commited the `package-lock.json` file. If you want to update dependencies:  
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
- Tile Size
  - 16x16  
  or
  - 32x32  
  There is no actual reason not to use other sizes, but these are the sizes tested and supported. If nothing else, they must be symmetrical.
- Remember to **save your map in JSON format!**
- The "Tiled Layer Format" must be CSV (or XML) for the Server to understand them (Note that these both essentially do "nothing" and just put the Data in an array that works in JSON)
- When adding a Tileset to the map be sure to check **Embed in map**

### Notes on saving Tile Maps with Tiled
When working with Tiled to generate maps for Phaser, there are a few things you’ll want to make sure to do:  
1. Make sure you aren't using a compressed “Tile Layer Format.” You can adjust that in map properties sidebar… which you can open by hitting “Map → Map Properties” in the top toolbar.  
2. When you export your map, save it as a JSON file.  

### Layers

Create the following layers for tiles, which should be obvious as to how they work:
- Stuff You Walk Under
- Stuff You Run Into
  - This is the layer we collied with.
- Ground

Optionally you can also create:
- Stuff on the Ground You Can Walk On
  - So you can put things "on" the ground that are still walked on.
- Water
  - The intention is that water collisions will be special,
    - i.e. Spells normally pass over them, but you cannot walk on it!

In addition, add an Objects layer.
- Every Scene must have an Object named "Default Spawn Point" where new characters arrive by default.
- Further, you can make points of Type "Entrance" with a name of our choosing for directing players to when entering this scene from other scenes.

#### Default Camelopardalis Map dimensions
- Tile Size: 16 x 16 
- Map Size in Tiles
  - Width: 44
  - Height: 26
- Map Size in Pixels
  - Width: 44 * 16 = 704
  - Height: 26 * 16 = 416
- Teleport Layer
  - Tiles: 2
  - Width in Pixels: 2 * 16 = 32
- Map Borders in Pixels without Teleport Layer
  - Left (x): 32
  - Right (x): 672
  - Top (y): 32
  - Bottom (y): 384

Overall Width: 

#### Entrance Default Locations
If there isn't any obstructions in the map itself,  
then the entrances are set in the exact middle on the "wide" axis,  
and exactly half a tile (8 pixels) in from the edge.
- Default
  - x: 352
  - y: 208
- Right
  - x: 664
  - y: 208
- Left
  - x: 40
  - y: 208
- Upper
    - x: 352
    - y: 40
- Lower
  - x: 352
  - y: 376

NOTE: For wide open entrances, add the custom properties to the entrance:  
allowCustomX: true  
  or  
allowCustomY: true  
to allow the exact x or y position to be carried over from the previous scene.  
In some cases, like a narrow hall, or a transiton from  wide to narrow area, this is not a good idea. Use your judgement.  

### Adding Scenes to the Program
1. Create a new Tilemap with Tiled.
2. Save it in .json format to `src/assets/tileMaps`
3. Edit `src/scenes/sceneList.js` to add the scene to the game.

### Tilemap Exits

TODO: Document more of how to make them work.

## Parcel Notes
Parcel is pretty nice, but it has quirks. Here are my notes.
- [The dist folder is not cleaned between builds](https://github.com/parcel-bundler/parcel/issues/1234)
  - This will cause the folder to get very big as it fills with old junk that we deleted.
  - Solution: Add `"prebuild": "rm -rf dist",` under the scripts key in `package.json`. Note that this won't work on Windows.  
- [How to import audio files](https://github.com/parcel-bundler/parcel/issues/1911#issuecomment-1042854678)
  - You must add "url:" to the front of the file name.
  - You can see an example of this in `gameLoopAndSceneFactor.js` where the .ogg and .mp3 files are imported.
- [@parcel/transformer-js: Browser scripts cannot have imports or exports.](https://github.com/fregante/browser-extension-template/issues/51#issuecomment-869420069)
  - You have to add `type="module"` to all script imports in your .html files
  - Example at the bottom of the main `index.html` file where `startGame.js` is imported.
- Other ways to do things
  - Of course there are a dozen other ways to do things and a dozen other package managers, but I have been aiming for simplicity in this build, even at the possible expense of build size. It is a game, so one should expect some load time when first visiting the site.

## Favicon Notes
 - I used https://www.favicon-generator.org/ to generate the favicon files.
 - The source file is `client/src/favicon/bloomby.png`.
 - I put the resulting files in `client/src/favicon/`
   - I deleted the `ms-icon-*.` files as I'm not using them.
   - I also deleted `browserconfig.xml`
 - I put `manifest.json` directly in `client` next to the `index.html` file.
   - I had to edit it to point to the correct folders, so please compare to the existing one. 
 - I put the generated html into `client/index.html`
   - Again, I had to edit some parts of it and remove references to things I deleted, so compare the new lines to the existing ones.
     - Technically if you replace the icon images, the file names will stay the same, so you may not have to update `index.html` anyway.
 - Parcel bundling will ensure that browser caching sees that the files have changed.

## License

Please see the LICENSE.md file in the same folder as this file.

## Attribution

### Image Sources

I will keep track of third party image sources here for attribution.

- [Kenney Assets](https://kenney.nl/assets)  
I always start with Kenney's Assets when looking for inspiration!    
License [Public Domain CC0](https://creativecommons.org/publicdomain/zero/1.0/)  
File Names: Many, as they are Public Domain CC0, I do not track each one, but instead freely mix them with my own artwork.  
- [Zoria Tileset](https://opengameart.org/content/zoria-tileset)  
Author: [DragonDePlatino](https://opengameart.org/users/dragondeplatino)  
License: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
File Names: `zoria_overworld.png`, `zoria_underworld.png`  
See also: [Mockups](https://opengameart.org/sites/default/files/mockups_1.png)
- [Exterior 32x32 Town tileset](https://opengameart.org/content/exterior-32x32-town-tileset)  
Author: [n2liquid](https://opengameart.org/users/n2liquid)  
License [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  
File Name: `tileset_town-32x32.png`  
- [Written Paper](https://opengameart.org/content/written-paper)  
Author: [Harry Tzioukas](https://opengameart.org/users/harrytzioukas)  
License: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
File Name: `written_paper_no_background.png`  
Note: Converted from static image to sprite sheet by ChrisL8.  
- Unsure  
I'm not sure where these images came from. I didn't make them, but I lost track of the sources. If I find the source, I will add it here.  
File Names: `Dungeon_Tileset.png`, `bones.png`

#### Other images were created by our own team!

### 8-bit NES Legend of Zelda Map Information

The main map is heavily inspired by the beloved 8-bit NES Legend of Zelda game, which I played as a child.

These are the resources I used for inspirationa and initial testing:

[Python Zelda Walking Tour program](http://inventwithpython.com/blog/2012/12/10/8-bit-nes-legend-of-zelda-map-data/)

[NES Zelda Map Data](https://github.com/asweigart/nes_zelda_map_data)

Another copy of the Hyrule map can also be found [here](https://www.spriters-resource.com/resources/sheets/116/119176.png)

### Good Tutorials for learning Phaser
- [Modular Game Worlds in Phaser 3](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)
- [How to Make a Mario-style Platformer with Phaser 3](https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/)
- [Create A Basic Multiplayer Game In Phaser 3 With Socket.io](https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-2/)

### Good advice on Pixel Art:
- [Baby Steps in Pixel Art](https://weareludicrous.com/blog/2018/baby-steps-in-pixel-art/)
- [Thoughts on Very Low Resolution](https://kano.me/blog/my-thoughts-on-very-low-resolution/)