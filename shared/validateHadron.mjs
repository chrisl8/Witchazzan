/*
These are sent over the wire.

Every key is a maximum of 3 characters to minimized bandwidth usage.

Use this code to validate any hadrons to ensure that you made them correctly. This will:
0. Keep the fields documented for you in one place.
1. Crash if you forget a required key, helping you catch errors during development.
 */

// Every hadron must have:
const alwaysRequiredKeys = [
  "id", // Output of crypto.randomUUID(); The GUID of the sprite itself, also used as the key in Map()s
  "typ", // Type like message, player, spell, etc. Every unique kind should have a type.
  "spr", // The sprite to display for this hadron.
  "x", // X location of sprite
  "y", // Y location of sprite
  "scn", // Scene sprite is in.
];

const serverAdditionalRequiredKeys = [
  "ctr", // The GUID of the user currently controlling it, which can change
  "own", // The GUID of the owner.
];

// Optionally a hadron can also have:
const optionalKeys = [
  "nam", // Player name. Players always have a name, but no other hadron currently makes use of this.
  "flv", // Flavor. Used on Quarks to distinguish them from each other, so far we have NPCs and Items.
  "sub", // Sub-Type, i.e. A hadron of Type 'spell' might be Subtype 'spell' or a hadron of type 'NPC' might be a Subtype 'stationaryTank'
  // Sprite information
  "dir", // Direction of the Sprite
  "vlx", // X Velocity of the sprite
  "vly", // Y Velocity f the sprite.
  "rot", // Rotation of sprite.
  "mov", // Moving - Communicates to other clients whether the client is "in motion" or not, triggering motion animations.
  // Specific to certain kinds of hadrons
  "txt", // For message type hadrons.
  // Character and NPC Information
  "cho", // Chat Open - Indicates to other clients when a player's chat dialog is open, so that they can display an icon for it.
  "hlt", // Health - Health level for Player or NPC, etc.
  "mxh", // Max Health - Health when Player or NPC is fully healed.
  "dps", // "Damage Per Shot (dps)" (Float) - For an NPC or anything that fires spells, this will be multiplied against the spell's default damage level. Use this to make a given NPC's shots more or less powerful relative to players and other NPCs.
  // What to do when an owner disconnects or changes scenes:
  "dod", // "Destroy On Disconnect (dod)" (Bool) - Destroy this hadron if the owner disconnects.
  "tcw", // "Transfer Control When Leaving Scene (tcw)" (Bool) - Set to true if you want the sprite to be transferred to a new controller when the current controller leaves the scene. Otherwise the sprite is archived until the owner returns.
  "pod", // "Persist On Disconnect (pod)" (Bool) - Normally any hadrons owned by a player are removed from the game and 'archived' when a player disconnects, even if they aren't controlling them. This causes them to persist even if the player disconnects, and to be brought online even when the player isn't online.
  "off", // "Off" (Bool) - If set to true, indicates that a hadron is "off", that is "dormant", and should have no sprite attached it and not register colliders. The purpose of this is to "hold" hadrons for things like NPCs that may need to be "killed", but still hold their place so that when a client enters the room it won't immediately respawn.
  "tmo", // "Time Off" - The time that a hadron was turned off. For use in respawning NPCs based on this time.
  "ris", // "Respawn In Seconds (ris)" (Integer) - How many seconds after it is shut "off" before it respawns.
  "dph", // "Sprite Layer Depth (dph)" (Integer) - Layer assigned to the sprite when added to the scene. Determines if it is on top of or underneath other sprites and tilemap scenery.
  "rof", // "Rate of Fire (rof)" (Integer) - For NPC's, a spell is cast when this many milliseconds has past since the last one, based on the frame to frame delta. This means the lower the number, the faster it fires.
  "spl", // "Spell (spl)" (String) - Name of the spell to cast for an NPC.
  "ani", // Animation to set on hadron's sprite at the moment.
  "rac", // "Ray Casat (rac)" (Bool) Whether or not to set up a Raycast for this sprite.
  "rtp", // "Raycast Type (rtp)" (String) What kind of raycast to perform: Cone, Circle, or Line (Line is default is this isn't specified, so you don't need to specify line)
  "rcd", // "Raycast Degree (rcd)" (Integer) The range in degrees for a raycast Cone (Not used for other types at the moment)
  "rdt", // "Raycast Distance (rdt)" (Integer) Distance to raycast out to.
  "spv", // "Spell Velocity (spv)" (Integer) - Velocity set on spells.
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
