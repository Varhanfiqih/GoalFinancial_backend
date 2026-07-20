const { Client } = require('pg');
const { postgres } = require('../config');

function databaseName() {
  return process.env.POSTGRES_DATABASE || process.env.PGDATABASE || 'neon';
}

async function createServerConnection() {
  return createDatabaseConnection();
}

async function createDatabaseConnection() {
  const client = new Client(postgres);
  await client.connect();
  return {
    async query(sql, params = []) {
      const result = await client.query(toPostgresQuery(sql, params));
      return result.rows;
    },
    async execute(sql, params = []) {
      const result = await client.query(toPostgresQuery(sql, params));
      return [result.command === 'SELECT' ? result.rows : { affectedRows: result.rowCount, rowCount: result.rowCount }];
    },
    async end() {
      await client.end();
    },
  };
}

function toPostgresQuery(sql, params) {
  let text = sql
    .replace(/CREATE DATABASE IF NOT EXISTS .+?;/gis, '')
    .replace(/`/g, '"')
    .replace(/\bINT AUTO_INCREMENT\b/gi, 'SERIAL')
    .replace(/\bDATETIME\b/gi, 'TIMESTAMP')
    .replace(/\bTINYINT\(1\)\b/gi, 'SMALLINT')
    .replace(/ ON UPDATE CURRENT_TIMESTAMP/gi, '');

  const values = [];
  if (Array.isArray(params)) {
    text = text.replace(/\?/g, () => `$${values.push(params[values.length])}`);
    return { text, values };
  }

  const seen = new Map();
  text = text.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (match, name) => {
    if (!seen.has(name)) {
      seen.set(name, values.push(params[name]));
    }
    return `$${seen.get(name)}`;
  });

  return values.length > 0 ? { text, values } : { text };
}

module.exports = {
  createServerConnection,
  createDatabaseConnection,
  databaseName,
};
