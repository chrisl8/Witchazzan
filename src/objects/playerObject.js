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
  helpTextVersion: 9, // Increment this to force players to see the Instructions again.
  // This is the scene you start the game in,
  // and go to if a non-existent scene is requested,
  // and if you press the 'o' key.
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
    playerNameSubmitButton: document.getElementById(
      'player_name_submit_button',
    ),
    playerNameInputBox: document.getElementById('player_name_input_box'),
    Center: document.getElementById('center_text_overlay_div'),
    UpperLeft: document.getElementById('upper_left_text_overlay_div'),
    Scrolling: document.getElementById('scrolling_text_overlay_div'),
    chatInputDiv: document.getElementById('command_input_div'),
    chatInputCaret: document.getElementById('command_input_caret'),
    chatInput: document.getElementById('command_input'),
  },
  domElementHistory: {
    Center: { style: {} },
    UpperLeft: { style: {} },
    Scrolling: { style: {} },
  },
  playerName: null,
  spriteName: 'bloomby', // Default set here
  playerId: null,
  playerDirection: 'left',
  playerStopped: true,
  otherPlayerList: [],
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
  socketCurrentlyConnected: false,
  gameTime: null,
  lastSentPlayerLocationObject: {},
  lastReceivedPlayerLocationObject: {},
  scrollingTextBox: null, // Will hold the single instance of th scrolling text class
  serverForce: false,
};

export default playerObject;
