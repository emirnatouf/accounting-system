require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initialize() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS income (
      id             SERIAL PRIMARY KEY,
      student_name   VARCHAR(255) NOT NULL,
      specialization VARCHAR(255) DEFAULT '',
      amount         NUMERIC(12,2) NOT NULL,
      payment_reason VARCHAR(255) DEFAULT '',
      receipt_number VARCHAR(100) NOT NULL,
      receipt_file   TEXT DEFAULT '',
      payment_date   VARCHAR(10) NOT NULL,
      CONSTRAINT income_receipt_number_unique UNIQUE (receipt_number)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id             SERIAL PRIMARY KEY,
      receiver_name  VARCHAR(255) NOT NULL,
      amount         NUMERIC(12,2) NOT NULL,
      expense_reason VARCHAR(255) DEFAULT '',
      receipt_number VARCHAR(100) NOT NULL,
      receipt_file   TEXT DEFAULT '',
      expense_date   VARCHAR(10) NOT NULL,
      CONSTRAINT expenses_receipt_number_unique UNIQUE (receipt_number)
    );

    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      username      VARCHAR(100) NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMP DEFAULT NOW(),
      CONSTRAINT users_username_unique UNIQUE (username)
    );
  `);

  // Seed default admin on first run
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await pool.query('SELECT id FROM users WHERE username = $1', [adminUser]);
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash(adminPass, 10);
    await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [adminUser, hash]);
    console.log(`✅ تم إنشاء المستخدم الافتراضي: ${adminUser}`);
  }

  console.log('✅ قاعدة البيانات جاهزة (PostgreSQL)');
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initialize,
};
