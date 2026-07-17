try {
  require('dotenv').config();
} catch {
  // dotenv is optional during syntax checks before npm install.
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-for-production',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ethena_db',
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  },
};
