/* globals window:true */
/*
 * This is a mostly empty object to hold the socket connection for using,
 * among all of the scenes and code.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 */
const communicationsObject = {
  // TODO: Possibly move this to a proper config file.
  websocketServerString: `ws://${window.location.hostname}:8080`,
  // You can use this as a test websocket server that will echo back everything you tell it:
  // websocketServerString: 'ws://demos.kaazing.com/echo',
  // FROM: http://www.websocket.org/echo.html
  socket: {},
};

if (window.location.hostname === 'witchazzan.ekpyroticfrood.net') {
  communicationsObject.websocketServerString = `wss://witchazzan-server.ekpyroticfrood.net`;
}

export default communicationsObject;
