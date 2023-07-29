/*
These are sent over the wire.

Every key is a maximum of 3 characters to minimized bandwidth usage.

Use this code to validate any hadrons to ensure that you made them correctly. This will:
0. Keep the fields documented for you in one place.
1. Crash if you forget a required key, helping you catch errors during development.
 */

// Every hadron must have:
const alwaysRequiredKeys = [
  'id', // Output of crypto.randomUUID(); The GUID of the sprite itself, also used as the key in Map()s
  'typ', // Type like message, player, spell, etc. Every unique kind should have a type.
  'spr', // The sprite to display for this hadron.
  'x', // X location of sprite
  'y', // Y location of sprite
  'scn', // Scene sprite is in.
];

const serverAdditionalRequiredKeys = [
  'ctr', // The GUID of the user currently controlling it, which can change
  'own', // The GUID of the owner.
];

// Optionally, a hadron can also have:
const optionalKeys = [
  'tsk', // Task - Used to indicate what to do with this chunk of data when sent to or received from the server.
  'nam', // Player name. Players always have a name, but no other hadron currently makes use of this.
  'flv', // Flavor. Used on Quarks to distinguish them from each other, so far we have NPCs and Items.
  'sub', // subType, i.e., A hadron of Type 'spell' might be subType 'quasar' or a hadron of type 'NPC' might be some othersubtype.
  // Sprite information
  'dir', // Direction of the Sprite
  'vlx', // X Velocity of the sprite
  'vly', // Y Velocity f the sprite.
  'rot', // Rotation of sprite.
  'mov', // Moving - Communicates to other clients whether the client is "in motion" or not, triggering motion animations.
  // Previous scene info. Used for instance when returning from Library or to set new Cave Exist Scene
  'psc', // Previous Scene
  'px', // x position in the previous scene
  'py', // y Previous in the previous scene
  'de', // Destination Entrance - When a hadron is SENT to another scene, the sending scene is blind to the receiving scene's data, so we juts store the destination entrance, and the "receiving" scene should use this to determine the entrance and hence the X/Y coordinates for the "received" hadron. This is used when sending items and NPCs through teleport layers.
  // Specific to certain kinds of hadrons
  'txt', // For message type hadrons.
  // Character and NPC Information
  'cho', // Chat Open - Indicates to other clients when a player's chat dialog is open, so that they can display an icon for it.
  'hlt', // Health - Health level for Player or NPC, etc.
  'mxh', // Max Health - Health when Player or NPC is fully healed.
  'dps', // "Damage Per Shot (dps)" (Float) - For an NPC or anything that fires spells, this will be multiplied against the spell's default damage level. Use this to make a given NPC's shots more or less powerful relative to players and other NPCs.
  'stc', // Starting Scene, to return to when respawning.
  'stx', // Starting X location, to return to when respawning.
  'sty', // Starting Y location, to return to when respawning.
  'sdi', // Starting Direction, to return to when respawning.
  // What to do when an owner disconnects or changes scenes:
  'dod', // "Destroy On Disconnect (dod)" (Bool) - Destroy this hadron if the owner disconnects.
  'tcw', // "Transfer Control When Leaving Scene (tcw)" (Bool) - Set to true if you want the sprite to be transferred to a new controller when the current controller leaves the scene. Otherwise the sprite is archived until the owner returns.
  'pod', // "Persist On Disconnect (pod)" (Bool) - Normally any hadrons owned by a player are removed from the game and 'archived' when a player disconnects, even if they aren't controlling them. This causes them to persist even if the player disconnects, and to be brought online even when the player isn't online.
  'fly', // "Fly (fly)" (Bool) - Items that fly can travel over water.
  'swm', // "Swim (swm)" (Bool) - Items that swim can travel over water.
  // For NPCs
  'off', // "Off" (Bool) - If set to true, indicates that a hadron is "off", that is "dormant", and should have no sprite attached it and not register colliders. The purpose of this is to "hold" hadrons for things like NPCs that may need to be "killed", but still hold their place so that when a client enters the room it won't immediately respawn.
  'tmo', // "Time Off" - The time that a hadron was turned off. For use in respawning NPCs based on this time.
  'ris', // "Respawn In Seconds (ris)" (Integer) - How many seconds after it is shut "off" before it respawns.
  'dph', // "Sprite Layer Depth (dph)" (Integer) - Layer assigned to the sprite when added to the scene. Determines if it is on top of or underneath other sprites and tilemap scenery.
  'rof', // "Rate of Fire (rof)" (Integer) - For NPC's, a spell is cast when this many milliseconds has past since the last one, based on the frame to frame delta. This means the lower the number, the faster it fires.
  'spl', // "Spell (spl)" (String) - Name of the spell to cast for an NPC.
  'ani', // Animation to set on hadron's sprite at the moment.
  'rac', // "Raycast (rac)" (Bool) Whether or not to set up a Raycast for this sprite.
  'rtp', // "Raycast Type (rtp)" (String) What kind of ray cast to perform: Cone, Circle, or Line (Line is default if this isn't specified, so you don't need to specify line)
  'rcd', // "Raycast Degree (rcd)" (Integer) The range in degrees for a raycast Cone (Not used for other types at the moment)
  'rdt', // "Raycast Distance (rdt)" (Integer) Distance to raycast out to.
  'nbc', // "Nearby Raycast (nbc)" (Integer) If this exists, and a raycaster is on the NPC, then ALSO scan a circle of this diameter to notice very close entities from any direction.
  'fac', // "Face (fac)" (Bool) If there is a raycaster on the NPC it will rotate to face the nearest target.
  'fol', // "Follow (fol)" (Bool) If there is a raycaster on the NPC it will move to follow the nearest target.
  'vel', // "Velocity (vel)" (Int) Velocity to set on NPCs if they have movement, such as Follow.
  'rvl', // "Randomize Velocity (rvl)" (Int) Randomize velocity by given integer.
  'tvl', // "Travel (tvl)" (Bool) True if you want NPCs and/or Items to be able to use teleport layers.
  'pcl', // "Particle (pcl)" (String) Name of a particle to emit from the quark.
  'dpc', // "Damage Per Contact (dpc)" (Int) Indicates that contact with a player will damage them. The number will be used as a basis for how badly to damage how quickly.
  'fph', // "Follow Path (fph)" (String) Indicates that this NPC should follow a path by naming the Path to follow. The details of the path will be held in Waypoint entries in the Tilemap.
  'cpd', // "Current Path Destination (cpd)" (Int) Indicates the current Progression point along a set of Waypoints in a Path that this NPC is headed toward. Default will always start with 0 if not set.
  'ipd', // "Initial Path Destination (cpd)" (Int) Indicates the INITIAL Progression point along a set of Waypoints found in the tilemap. Use for  starting NPC's at their initial location when resurrecting them..
  'nph', // "Navigate Path (nph)" (string) Like Follow Path, but use EasyStar to navigate between waypoints instead of blindly charging toward them.
  'rsp', // "Rotation Speed (rsp)" (Float) Rotation speed.
  // For items
  'hld', // Held BY ID. This is the ID of the player that is currently holding this item.
  'fnc', // itemBehavior function that is called on this hadron each update
  'lid', // Last spawned unique ID. This is used to tell if a new instance should be spawned.
  'iin', // Important Item Name. Important items have special properties and are tracked.
  'dap', // Did Already Spawn. Used to track if an item already spawned after an event, so we don't do it twice before the event resets after someone takes the item.
  'uid', // "Unique ID (uid)" (String) When making a hadron from a Quark, this ID will be used, and hence only one will ever be created.
  'ces', // "Cave Exit Scene (ces)" (String) Scene a player will arrive in after exiting a scene. This is what allows entering a cave to set a new "respawn" exit point.
];

const allKeys = alwaysRequiredKeys.concat(
  serverAdditionalRequiredKeys,
  optionalKeys,
);

function validate(data) {
  alwaysRequiredKeys.forEach((key) => {
    if (!data.hasOwnProperty(key)) {
      console.error(
        `Attempt to create new hadron without required key: ${key}`,
      );
      throw new Error(`Invalid hadron`);
    }
  });

  for (const [key] of Object.entries(data)) {
    if (allKeys.indexOf(key) === -1) {
      console.error(`Attempt to create new hadron with unknown key: ${key}`);
      throw new Error(`Invalid hadron`);
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
          `Attempt to create new hadron on server without required key: ${key}`,
        );
        throw new Error(`Invalid hadron`);
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
