/* globals navigator:true */
// Most mobile devices, other than the newer iPads:
// TODO: Should we detect Raspberry Pi and force mobile on the Phaser config?
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isMobileBrowser =
  isMobile ||
  // Some devices now return a userAgentData.mobile
  (navigator.userAgentData && navigator.userAgentData.mobile) ||
  // Apple wants the latest iPads to just be "desktops", but of course, they typically have touch screens and no keyboard.
  // https://stackoverflow.com/a/58979271/4982408
  // This works until Apple release a Macbook with a touchscreen
  (navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform));

export default isMobileBrowser;
