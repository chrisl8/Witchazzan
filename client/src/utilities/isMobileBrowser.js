/* globals navigator:true */
// Most mobile devices, other than the newer iPads:
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isMobileBrowser =
  isMobile ||
  // Some devices now return a userAgentData.mobile
  (navigator.userAgentData && navigator.userAgentData.mobile) ||
  // Apple wants the latest iPads to just be "desktops", but of course, they have touch screens and no keyboard.
  // https://stackoverflow.com/a/58979271/4982408
  (navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform));

export default isMobileBrowser;
