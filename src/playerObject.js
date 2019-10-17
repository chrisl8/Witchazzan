/*
 * This is an empty object for declaring and sharing the Player and its data.
 * I am also currently putting the keyState in this object.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 *
 * TODO: Should this be "more generic", or should we make more "global" objects?
 */
const playerObject = {
  player: null,
  destinationEntrance: null,
  keyState: {}, // keep track of the keyboard state. Send only when it changes
  // Text we want to be displayed on various (or all) scenes
  sceneText: {
    helloText: {
      text: 'Hello',
      position: {
        x: 25,
        y: 25,
      },
      // Pass config on to the Phaser text routine
      config: { color: '#00f' },
      shouldBeActiveNow: true,
      hasBeenDisplayedInThisScene: false,
      phaserSceneObject: null, // Save .text object here so that we can access it later.
    },
    connectingText: {
      text: 'Connecting to server\nPlease wait...',
      // Pass config on to the Phaser text routine
      config: { color: '#f00' },
      shouldBeActiveNow: true,
      hasBeenDisplayedInThisScene: false,
      phaserSceneObject: null, // Save .text object here so that we can access it later.
    },
    reconnectingText: {
      text: 'Server connection lost\nreconnecting...',
      // Pass config on to the Phaser text routine
      config: { color: '#f00' },
      shouldBeActiveNow: false,
      hasBeenDisplayedInThisScene: false,
      phaserSceneObject: null, // Save .text object here so that we can access it later.
    },
  },
  chatInputDivDomElement: null,
  chatInputElement: null,
  chatInputTextArray: [],
  scrollingTextOverlayDivDomElement: null,
  scrollingTextOverlayInput: null,
  scrollingTextOverlayInputText: '',
};

export default playerObject;
