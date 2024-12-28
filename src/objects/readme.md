# Object Documentation

Document the objects here.

### Rational
Note that many objects are now implemented with [Map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) , but the basic premise is the same.

Objects store data that is used throughout the game in different places.  Objects in Node.js allow you to keep a single persistent instance of something in the entire program.  

In a perfect world data is put in different objects based on logical organization.  

In reality sometimes it also has to do with avoiding circular references.  

## playerObject
 - If you are looking for a client setting or "default" start here.
 - If you want to add a "setting", do it here.
 - Most of the data for the game is here. Since the "Player" is the center of the entire client.
 
## spriteSheetList
 - Meta data for sprites files.
 - If you want to add any sprites to the game:  
 1. Add the image to the folder with the others. (../assets/spriteSheets)
 2. Duplicate a similar sprite entry in this file and update the needed parts.
 
## ../scenes/sceneList.js
 - Meta data for scenes.
 - If you want to add any scenes to the game:  
 1. Add the tile map to the folder with the others. (../assets/tileMaps)
 2. Duplicate a similar tile map entry in this file and update the needed parts.

## phaserConfigObject
 - Phaser game Engine config is here. That is its primary purpose.
 - The reason this isn't inside playerObject is to avoid circular references. Nothing else.
 
## textObject
 - Text strings that are displayed at various points in the game via the DOM.
 - You can add/update/change these as you see fit.

## communicationsObject
 - This holds the websocket connection once it is made, so that other code can look at the connection or use it.

## hadrons
 - Never edit this.
 - This is the master list of hadrons (game pieces) being managed by the game.
 - The incoming hadrons from the server are merged with this.
 - The object file is purely to allow the code to "import" the data and then set and share it with other functions.
- More information may be available in the file itself in comments at the top.

## clientSprites
- Never edit this.
- This is the master list of all sprites that the code has created.
- The object file is purely to allow the code to "import" the data and then set and share it with other functions.
- More information may be available in the file itself in comments at the top.

## clientSprites
- Never edit this.
- This is the master list of all sprites that the code has created.
- The object file is purely to allow the code to "import" the data and then set and share it with other functions.
- More information may be available in the file itself in comments at the top.

## currentSceneNPCs
- Never edit this.
- This is an empty Map for holding all of the NPCs in the current scene.
- More information may be available in the file itself in comments at the top.

## spellAssignments
- Never edit this.
- This is an empty Map for holding all of the Spell assignments.
- More information may be available in the file itself in comments at the top.