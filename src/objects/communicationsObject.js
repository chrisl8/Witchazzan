/* globals window:true */
/*
 * This is a mostly empty object to hold the socket connection for using,
 * among all of the scenes and code.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 */
const communicationsObject = {
  urlPrefix: 'http://',
  domainName: `${window.location.hostname}:8080`,
  websocketServerString: `ws://${window.location.hostname}:8080`,
  // You can use this as a test websocket server that will echo back everything you tell it:
  // websocketServerString: 'ws://demos.kaazing.com/echo',
  // FROM: http://www.websocket.org/echo.html
  socket: {},
  status: {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  },
};

if (window.location.hostname === 'www.witchazzan.space') {
  // The production instance uses a different domain name for the server,
  // and uses SSL which requires the 'wss' prefix.
  communicationsObject.urlPrefix = 'https://';
  communicationsObject.domainName = 'server.witchazzan.space';
  communicationsObject.websocketServerString = `wss://${communicationsObject.domainName}`;
}

communicationsObject.apiURL = `${communicationsObject.urlPrefix}${communicationsObject.domainName}/api`;

export default communicationsObject;
