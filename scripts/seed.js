const fs = require('node:fs');
const path = require('node:path');
const { createDatabaseConnection, databaseName } = require('../src/database/mysql');

async function main() {
  const connection = await createDatabaseConnection();
  await connection.query(`
    CREATE TABLE IF NOT EXISTS seeders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const seedersDir = path.join(__dirname, '..', 'database', 'seeders');
  const files = fs.readdirSync(seedersDir).filter((file) => file.endsWith('.js')).sort();

  for (const file of files) {
    const [existing] = await connection.execute('SELECT id FROM seeders WHERE name = ? LIMIT 1', [file]);
    if (existing.length > 0) {
      console.log(`Skip seeder: ${file}`);
      continue;
    }

    const seeder = require(path.join(seedersDir, file));
    await seeder.seed(connection);
    await connection.execute('INSERT INTO seeders (name) VALUES (?)', [file]);
    console.log(`Run seeder: ${file}`);
  }

  await connection.end();
  console.log(`Seeder selesai untuk database ${databaseName()}.`);
}

main().catch((error) => {
  console.error(error.code || error.name || 'ERROR');
  console.error(error.message || 'Seeder gagal.');
  process.exit(1);
});
