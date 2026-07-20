try {
  require('dotenv').config();
} catch {
  // dotenv is optional during syntax checks before npm install.
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-for-production',
  db: {
    host: process.env.TIDB_HOST || process.env.DB_HOST || 'localhost',
    port: Number(process.env.TIDB_PORT || process.env.DB_PORT || 3306),
    user: process.env.TIDB_USER || process.env.DB_USER || 'root',
    password: process.env.TIDB_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.TIDB_DATABASE || process.env.DB_NAME || 'ethena_db',
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 5000),
    ssl: shouldUseSsl() ? { minVersion: 'TLSv1.2' } : undefined,
    namedPlaceholders: true,
  },
};

function shouldUseSsl() {
  if (process.env.DB_SSL === 'false' || process.env.TIDB_ENABLE_SSL === 'false') return false;
  return process.env.DB_SSL === 'true' || process.env.TIDB_ENABLE_SSL === 'true' || Boolean(process.env.TIDB_HOST);
}
