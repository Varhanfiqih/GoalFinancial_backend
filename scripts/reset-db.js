const { createDatabaseConnection, databaseName } = require('../src/database/mysql');

async function main() {
  const dbName = databaseName();
  const connection = await createDatabaseConnection();
  await connection.query(`
    DROP TABLE IF EXISTS seeders;
    DROP TABLE IF EXISTS migrations;
    DROP TABLE IF EXISTS transactions;
    DROP TABLE IF EXISTS goals;
    DROP TABLE IF EXISTS admins;
    DROP TABLE IF EXISTS users;
  `);
  await connection.end();
  console.log(`Tabel aplikasi di ${dbName} dihapus. Jalankan npm run migrate && npm run seed untuk membuat ulang.`);
}

main().catch((error) => {
  console.error(error.code || error.name || 'ERROR');
  console.error(error.message || 'Reset database gagal.');
  process.exit(1);
});
