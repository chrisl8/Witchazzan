/*
 * This is an object for declaring and sharing Text data.
 *
 * Note that any null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 *
 */

// TODO: Fading text. Text that displays for X seconds after display.
// TODO: Sort out Scrolling text box (push old text off of the bottom).
// TODO: How to handle multiple center texts and/or "fading texts" from the same location
//       that came in at different times. e.g. Drop text off but don't fade newer
//       text.
//       Perhaps that is how it works? Text doesn't fade, but "drops off", and
//       when all text is gone from a location, that is when it "fades".
// TODO: Scrolling text box should still "fade" but keep the text it has in it,
//       maybe even be scrollable . . . or not.

const textObject = {
  helloText: {
    text: `Hello. Press 'c' to enter commands.`,
    shouldBeActiveNow: false,
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
    activeTime: 0,
    timeout: 20000,
  },
};

export default textObject;
