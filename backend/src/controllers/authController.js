// Required modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Get current mechanic profile
exports.getMechanicProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find mechanic by user_id
    const [mechRows] = await pool.query('SELECT * FROM mechanic WHERE user_id = ?', [userId]);
    if (!mechRows || mechRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mechanic not found.' });
    }
    const mechanic = mechRows[0];
    // Get user email
    const [userRows] = await pool.query('SELECT email FROM user WHERE id = ?', [userId]);
    mechanic.email = userRows && userRows[0] ? userRows[0].email : null;
    // Get certifications
    const [certs] = await pool.query('SELECT certification FROM mechanic_certification WHERE mechanic_id = ?', [mechanic.id]);
    mechanic.certification = certs.map(c => c.certification);
    // Get specializations
    const [specs] = await pool.query('SELECT specialization FROM mechanic_specialization WHERE mechanic_id = ?', [mechanic.id]);
    mechanic.specialization = specs.map(s => s.specialization);
    res.json({ success: true, profile: mechanic });
  } catch (err) {
    console.error('[GET MECHANIC PROFILE ERROR]', err.stack || err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
// Admin: Delete customer (from both customer and user tables)
exports.adminDeleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    // Get user_id from customer table
    const [customerRows] = await pool.query('SELECT user_id FROM customer WHERE id = ?', [customerId]);
    if (!customerRows || customerRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }
    const userId = customerRows[0].user_id;
    // Delete from customer table
    await pool.query('DELETE FROM customer WHERE id = ?', [customerId]);
    // Delete from user table
    await pool.query('DELETE FROM user WHERE id = ?', [userId]);
    return res.json({ success: true, message: 'Customer deleted successfully.' });
  } catch (err) {
    console.error('[ADMIN DELETE CUSTOMER ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};


// Admin: Update customer details (name, email, phone, address, status)
exports.adminUpdateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { name, email, phone, address, is_active } = req.body;
    // Get user_id from customer table
    const [customerRows] = await pool.query('SELECT user_id FROM customer WHERE id = ?', [customerId]);
    if (!customerRows || customerRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }
    const userId = customerRows[0].user_id;
    // Update user table (email)
    if (email) {
      await pool.query('UPDATE user SET email = ? WHERE id = ?', [email, userId]);
    }
    // Update customer table (name, phone, address, is_active)
    let query = 'UPDATE customer SET ';
    const params = [];
    if (name !== undefined) {
      query += 'name = ?';
      params.push(name);
    }
    if (phone !== undefined) {
      if (params.length > 0) query += ', ';
      query += 'phone = ?';
      params.push(phone);
    }
    if (address !== undefined) {
      if (params.length > 0) query += ', ';
      query += 'address = ?';
      params.push(address);
    }
    if (is_active !== undefined) {
      if (params.length > 0) query += ', ';
      query += 'is_active = ?';
      params.push(is_active);
    }
    query += ' WHERE id = ?';
    params.push(customerId);
    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not updated.' });
    }
    return res.json({ success: true, message: 'Customer updated successfully.' });
  } catch (err) {
    console.error('[ADMIN UPDATE CUSTOMER ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
// Get all customers (admin)
exports.getAllCustomers = async (req, res) => {
  try {
    // Optionally, check if user is admin: if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
    const [rows] = await pool.query(`
      SELECT c.id, c.name, c.phone, c.address, c.is_active, c.created_at, u.email
      FROM customer c
      JOIN user u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
    return res.json({ success: true, customers: rows });
  } catch (err) {
    console.error('[GET ALL CUSTOMERS ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
// Update current customer profile (address, phone)
exports.updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, phone } = req.body;
    if (!address && !phone) {
      return res.status(400).json({ success: false, message: 'Address or phone required.' });
    }
    // Build dynamic query
    let query = 'UPDATE customer SET ';
    const params = [];
    if (address !== undefined) {
      query += 'address = ?';
      params.push(address);
    }
    if (phone !== undefined) {
      if (params.length > 0) query += ', ';
      query += 'phone = ?';
      params.push(phone);
    }
    query += ' WHERE user_id = ?';
    params.push(userId);
    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer profile not found.' });
    }
    return res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('[UPDATE CUSTOMER PROFILE ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
// Get current customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get user info
    const [userRows] = await pool.query('SELECT email FROM user WHERE id = ?', [userId]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    // Get customer info
    const [customerRows] = await pool.query('SELECT id, name, address, phone FROM customer WHERE user_id = ?', [userId]);
    if (!customerRows || customerRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer profile not found.' });
    }
    const { id, name, address, phone } = customerRows[0];
    const { email } = userRows[0];
    return res.json({ success: true, profile: { id, name, email, address, phone } });
  } catch (err) {
    console.error('[GET CUSTOMER PROFILE ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Signup controller (promise-based)
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const role = 'customer';
  const { v4: uuidv4 } = require('uuid');
  const id = uuidv4();
  console.log(`[SIGNUP ATTEMPT] Name: ${name}, Email: ${email}, Role: ${role}, ID: ${id}`);
  if (!name || !email || !password) {
    console.log('[SIGNUP FAIL] Missing fields.');
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }
  try {
    // Hash password first
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    console.log('[SIGNUP] Password hashed.');
    // Check if user already exists
    let existing;
    try {
      [existing] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      console.log('[SIGNUP] Checked for existing user. Result:', existing);
    } catch (dbErr) {
      console.error('[SIGNUP FAIL] DB error during SELECT:', dbErr);
      return res.status(500).json({ success: false, message: 'Database error (select).' });
    }
    if (existing.length > 0) {
      console.log(`[SIGNUP FAIL] User already exists for email: ${email}`);
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }
    // Insert user
    try {
      await pool.query(
        'INSERT INTO user (id, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
        [id, email, password_hash, role, true]
      );
      console.log(`[SIGNUP SUCCESS] User created: ${email}, Role: ${role}`);
    } catch (insertUserErr) {
      console.error('[SIGNUP FAIL] Error creating user:', insertUserErr);
      return res.status(500).json({ success: false, message: 'Error creating user.' });
    }
    // Insert into customer table
    try {
      await pool.query(
        'INSERT INTO customer (id, user_id, name, is_active) VALUES (?, ?, ?, ?)',
        [uuidv4(), id, name, true]
      );
      console.log(`[SIGNUP SUCCESS] Customer profile created for user: ${id}`);
    } catch (insertCustErr) {
      console.error('[SIGNUP FAIL] Error creating customer:', insertCustErr);
      return res.status(500).json({ success: false, message: 'Error creating customer profile.' });
    }
    return res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('[SIGNUP FAIL] Server error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Email: ${email}, Password: ${password}`);
    if (!email || !password) {
      console.log(`[LOGIN FAIL] Missing email or password.`);
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Use promise-based pool (already promise from db.js)
    const [results] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (!results || results.length === 0) {
      console.log(`[LOGIN FAIL] No user found for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log(`[LOGIN FAIL] Incorrect password for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Store JWT in session table
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiry
    try {
      await pool.query(
        'INSERT INTO session (user_id, jwt_token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt]
      );
    } catch (sessionErr) {
      console.log(`[LOGIN FAIL] Session error for email: ${email}`);
      return res.status(500).json({ success: false, message: 'Session error.' });
    }

    // NEW: Set HTTP-only cookie for enhanced security
    res.cookie('jwt_token', token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });

    let redirectPath = '/';
    if (user.role === 'admin') redirectPath = '/admin/dashboard';
    else if (user.role === 'mechanic') redirectPath = '/mechanic/dashboard';
    else if (user.role === 'customer') redirectPath = '/customer/home';
    
    console.log(`[LOGIN SUCCESS] Email: ${email}, Role: ${user.role}, Redirect: ${redirectPath}`);
    console.log(`[LOGIN SUCCESS] Token set in both cookie and response for backward compatibility`);
    
    // Return token in response for backward compatibility with localStorage
    return res.json({ success: true, token, role: user.role, redirect: redirectPath });
  } catch (err) {
    console.error('[LOGIN ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// NEW: Logout method to clear cookies and session
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Clear JWT from session table
    await pool.query('DELETE FROM session WHERE user_id = ?', [userId]);
    
    // Clear HTTP-only cookie
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    console.log(`[LOGOUT SUCCESS] User ID: ${userId} - Cookie and session cleared`);
    return res.json({ success: true, message: 'Logout successful' });
  } catch (err) {
    console.error('[LOGOUT ERROR]', err.stack || err);
    return res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
};
