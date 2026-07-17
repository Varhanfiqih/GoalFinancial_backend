const mysql = require('mysql2/promise');
const { db } = require('./config');

const pool = mysql.createPool(db);

async function query(sql, params = {}) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function transaction(work) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function closePool() {
  await pool.end();
}

module.exports = {
  pool,
  query,
  transaction,
  closePool,
};
