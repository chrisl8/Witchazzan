/*
 * This is an object for declaring and sharing Text data.
 *
 * Note that any null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 *
 */

const textObject = {
  helloText: {
    text: `Hello. Press 'c' to enter commands.`, // TODO: Change to F1 or ? for Help once that exists.
    shouldBeActiveNow: true,
    location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
  },
  escapeToLeaveChat: {
    text: `Press Escape to return to game, use / to send commands, /run to run a function`,
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
  incomingChatText: {
    text: '',
    shouldBeActiveNow: false,
    location: 'Scrolling', // UpperLeft, 'Scrolling', or 'Center'
  },
};

export default textObject;
