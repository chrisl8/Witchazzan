/* globals window:true */
import playerObject from './objects/playerObject';
import textObject from './objects/textObject';

const updateInGameDomElements = (htmlElementParameters) => {
  const consolidatedTextObject = {
    Center: {
      text: '',
      hidden: true,
    },
    UpperLeft: {
      text: '',
      hidden: true,
    },
    Scrolling: {
      text: '',
      hidden: true,
    },
  };

  // Set up text for various text fields
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(textObject)) {
    if (value.shouldBeActiveNow) {
      consolidatedTextObject[value.location].hidden = false;
      consolidatedTextObject[value.location].text = `${
        consolidatedTextObject[value.location].text
      }${value.text}`;
    }
  }

  // Update element styles and insert text if needed.

  // Set HTML element options based on the new canvas properties
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  ['Center', 'UpperLeft', 'Scrolling'].forEach((textLocation) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style

    // Create temp object to store new settings to compare with current
    const newValueObject = {
      style: {},
    };

    // Size and color
    if (htmlElementParameters[textLocation]) {
      newValueObject.style.color =
        htmlElementParameters[textLocation].color || 'red';
      newValueObject.style.fontSize = htmlElementParameters[textLocation]
        .fontSize
        ? `${canvasHeight * htmlElementParameters[textLocation].fontSize}px`
        : '1em';
      newValueObject.style.background = htmlElementParameters[textLocation]
        .background
        ? `rgba(${htmlElementParameters[textLocation].background})`
        : 'none';
    }

    // Text and visibility from scene text list
    newValueObject.hidden = consolidatedTextObject[textLocation].hidden;
    newValueObject.innerHTML = consolidatedTextObject[textLocation].text;

    // Location for Center Text
    if (textLocation === 'Center') {
      newValueObject.style.left = `${canvasWidth / 2 -
        playerObject.domElements[textLocation].offsetWidth / 2}px`;
      newValueObject.style.top = `${canvasHeight / 2 -
        playerObject.domElements[textLocation].offsetHeight / 2}px`;
    }

    // Check settings and update if they are different
    for (const [key, value] of Object.entries(newValueObject.style)) {
      if (playerObject.domElementHistory[textLocation].style[key] !== value) {
        playerObject.domElements[textLocation].style[key] = value;
      }
    }
    for (const [key, value] of Object.entries(newValueObject)) {
      if (
        key !== 'style' &&
        playerObject.domElementHistory[textLocation][key] !== value
      ) {
        // Track scroll location for Scrolling text
        const isScrolledToBottom =
          textLocation === 'Scrolling' &&
          key === 'innerHTML' &&
          playerObject.domElements[textLocation].scrollHeight -
            playerObject.domElements[textLocation].clientHeight <=
            playerObject.domElements[textLocation].scrollTop + 1;

        playerObject.domElements[textLocation][key] = value;

        // scroll to bottom if isScrolledToBottom is true
        if (isScrolledToBottom) {
          playerObject.domElements[textLocation].scrollTop =
            playerObject.domElements[textLocation].scrollHeight;
        }
      }
    }

    // Store current settings so we do not update unless required.
    playerObject.domElementHistory[textLocation] = newValueObject;
  });
};

export default updateInGameDomElements;
