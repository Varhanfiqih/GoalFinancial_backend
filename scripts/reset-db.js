const { createServerConnection, databaseName } = require('../src/database/mysql');

async function main() {
  const dbName = databaseName();
  const connection = await createServerConnection();
  await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
  await connection.end();
  console.log(`Database ${dbName} dihapus. Jalankan npm run migrate && npm run seed untuk membuat ulang.`);
}

main().catch((error) => {
  console.error(error.code || error.name || 'ERROR');
  console.error(error.message || 'Reset database gagal.');
  process.exit(1);
});
