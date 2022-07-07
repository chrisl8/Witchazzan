/* globals document:true */
/* globals localStorage:true */
import NippleJs from 'nipplejs';
import playerObject from './objects/playerObject.js';
import handleKeyboardInput from './handleKeyboardInput.js';
import spellAssignments from './objects/spellAssignments.js';
import textObject from './objects/textObject.js';
import fancyNames from '../../shared/fancyNames.mjs';

function handleTouchInput() {
  // Absorb touch events in areas we don't want the mobile device to start selecting/highlighting everything
  // Otherwise holding your finger on the screen makes a mess on iOS
  function absorbEvent(event) {
    event.preventDefault();
  }
  function absorbEventsFor(element, partial) {
    element.addEventListener('touchmove', absorbEvent);
    if (!partial) {
      element.addEventListener('touchstart', absorbEvent);
      element.addEventListener('touchend', absorbEvent);
      element.addEventListener('touchcancel', absorbEvent);
    }
  }
  absorbEventsFor(document.querySelector('#joystick_container'));
  absorbEventsFor(document.querySelector('#second_stick_container'));

  // Create twin sticks
  const joystick = NippleJs.create({
    zone: document.getElementById('joystick_container'),
    mode: 'semi',
    catchDistance: 50,
    color: 'blue',
    restOpacity: 0.9,
    follow: true,
  });
  joystick
    .on('start', () => {
      // Always close the chat box when joystick starts
      if (playerObject.domElements.chatInputDiv.style.display !== 'none') {
        handleKeyboardInput({ key: 'Escape', type: 'keydown' });
      }
      playerObject.joystickDirection = {
        left: false,
        right: false,
        up: false,
        down: false,
      };
      playerObject.joystickDistance = 0;
    })
    .on('end', () => {
      playerObject.joystickDirection = {
        left: false,
        right: false,
        up: false,
        down: false,
      };
      playerObject.joystickDistance = 0;
    })
    .on('move', (evt, data) => {
      const angle = data.angle.degree;
      let distance = 0;
      /*
       0 = right
       90 = up
       180 = left
       270 = down
       */
      let left = false;
      let right = false;
      let up = false;
      let down = false;
      if (data.distance > 10) {
        // "deadzone"
        distance = data.distance;
        if ((angle >= 0 && angle < 22) || angle >= 335) {
          right = true;
        } else if (angle >= 22 && angle < 66) {
          right = true;
          up = true;
        } else if (angle >= 66 && angle < 110) {
          up = true;
        } else if (angle >= 110 && angle < 155) {
          left = true;
          up = true;
        } else if (angle >= 155 && angle < 200) {
          left = true;
        } else if (angle >= 200 && angle < 245) {
          left = true;
          down = true;
        } else if (angle >= 245 && angle < 290) {
          down = true;
        } else if (angle >= 290 && angle < 335) {
          right = true;
          down = true;
        }
      }
      playerObject.joystickDirection = {
        left,
        right,
        up,
        down,
      };
      playerObject.joystickDistance = distance;
    });

  let secondJoystickMoved;
  let keyboardInput;
  let spellKey;

  function lookForSpellNumber(spellNumber) {
    if (playerObject.spellKeys[spellNumber]) {
      spellKey = playerObject.spellKeys[spellNumber];
      const possibleSpell = spellAssignments.get(
        playerObject.spellKeys[spellNumber],
      );
      textObject.spellSetText.text = `Spell: ${fancyNames(possibleSpell)}?`;
      textObject.spellSetText.shouldBeActiveNow = true;
    }
  }

  const secondStick = NippleJs.create({
    zone: document.getElementById('second_stick_container'),
    mode: 'semi',
    catchDistance: 50,
    color: 'red',
    restOpacity: 0.9,
    follow: true,
  });
  secondStick
    .on('start', () => {
      secondJoystickMoved = false;
      keyboardInput = null;
      spellKey = null;
    })
    .on('end', () => {
      // Always close the chat box when joystick starts
      if (playerObject.domElements.chatInputDiv.style.display !== 'none') {
        handleKeyboardInput({ key: 'Escape', type: 'keydown' });
      } else {
        if (!secondJoystickMoved) {
          playerObject.sendSpell = true;
        }
        if (keyboardInput) {
          if (keyboardInput === 'c') {
            // NOTE: 'c' needs a keyup, the rest work with down.
            handleKeyboardInput({ key: 'c', type: 'keyup' });
          } else {
            handleKeyboardInput({ key: keyboardInput, type: 'keydown' });
          }
        }
        // Set this false now, because the spellKey might set it true again.
        textObject.spellSetText.shouldBeActiveNow = false;
        if (spellKey) {
          if (spellAssignments.has(spellKey)) {
            playerObject.activeSpell = spellAssignments.get(spellKey);
          } else {
            // Catch keys that are outside of currently assigned list.
            playerObject.activeSpell = spellAssignments.get(
              playerObject.spellKeys[0],
            );
          }
          localStorage.setItem(`activeSpell`, playerObject.activeSpell);
          textObject.spellSetText.text = fancyNames(playerObject.activeSpell);
          textObject.spellSetText.shouldBeActiveNow = true;
          textObject.spellSetText.disappearMessageLater();
        }
      }
    })
    .on('move', (evt, data) => {
      // Always close the chat box when joystick starts
      if (playerObject.domElements.chatInputDiv.style.display === 'none') {
        const angle = data.angle.degree;
        /*
         0 = right
         90 = up
         180 = left
         270 = down
         */
        let direction;
        if (data.distance > 30) {
          // "deadzone" Larger for this "selection" stick than for the movement stick on the left.
          secondJoystickMoved = true;
          // Defining 8 positions for operations. You can divide it up more or less later if you like.
          if ((angle >= 0 && angle < 22) || angle >= 335) {
            direction = 0; // right
          } else if (angle >= 22 && angle < 66) {
            direction = 1; // up/right
          } else if (angle >= 66 && angle < 110) {
            direction = 2; // up
          } else if (angle >= 110 && angle < 155) {
            direction = 3; // up/left
          } else if (angle >= 155 && angle < 200) {
            direction = 4; // left
          } else if (angle >= 200 && angle < 245) {
            direction = 5; // down/left
          } else if (angle >= 245 && angle < 290) {
            direction = 6; // down
          } else if (angle >= 290 && angle < 335) {
            direction = 7; // down/right
          }
        } else {
          direction = null;
        }

        switch (direction) {
          case 0:
            keyboardInput = 'p';
            textObject.spellSetText.text = 'Exit?';
            textObject.spellSetText.shouldBeActiveNow = true;
            break;
          case 2:
            lookForSpellNumber(1);
            break;
          case 4:
            lookForSpellNumber(0);
            break;
          case 6:
            keyboardInput = 'c';
            textObject.spellSetText.text = 'Chat?';
            textObject.spellSetText.shouldBeActiveNow = true;
            break;
          default:
            textObject.spellSetText.shouldBeActiveNow = false;
            keyboardInput = null;
        }

        // playerObject.joystickDirection = {
        //   left,
        //   right,
        //   up,
        //   down,
        // };
        // playerObject.joystickDistance = distance;
      }
    });
}

export default handleTouchInput;
