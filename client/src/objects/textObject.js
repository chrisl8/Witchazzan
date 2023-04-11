/*
 * This is an object for declaring and sharing Text data.
 *
 * Note that any null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 *
 */

/* globals document:true */
import debounce from 'lodash/debounce.js';

const fadingTextOverlayDiv = document.getElementById('fading_text_overlay_div');
let fadeOutTimer;

const textObject = {
  escapeToLeaveChat: {
    text: `Press Escape to return to game, use / to send commands.`,
    shouldBeActiveNow: false,
    location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
  },
  coordinates: {
    text: '',
    shouldBeActiveNow: false,
    location: 'Coordinates',
  },
  incomingChatText: {
    text: '<span style="color: black;">Chat/Command Log &#x1F600;</span>',
    shouldBeActiveNow: false,
    location: 'Scrolling', // UpperLeft, 'Scrolling', or 'Center'
  },
  spellSetText: {
    text: '',
    shouldBeActiveNow: false,
    location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
    disappearMessageLater: debounce(() => {
      textObject.spellSetText.shouldBeActiveNow = false;
    }, 1000),
  },
  enterSceneText: {
    text: 'We wandered in darkness...',
    location: 'Fading', // UpperLeft, 'Scrolling', or 'Center'
    shouldBeActiveNow: true,
    display: () => {
      clearTimeout(fadeOutTimer);
      fadingTextOverlayDiv.classList.remove('fade');
      fadeOutTimer = setTimeout(() => {
        fadingTextOverlayDiv.classList.add('fade');
      }, 4000);
    },
  },
};

export default textObject;
