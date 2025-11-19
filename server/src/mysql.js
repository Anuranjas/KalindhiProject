import mysql from 'mysql2/promise';

let pool;

export async function getPool() {
  if (!pool) {
    const {
      DB_HOST = 'localhost',
      DB_PORT = '3306',
      DB_USER = 'root',
      DB_PASSWORD = '',
      DB_NAME = 'kalindhi'
    } = process.env;

    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectionLimit: 10
    });
  }
  return pool;
}
