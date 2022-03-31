/*
 * This is the Scrolling Text box.
 * Everything related to it is here.
 */

import textObject from './objects/textObject';
import playerObject from './objects/playerObject';

// TODO: Sort out Scrolling text box (push old text off of the bottom).
// TODO: How to handle multiple center texts and/or "fading texts" from the same location
//       that came in at different times. e.g. Drop text off but don't fade newer
//       text.
//       Perhaps that is how it works? Text doesn't fade, but "drops off", and
//       when all text is gone from a location, that is when it "fades".
// TODO: Scrolling text box should still "fade" but keep the text it has in it,
//       maybe even be scrollable . . . or not.

class ScrollingTextBox {
  constructor() {
    this.timeoutEnabled = true;
    this.activeTime = 0;
    this.timeout = 10 * 1000;
  }

  sceneUpdate = (delta) => {
    // Timeout chat log window if chat input is not open.
    if (
      this.timeoutEnabled &&
      textObject.incomingChatText.shouldBeActiveNow &&
      playerObject.domElements.chatInputDiv.style.display === 'none'
    ) {
      this.activeTime += delta;
      if (this.activeTime > this.timeout) {
        this.activeTime = 0;
        textObject.incomingChatText.shouldBeActiveNow = false;
      }
    }
  };

  chat(inputData) {
    if (textObject.incomingChatText.text !== '') {
      // Add a line break if there is existing text.
      textObject.incomingChatText.text = `${textObject.incomingChatText.text}<br/>`;
    }
    const sender = inputData.name ? `${inputData.name}: ` : '';
    textObject.incomingChatText.text = `${textObject.incomingChatText.text}${sender}${inputData.content}`;
    textObject.incomingChatText.shouldBeActiveNow = true;
  }

  display = (enableTimeout) => {
    this.timeoutEnabled = enableTimeout;
    if (textObject.incomingChatText.text !== '') {
      textObject.incomingChatText.shouldBeActiveNow =
        !textObject.incomingChatText.shouldBeActiveNow;
      this.activeTime = 0;
    }
  };

  hide() {
    textObject.incomingChatText.shouldBeActiveNow = false;
    this.timeoutEnabled = true;
  }
}

export default ScrollingTextBox;
