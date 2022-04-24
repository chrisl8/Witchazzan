/*
These are sent over the wire, so text is abbreviated a bit in the vain hope that it reduces
bandwidth and latency.

Use this code to validate any hadrons to ensure that you made them correctly. This will:
0. Keep the fields documented for you in one place.
1. Crash if you forget a required key, helping you catch errors during development.
 */

// Every hadron must have:
import textObject from "../client/src/objects/textObject.js";

const alwaysRequiredKeys = [
  "id", // Output of crypto.randomUUID(); The GUID of the sprite itself, also used as the key in Map()s
  "typ", // Type like message, player, fireball, etc. Every unique kind should have a type.
  "sprt", // The sprite to display for this hadron.
  "x", // X location of sprite
  "y", // Y location of sprite
  "scn", // Scene sprite is in.
];

const serverAdditionalRequiredKeys = [
  "ctrl", // The GUID of the user currently controlling it, which can change
  "own", // The GUID of the owner.
];

// Optionally a hadron can also have:
const optionalKeys = [
  "dir", // Direction of the Sprite
  "velX", // X Velocity of the sprite
  "velY", // Y Velocity f the sprite.
  "name", // Player name.
  "txt", // For message type hadrons.
  "mov", // Moving - Communicates to other clients whether the client is "in motion" or not, triggering motion animations.
  "chtO", // Chat Open - Indicates to other clients when a player's chat dialog is open, so that they can display an icon for it.
  "hlth", // Health - Health level for Player or NPC, etc.
  "dod", // "Destroy On Disconnect (dod)" (Bool) - Destroy this hadron if the owner disconnects.
  "tcwls", // "Transfer Control When Leaving Scene (tcwls)" (Bool) - Set to true if you want the sprite to be transferred to a new controller when the current controller leaves the scene. Otherwise the sprite is archived until the owner returns.
  "pod", // "Persist On Disconnect (pod)" (Bool) - Normally any hadrons owned by a player are removed from the game and 'archived' when a player disconnects, even if they aren't controlling them. This causes them to persist even if the player disconnects, and to be brought online even when the player isn't online.
];

const allKeys = alwaysRequiredKeys.concat(
  serverAdditionalRequiredKeys,
  optionalKeys
);

function validate(data) {
  alwaysRequiredKeys.forEach((key) => {
    if (!data.hasOwnProperty(key)) {
      console.error(
        `Attempt to create new hadron without required key: ${key}`
      );
      throw `Invalid hadron`;
    }
  });

  for (const [key] of Object.entries(data)) {
    if (allKeys.indexOf(key) === -1) {
      console.error(`Attempt to create new hadron with unknown key: ${key}`);
      throw `Invalid hadron`;
    }
  }
}

function client(data) {
  try {
    validate(data);
    return true;
  } catch (e) {
    console.error(e);
    console.error(data);
    return false;
  }
}

function server(data) {
  try {
    serverAdditionalRequiredKeys.forEach((key) => {
      if (!data.hasOwnProperty(key)) {
        console.error(
          `Attempt to create new hadron on server without required key: ${key}`
        );
        throw `Invalid hadron`;
      }
    });
    validate(data);
    return true;
  } catch (e) {
    console.error(e);
    console.error(data);
    return false;
  }
}

export default { client, server };
