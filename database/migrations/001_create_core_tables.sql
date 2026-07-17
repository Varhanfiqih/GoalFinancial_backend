CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(64) NOT NULL,
  biometric_login TINYINT(1) NOT NULL DEFAULT 0,
  dark_mode TINYINT(1) NOT NULL DEFAULT 0,
  notifications TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  status ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  goal_id VARCHAR(64) NULL,
  title VARCHAR(160) NOT NULL,
  type ENUM('income', 'outcome') NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Other',
  notes TEXT NULL,
  proof_url TEXT NULL,
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
