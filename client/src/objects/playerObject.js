/* globals document:true */
/*
 * This is an empty object for declaring and sharing the Player and its data.
 * I am also currently putting the keyState in this object.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 *
 */
const playerObject = {
  disableCameraZoom: false,
  initialPositionReceived: false,
  helpTextVersion: 12, // Increment this to force players to see the Instructions again.
  // This is the scene you start the game in,
  // and go to if a non-existent scene is requested,
  // and if you press the designated "go home" key.
  defaultOpeningScene: 'LoruleH8',
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
  // MEANING that you can't use it NOW, but it will be live (not empty) in places like the sceneFactory
  chatInputTextArray: [],
  scrollingTextOverlayInputText: '',
  domElements: {
    Center: document.getElementById('center_text_overlay_div'),
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
    UpperLeft: { style: {} },
    Scrolling: { style: {} },
    playerTag: { innerHTML: null, left: null, top: null, fontSize: null },
  },
  spriteName: 'bloomby', // Default set here
  playerId: null,
  playerDirection: 'left',
  playerStopped: true,
  spawnedObjectList: {},
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
  spellOptions: ['fireball', 'teleball', 'push'],
  spellAssignments: {
    1: 0,
    2: 1,
    3: 2,
  }, // Keyboard keys 1 to 9
  activeSpellKey: 0,
  teleportToSceneNow: null,
  cameraOffset: {
    x: 0,
    y: 0,
  },
};

export default playerObject;
