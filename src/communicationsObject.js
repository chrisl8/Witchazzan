/*
 * This is a mostly empty object to hold the socket connection for using,
 * among all of the scenes and code.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 */

const communicationsObject = {
  // TODO: Set up the witchazzen server on the DO Droplet
  // TODO: Set this up to automatically connect to it, if it was loaded from there,
  // TODO: Otherwise connect to localhost.
  // TODO: Possibly move this to a proper config file.
  websocketServerLocation: 'ws://localhost:8080',
  // You can use this as a test websocket server that will echo back everything you tell it:
  // FROM: http://www.websocket.org/echo.html
  // websocketServerLocation: 'ws://demos.kaazing.com/echo',
  socket: null,
};

export default communicationsObject;
