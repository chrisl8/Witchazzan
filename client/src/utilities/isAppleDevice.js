/* globals navigator:true */
export default /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  // Apple wants the latest iPads to just be "desktops", but of course, they have touch screens and no keyboard.
  (navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform));
