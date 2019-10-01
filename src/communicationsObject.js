/*
 * This is a mostly empty object to hold the socket connection for using,
 * among all of the scenes and code.
 *
 * Note that the null entries are NOT required,
 * but they make it a little easier to know what to expect to find in this object.
 */

const communicationsObject = {
  websocketServerLocation: 'ws://localhost:8080',
  // You can use this as a test websocket server that will echo back everything you tell it:
  // FROM: http://www.websocket.org/echo.html
  // websocketServerLocation: 'ws://demos.kaazing.com/echo',
  socket: null,
};

export default communicationsObject;
