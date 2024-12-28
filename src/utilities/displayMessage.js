import debounce from 'lodash/debounce.js';
import textObject from '../objects/textObject.js';

let messageToDisplay;
const displayThisMessage = () => {
  textObject.enterSceneText.text = messageToDisplay;
  textObject.enterSceneText.display();
};
const throttleDisplayMessage = debounce(displayThisMessage, 1000, {
  leading: true,
  trailing: false,
});

export const setMessage = (message) => {
  messageToDisplay = message;
};

export const displayMessage = () => {
  throttleDisplayMessage();
};
