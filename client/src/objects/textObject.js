/* globals $:true */
/*
 * This is an object for declaring and sharing Text data.
 *
 * Note that any null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 *
 */

import _ from 'lodash';

const textObject = {
  escapeToLeaveChat: {
    text: `Press Escape to return to game, use / to send commands.`,
    shouldBeActiveNow: false,
    location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
  },
  incomingChatText: {
    text: '<span style="color: black;">Chat/Command Log</span>',
    shouldBeActiveNow: false,
    location: 'Scrolling', // UpperLeft, 'Scrolling', or 'Center'
  },
  spellSetText: {
    text: '',
    shouldBeActiveNow: false,
    location: 'UpperLeft', // UpperLeft, 'Scrolling', or 'Center'
    disappearMessageLater: _.debounce(() => {
      textObject.spellSetText.shouldBeActiveNow = false;
    }, 1000),
  },
  enterSceneText: {
    text: 'We wandered in darkness...',
    location: 'Fading', // UpperLeft, 'Scrolling', or 'Center'
    shouldBeActiveNow: true,
    display: () => {
      $('#fading_text_overlay_div')
        .stop(true, true)
        .hide()
        .delay(100)
        .fadeIn({
          duration: 1000,
          complete: () => {
            $('#fading_text_overlay_div').delay(5000).fadeOut({
              duration: 1000,
            });
          },
        });
    },
  },
};

export default textObject;
