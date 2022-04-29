/* globals document:true */
/*
 * This is an empty object for declaring and sharing the Player and its data.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object,
 * especially for your IDE.
 *
 */
const playerObject = {
  name: null,
  disableCameraZoom: false,
  initialPositionReceived: false,
  teleportInProgress: false,
  enableDebug: false,
  helpTextVersion: 13, // Increment this to force players to see the Instructions again.
  // This is the scene you start the game in,
  // and go to if a non-existent scene is requested,
  // and if you press the designated "go home" key.
  defaultOpeningScene: 'LoruleH8', // NOTE: This will be overwritten by the server upon connection.
  defaultSpriteName: 'flamingGoose', // Used when a sprite by the given name does not exist
  maxSpeed: 175,
  acceleration: 3,
  maxJoystickDistance: 50,
  player: null,
  destinationEntrance: null,
  keyState: {}, // keep track of the keyboard state. Send only when it changes

  // NOTE: This assumes that there is only the one Phaser canvas.
  canvasDomElement: document.getElementsByTagName('canvas'),
  cameraScaleFactor: 0,
  // This returns on "HTMLCollection" that is "live" i.e. it updates as the DOM updates,
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
  // MEANING that you can't use it NOW, but it will be live (not empty) in places like the gameLoopAndSceneFactory
  chatInputTextArray: [],
  externalDialogOpen: false,
  scrollingTextOverlayInputText: '',
  domElements: {
    Center: document.getElementById('center_text_overlay_div'),
    Fading: document.getElementById('fading_text_overlay_div'),
    UpperLeft: document.getElementById('upper_left_text_overlay_div'),
    Scrolling: document.getElementById('scrolling_text_overlay_div'),
    chatInputDiv: document.getElementById('command_input_div'),
    chatInputCaret: document.getElementById('command_input_caret'),
    chatInput: document.getElementById('command_input'),
    playerTag: document.getElementById('player_tag'),
    otherPlayerTagsDiv: document.getElementById('other_player_tags'),
    canvas: null, // This must be set after Phaser starts, in startGame.js
    otherPlayerTags: {},
  },
  domElementHistory: {
    Center: { style: {} },
    Fading: { style: {} },
    UpperLeft: { style: {} },
    Scrolling: { style: {} },
    playerTag: { innerHTML: null, left: null, top: null, fontSize: null },
  },
  spriteName: 'bloomby', // Default set here
  health: 100,
  playerId: null,
  playerDirection: 'left',
  playerStopped: true,
  sceneObjectList: [],
  spriteData: {},
  joystickDirection: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
  joystickDistance: 0,
  dotTrailsOn: false,
  gameTime: null,
  lastSentPlayerDataObject: {},
  scrollingTextBox: null, // Will hold the single instance of th scrolling text class
  sendSpell: false,
  chatOpen: false,
  // The order here determines the default order in the game,
  // although players can change the order in the Help screen.
  spellOptions: [
    'fireball',
    'teleball',
    'flamingGoose',
    'gloobScaryman',
    'carrot',
    'chestFront',
    'pinkTree',
    'greenTree',
    'deadTree',
    'corpse',
    'RainbowTileOne',
    'writeMessage',
  ],
  // Spell assignments is a Map in the /objects folder,
  spellKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  shiftedSpellKeys: [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '+',
  ],
  activeSpell: null,
  teleportToSceneNow: null,
  cameraOffset: {
    x: 0,
    y: 0,
  },
};

export default playerObject;
