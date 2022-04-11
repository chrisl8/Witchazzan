import jwt from "jsonwebtoken";
// eslint-disable-next-line
import wait from "../shared/wait.mjs";
// eslint-disable-next-line
import makeRandomNumber from "../shared/makeRandomNumber.mjs";

async function validateJWT(token, secret, db) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        console.log("Failed to authenticate token.");
        // A somewhat random wait stalls brute force attacks and somewhat mitigates timing attacks used to guess names.
        // It also prevents client side bugs from crippling the server with inadvertent DOS attacks.
        await wait(makeRandomNumber.between(3, 5) * 1000);
        reject();
      } else {
        // We also must ensure the user exists in the database. Their account could have been deleted.
        try {
          const sql = "SELECT id FROM Users WHERE name = ?";
          const result = await db.query(sql, [decoded.name]);
          if (result.rows.length > 0 && result.rows[0].id === decoded.id) {
            console.log(`${decoded.name} authenticated a valid token`);
            const sqlInsert =
              "INSERT INTO Connections (id, timestamp) VALUES ($1, $2);";
            await db.query(sqlInsert, [
              decoded.id,
              Math.floor(new Date().getTime() / 1000),
            ]);
            resolve(decoded);
          } else {
            console.log(
              `${decoded.name} has a valid token, but is not in the database, or their UUID changed.`
            );
            reject();
          }
        } catch (e) {
          console.error("Error retrieving user:");
          console.error(e.message);
          reject(e);
        }
      }
    });
  });
}

export default validateJWT;
