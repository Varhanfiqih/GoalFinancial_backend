const { hashPassword } = require('../../src/utils/auth');

async function seed(connection) {
  const [existingAdmins] = await connection.execute('SELECT id FROM admins WHERE email = ?', ['admin@ethena.local']);
  if (existingAdmins.length > 0) {
    return;
  }

  const now = new Date();
  const password = hashPassword('admin123');
  await connection.execute(
    `INSERT INTO admins
     (id, full_name, email, password_hash, salt, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['admin_default', 'Ethena Administrator', 'admin@ethena.local', password.hash, password.salt, 'admin', now, now],
  );
}

module.exports = { seed };
