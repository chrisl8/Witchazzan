# Object Documentation

Document the objects here.

### Rational
Objects store data that is used throughout the game in different places.  Objects in Node.js allow you to keep a single persistent instance of something in the entire program.  

In a perfect world data is put in different objects based on logical organization.  

In reality sometimes it also has to do with avoiding circular references.  

## playerObject
 - Most of the data for the game is here. Since the "Player" is the center of the entire client.
 
## rootGameObject
 - This is primarily for the Phaser game settings.
 - The reason this isn't inside playerObject is to avoid circular references. Nothing else.
 
TODO: Document the rest.