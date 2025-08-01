require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ADD: Cookie parser for JWT cookies

// Create a connection pool
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

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database!');
    connection.release();
  }
});

const app = express();

// CORS configuration to support credentials (cookies)
app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser()); // ADD: Enable cookie parsing

// Routes

const authRoutes = require('./routes/authRoutes');
const mechanicRoutes = require('../routes/mechanicRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const partsRoutes = require('../routes/partsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/mechanics', mechanicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
