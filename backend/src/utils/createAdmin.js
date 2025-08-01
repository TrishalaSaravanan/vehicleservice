require('dotenv').config({ path: __dirname + '/../.env' });
require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


async function createAdmin() {
  const id = uuidv4();
  const email = 'admin@mechniq.com';
  const password = 'admin123';
  const password_hash = await bcrypt.hash(password, 10);
  const role = 'admin';
  const is_active = true;

  pool.query(
    'INSERT INTO user (id, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
    [id, email, password_hash, role, is_active],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('Admin user already exists.');
        } else {
          console.error('Error creating admin:', err);
        }
      } else {
        console.log('Admin user created successfully!');
      }
      process.exit();
    }
  );
}

createAdmin();
