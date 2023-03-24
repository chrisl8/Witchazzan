import jwt from 'jsonwebtoken';

async function validateJWT({ token, secret, db, remoteIp, logIt = true }) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        reject(new Error('Failed to authenticate token.'));
      } else {
        // We also must ensure the user exists in the database. Their account could have been deleted.
        try {
          // LIKE allows for case insensitive name comparison.
          // User names shouldn't be case sensitive.
          const sql = 'SELECT id FROM Users WHERE name LIKE ?';
          const result = await db.query(sql, [decoded.name]);
          if (result.rows.length > 0 && result.rows[0].id === decoded.id) {
            console.log(
              `${decoded.name} authenticated a valid token from ${remoteIp}`,
            );
            if (logIt) {
              const timeStamp = Math.floor(new Date().getTime() / 1000);
              // Log connection
              await db.query(
                'INSERT INTO Connections (id, timestamp, ip) VALUES ($1, $2, $3);',
                [decoded.id, timeStamp, remoteIp],
              );
              // Log last connection time for user
              await db.query(
                'UPDATE Users SET last_connection = $1 WHERE id = $2',
                [timeStamp, decoded.id],
              );
            }
            resolve(decoded);
          } else {
            console.log(
              `${decoded.name} has a valid token, but is not in the database, or their UUID changed.`,
            );
            reject();
          }
        } catch (e) {
          console.error('Error retrieving user during token validation:');
          console.error(e.message);
          reject(e);
        }
      }
    });
  });
}

export default validateJWT;
