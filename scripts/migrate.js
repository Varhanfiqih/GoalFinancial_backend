const fs = require('node:fs');
const path = require('node:path');
const { createDatabaseConnection, databaseName } = require('../src/database/mysql');

async function main() {
  const dbName = databaseName();
  const connection = await createDatabaseConnection();
  await connection.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const [existing] = await connection.execute('SELECT id FROM migrations WHERE name = ? LIMIT 1', [file]);
    if (existing.length > 0) {
      console.log(`Skip migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await connection.query(sql);
    await connection.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
    console.log(`Run migration: ${file}`);
  }

  await connection.end();
  console.log(`Migration selesai untuk database ${dbName}.`);
}

main().catch((error) => {
  console.error(error.code || error.name || 'ERROR');
  console.error(error.message || 'Migration gagal.');
  process.exit(1);
});
