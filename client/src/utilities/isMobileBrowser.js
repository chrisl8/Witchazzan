/* globals navigator:true */

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isMobileBrowser =
  isMobile || (navigator.userAgentData && navigator.userAgentData.mobile);

export default isMobileBrowser;
