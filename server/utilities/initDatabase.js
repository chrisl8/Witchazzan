async function initDatabase(db) {
  async function addOrUpdateTable({ tableName, columns }) {
    try {
      let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
      let needComma;
      for (const [key, value] of Object.entries(columns)) {
        if (needComma) {
          createTableQuery = `${createTableQuery},`;
        }
        createTableQuery = `${createTableQuery} ${key} ${value}`;
        needComma = true;
      }
      createTableQuery = `${createTableQuery})`;
      await db.query(createTableQuery, []);
      const tableInfo = await db.query(`PRAGMA table_info(${tableName})`, []);
      // Add any missing columns to existing tables.
      for (const [key, value] of Object.entries(columns)) {
        if (tableInfo.rows.findIndex((x) => x.name === key) === -1) {
          console.log(`Adding ${key} column to ${tableName} table.`);
          // eslint-disable-next-line no-await-in-loop
          await db.query(
            `ALTER TABLE ${tableName} ADD COLUMN ${key} ${value}`,
            [],
          );
        }
      }
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }

  // Database initialization.
  // Creating the users table if it does not exist.
  await addOrUpdateTable({
    tableName: 'users',
    columns: {
      id: 'TEXT PRIMARY KEY',
      name: 'TEXT NOT NULL',
      password: 'TEXT NOT NULL',
      admin: 'INTEGER DEFAULT 0',
      last_connection: 'INTEGER',
      guest: 'INTEGER DEFAULT 0',
      deleted: 'INTEGER DEFAULT 0',
    },
  });
  // Displaying the user table count for fun and debugging.
  try {
    const result = await db.query('SELECT COUNT(*) AS count FROM Users', []);
    const count = result.rows[0].count;
    console.log('Registered user count from database:', count);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  // Creating the Connections table if it does not exist.
  await addOrUpdateTable({
    tableName: 'Connections',
    columns: {
      id: 'TEXT',
      timestamp: 'INTEGER',
      ip: 'TEXT',
    },
  });
}

export default initDatabase;
