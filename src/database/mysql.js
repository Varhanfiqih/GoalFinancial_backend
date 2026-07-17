const mysql = require('mysql2/promise');
const path = require('node:path');

try {
  require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
} catch {
  // dotenv is installed with npm install.
}

function baseConnectionConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };
}

function databaseName() {
  return process.env.DB_NAME || 'ethena_db';
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
