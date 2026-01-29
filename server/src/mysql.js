import mysql from 'mysql2/promise';

let pool;

export async function getPool() {
  if (!pool) {
    const {
      DB_HOST = 'localhost',
      DB_PORT = '3306',
      DB_USER = 'root',
      DB_PASSWORD = 'Amarnathps',
      DB_NAME = 'kalindhi'
    } = process.env;

    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  }
  return pool;
}
