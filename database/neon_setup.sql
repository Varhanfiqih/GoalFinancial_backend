CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(64) NOT NULL,
  biometric_login SMALLINT NOT NULL DEFAULT 0,
  dark_mode SMALLINT NOT NULL DEFAULT 0,
  notifications SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(64) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Other',
  saved_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  target_amount DECIMAL(14,2) NOT NULL,
  target_date DATE NULL,
  cover_url TEXT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  goal_id VARCHAR(64) NULL,
  title VARCHAR(160) NOT NULL,
  type VARCHAR(24) NOT NULL CHECK (type IN ('income', 'outcome')),
  amount DECIMAL(14,2) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Other',
  notes TEXT NULL,
  proof_url TEXT NULL,
  transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seeders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date);

INSERT INTO migrations (name) VALUES
  ('001_create_core_tables.sql'),
  ('002_create_admins_table.sql')
ON CONFLICT (name) DO NOTHING;

INSERT INTO seeders (name) VALUES
  ('001_demo_data.js'),
  ('002_admin_user.js')
ON CONFLICT (name) DO NOTHING;

INSERT INTO admins
  (id, full_name, email, password_hash, salt, role, created_at, updated_at)
VALUES
  (
    'admin_default',
    'Ethena Administrator',
    'admin@ethena.local',
    '9fb1d498b2c71d4a0eb1143bcb3b90f38a99a6b7e7b38efdedd701e8000ead56c74e4be8a97c1b37b73e4d6516356f0bc23703c432200c4c6dfeb104724495fd',
    'e2c73101d770afda07f9da9fd4a1404b',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT (email) DO NOTHING;

INSERT INTO users
  (id, full_name, email, password_hash, salt, biometric_login, dark_mode, notifications, created_at, updated_at)
VALUES
  (
    'user_demo',
    'Alex Morgan',
    'alex.morgan@example.com',
    'bcdb7bf8ea443dbc04f8efd66518e3153673abd350739518d791db83593d9a69c60c2bcb94e7dafdf8cb00f16ebd866c2590583f7949d28d9d0925bf64a688e2',
    '1d473bafb18e1cc01814a2a09dde3a5b',
    1,
    0,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT (email) DO NOTHING;

INSERT INTO goals
  (id, user_id, title, category, saved_amount, target_amount, target_date, status, completed_at, created_at, updated_at)
VALUES
  ('goal_macbook', 'user_demo', 'Macbook Pro', 'Electronics', 7450, 10000, DATE '2024-12-20', 'active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('goal_emergency', 'user_demo', 'Emergency Fund', 'Emergency Fund', 5000, 10000, NULL, 'active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('goal_japan', 'user_demo', 'Japan Trip 2024', 'Travel', 3200, 5000, DATE '2024-10-15', 'active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('goal_bicycle', 'user_demo', 'New Bicycle', 'Lifestyle', 800, 800, NULL, 'completed', TIMESTAMP '2024-03-20 00:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO transactions
  (id, user_id, goal_id, title, type, amount, category, notes, proof_url, transaction_date)
VALUES
  ('trx_daily_save', 'user_demo', 'goal_emergency', 'Daily Save', 'income', 15, 'Salary', '', NULL, CURRENT_TIMESTAMP),
  ('trx_withdrawal', 'user_demo', NULL, 'Withdrawal', 'outcome', 120, 'Car Repair', '', NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
  ('trx_bonus', 'user_demo', 'goal_japan', 'Bonus Save', 'income', 50, 'Bonus', '', NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('trx_round_up', 'user_demo', 'goal_emergency', 'Round Up', 'income', 0.85, 'Other', '', NULL, CURRENT_TIMESTAMP - INTERVAL '27 hours')
ON CONFLICT (id) DO NOTHING;
