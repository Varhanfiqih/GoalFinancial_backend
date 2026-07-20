const mysql = require('mysql2/promise');
const path = require('node:path');

try {
  require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
} catch {
  // dotenv is installed with npm install.
}

function baseConnectionConfig() {
  return {
    host: process.env.TIDB_HOST || process.env.DB_HOST || 'localhost',
    port: Number(process.env.TIDB_PORT || process.env.DB_PORT || 3306),
    user: process.env.TIDB_USER || process.env.DB_USER || 'root',
    password: process.env.TIDB_PASSWORD || process.env.DB_PASSWORD || '',
    multipleStatements: true,
    ssl: shouldUseSsl() ? { minVersion: 'TLSv1.2' } : undefined,
  };
}

function databaseName() {
  return process.env.TIDB_DATABASE || process.env.DB_NAME || 'ethena_db';
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
