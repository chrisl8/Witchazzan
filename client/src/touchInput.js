/* globals document:true */
import NippleJs from 'nipplejs';
import playerObject from './objects/playerObject.js';
import handleKeyboardInput from './handleKeyboardInput.js';

function touchInput() {
  // Get touches and use them to activate things aside from movement.
  // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
  let fingerCount = 0;
  document.body.addEventListener(
    'touchstart',
    (evt) => {
      evt.preventDefault(); // TODO: Does this fix the issue on iPhone's without buttons?
      fingerCount = evt.touches.length;
    },
    false,
  );
  document.body.addEventListener(
    'touchend',
    () => {
      if (fingerCount === 3) {
        if (playerObject.domElements.chatInputDiv.style.display === 'none') {
          handleKeyboardInput({ key: 'c', type: 'keyup' });
        } else {
          handleKeyboardInput({ key: 'Escape', type: 'keydown' });
        }
      } else if (fingerCount === 2) {
        playerObject.sendSpell = true;
      }
      fingerCount = 0;
    },
    false,
  );

  const joystick = NippleJs.create({
    zone: document.getElementById('joystick_container'),
    mode: 'static',
    position: { left: '40%', top: '50%' },
    color: 'red',
    restOpacity: 0.1,
  });
  joystick
    .on('start', () => {
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
}

export default touchInput;
