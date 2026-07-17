const { hashPassword } = require('../../src/utils/auth');

async function seed(connection) {
  const [existingUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', ['alex.morgan@example.com']);
  if (existingUsers.length > 0) {
    return;
  }

  const now = new Date();
  const password = hashPassword('password123');

  await connection.execute(
    `INSERT INTO users
     (id, full_name, email, password_hash, salt, biometric_login, dark_mode, notifications, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['user_demo', 'Alex Morgan', 'alex.morgan@example.com', password.hash, password.salt, 1, 0, 1, now, now],
  );

  await connection.execute(
    `INSERT INTO goals
     (id, user_id, title, category, saved_amount, target_amount, target_date, status, completed_at, created_at, updated_at)
     VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'goal_macbook', 'user_demo', 'Macbook Pro', 'Electronics', 7450, 10000, '2024-12-20', 'active', null, now, now,
      'goal_emergency', 'user_demo', 'Emergency Fund', 'Emergency Fund', 5000, 10000, null, 'active', null, now, now,
      'goal_japan', 'user_demo', 'Japan Trip 2024', 'Travel', 3200, 5000, '2024-10-15', 'active', null, now, now,
      'goal_bicycle', 'user_demo', 'New Bicycle', 'Lifestyle', 800, 800, null, 'completed', new Date('2024-03-20'), now, now,
    ],
  );

  await connection.execute(
    `INSERT INTO transactions
     (id, user_id, goal_id, title, type, amount, category, notes, proof_url, transaction_date)
     VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'trx_daily_save', 'user_demo', 'goal_emergency', 'Daily Save', 'income', 15, 'Salary', '', null, now,
      'trx_withdrawal', 'user_demo', null, 'Withdrawal', 'outcome', 120, 'Car Repair', '', null, new Date(Date.now() - 2 * 60 * 60 * 1000),
      'trx_bonus', 'user_demo', 'goal_japan', 'Bonus Save', 'income', 50, 'Bonus', '', null, new Date(Date.now() - 24 * 60 * 60 * 1000),
      'trx_round_up', 'user_demo', 'goal_emergency', 'Round Up', 'income', 0.85, 'Other', '', null, new Date(Date.now() - 27 * 60 * 60 * 1000),
    ],
  );
}

module.exports = { seed };
