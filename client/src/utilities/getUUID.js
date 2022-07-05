/* globals crypto:true */
/*
crypto.randomUUID is built into all modern browsers, BUT
1. If you aren't using HTTPS it won't work, which is common when testing. There is a caveat for "localhost", but not for just using a private IP on your home network, which I do when testing.
2. If you are on a corporate "ESR" release of a browser like Firefox, you might not have crypto.randomUUID yet.

So this uses the uuid package when required, and uses the built in browser function otherwise,
keeping everything working as much as possible.
 */
import { v4 as uuidv4 } from 'uuid';

function getUUID() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return uuidv4();
}

export default getUUID;
