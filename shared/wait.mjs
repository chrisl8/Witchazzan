/**
 * Returns a promise that resolves after the given time in milliseconds
 * @param milliseconds - Time to wait in milliseconds
 * @returns {Promise<undefined>}
 */
async function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export default wait;
