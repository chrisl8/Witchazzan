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
  player: null,
  destinationEntrance: null,
  keyState: {}, // keep track of the keyboard state. Send only when it changes
  // Text we want to be displayed on various (or all) scenes
  sceneText: {
    helloText: {
      text: `Hello. Press 'c' to enter commands.`, // TODO: Change to F1 or ? for Help once that exists.
      shouldBeActiveNow: true,
      location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
    },
    escapeToLeaveChat: {
      text: `Press Escape to return to game.`,
      shouldBeActiveNow: false,
      location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
    },
    connectingText: {
      text: 'Connecting to server<br/>Please wait...',
      shouldBeActiveNow: true,
      location: 'Center', // UpperLeft, 'Scrolling', or 'Center'
    },
    reconnectingText: {
      text: 'Server connection lost\nreconnecting...',
      shouldBeActiveNow: false,
      location: 'Center', // UpperLeft, 'Scrolling', or 'Center'
    },
    notConnectedCommandResponse: {
      text: 'Not connected, cannot send chat text.',
      shouldBeActiveNow: false,
      location: 'Scrolling', // UpperLeft, 'Scrolling', or 'Center'
    },
  },
  chatInputDivDomElement: document.getElementById('command_input_div'),
  chatInputCaretElement: document.getElementById('command_input_caret'),
  chatInputElement: document.getElementById('command_input'),

  // NOTE: This assumes that there is only the one Phaser canvas.
  canvasDomElement: document.getElementsByTagName('canvas'),
  // This returns on "HTMLCollection" that is "live" i.e. it updates as the DOM updates,
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
  // MEANING that you can't use it NOW, but it will be live (not empty) in places like the sceneFactory
  chatInputTextArray: [],
  scrollingTextOverlayInputText: '',
  domElements: {
    Center: document.getElementById('center_text_overlay_div'),
    UpperLeft: document.getElementById('upper_left_text_overlay_div'),
    Scrolling: document.getElementById('scrolling_text_overlay_div'),
  },
  domElementHistory: {
    Center: { style: {} },
    UpperLeft: { style: {} },
    Scrolling: { style: {} },
  },
};

export default playerObject;
