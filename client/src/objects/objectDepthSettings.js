/*
 * Keep track of what depth should be set for each type of object,
 * to ease in updating and arranging things.
 *
 * By default, everything gets depth sorted on the screen in the order we created things, which is often somewhat random.
 * Higher depths will sit on top of lower depth objects.
 *
 * It works out better to just be explicit.
 *
 */
const objectDepthSettings = {
  tileMapLayers: {
    Ground: 0,
    Water: 2,
    'Stuff on the Ground You Can Walk On': 4,
    'Stuff You Run Into': 36,
    'Stuff You Walk Under': 48,
  },
  tileMapSprites: {
    Ground: 1,
    Water: 3,
    'Stuff on the Ground You Can Walk On': 5,
    'Stuff You Run Into': 37,
    'Stuff You Walk Under': 49,
  },
  spells: 10, // Can be overridden, but this is the default.
  message: 10, // Can be overridden, but this is the default.
  animatedObjects: 15, // Can be overridden, but this is the default.
  npc: 20, // Can be overridden, but this is the default.
  item: 20, // Can be overridden, but this is the default.
  otherPlayer: 30,
  playerShadow: 31,
  dotTrails: 32,
  targetObjectHighlight: 32,
  player: 35,
  heldObject: 37,
  sceneText: 100,
};
export default objectDepthSettings;
