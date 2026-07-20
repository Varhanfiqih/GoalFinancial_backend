const mysql = require('mysql2/promise');
const path = require('node:path');

try {
  require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
} catch {
  // dotenv is installed with npm install.
}

function baseConnectionConfig() {
  return {
    host: process.env.DB_HOST || process.env.TIDB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.TIDB_PORT || 3306),
    user: process.env.DB_USER || process.env.TIDB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.TIDB_PASSWORD || '',
    multipleStatements: true,
    ssl: shouldUseSsl() ? { minVersion: 'TLSv1.2' } : undefined,
  };
}

function databaseName() {
  return process.env.DB_NAME || process.env.TIDB_DATABASE || 'ethena_db';
}

function shouldUseSsl() {
  if (process.env.DB_SSL === 'false' || process.env.TIDB_ENABLE_SSL === 'false') return false;
  return process.env.DB_SSL === 'true' || process.env.TIDB_ENABLE_SSL === 'true' || Boolean(process.env.TIDB_HOST);
}

async function createServerConnection() {
  return mysql.createConnection(baseConnectionConfig());
}

async function createDatabaseConnection() {
  return mysql.createConnection({
    ...baseConnectionConfig(),
    database: databaseName(),
  });
}

module.exports = {
  createServerConnection,
  createDatabaseConnection,
  databaseName,
};
