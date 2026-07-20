try {
  require('dotenv').config();
} catch {
  // dotenv is optional during syntax checks before npm install.
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-for-production',
  db: {
    host: process.env.DB_HOST || process.env.TIDB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.TIDB_PORT || 3306),
    user: process.env.DB_USER || process.env.TIDB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.TIDB_PASSWORD || '',
    database: process.env.DB_NAME || process.env.TIDB_DATABASE || 'ethena_db',
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
