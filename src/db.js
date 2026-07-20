const { Pool } = require('pg');
const { postgres } = require('./config');

const pool = new Pool(postgres);

async function query(sql, params = {}) {
  const result = await pool.query(toPostgresQuery(sql, params));
  return result.command === 'SELECT' ? normalizeRows(result.rows) : { affectedRows: result.rowCount };
}

async function transaction(work) {
  const client = await pool.connect();
  const connection = {
    async execute(sql, params = {}) {
      const result = await client.query(toPostgresQuery(sql, params));
      const value = result.command === 'SELECT'
        ? normalizeRows(result.rows)
        : { affectedRows: result.rowCount };
      return [value];
    },
    async query(sql, params = {}) {
      const result = await client.query(toPostgresQuery(sql, params));
      return normalizeRows(result.rows);
    },
  };

  try {
    await client.query('BEGIN');
    const result = await work(connection);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function closePool() {
  await pool.end();
}

function toPostgresQuery(sql, params) {
  const values = [];
  let text = sql
    .replace(/`/g, '"')
    .replace(/\bDATETIME\b/gi, 'TIMESTAMP')
    .replace(/\bTINYINT\(1\)\b/gi, 'SMALLINT');

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

function normalizeRows(rows) {
  return rows.map((row) => {
    const next = { ...row };
    const aliases = {
      totalusers: 'totalUsers',
      activegoals: 'activeGoals',
      completedgoals: 'completedGoals',
      totalsaved: 'totalSaved',
      totaltarget: 'totalTarget',
      totaltransactions: 'totalTransactions',
      totalincome: 'totalIncome',
      totaloutcome: 'totalOutcome',
    };

    for (const [from, to] of Object.entries(aliases)) {
      if (Object.prototype.hasOwnProperty.call(next, from) && !Object.prototype.hasOwnProperty.call(next, to)) {
        next[to] = next[from];
      }
    }

    return next;
  });
}

module.exports = {
  pool,
  query,
  transaction,
  closePool,
};
