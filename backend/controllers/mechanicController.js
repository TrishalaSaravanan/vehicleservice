// backend/controllers/mechanicController.js
const db = require('../src/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Add a new mechanic (and user)
exports.addMechanic = async (req, res) => {
  try {
    const { email, password, name, phone, address, experience, certifications, specializations } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' });
    }
    // 1. Create user
    const userId = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO user (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [userId, email, password_hash, 'mechanic']
    );
    // 2. Create mechanic
    const mechanicId = uuidv4();
    await db.query(
      'INSERT INTO mechanic (id, user_id, name, phone, address, experience) VALUES (?, ?, ?, ?, ?, ?)',
      [mechanicId, userId, name, phone, address, experience]
    );
    // 3. Add certifications
    if (Array.isArray(certifications)) {
      for (const cert of certifications) {
        await db.query(
          'INSERT INTO mechanic_certification (mechanic_id, certification) VALUES (?, ?)',
          [mechanicId, cert]
        );
      }
    }
    // 4. Add specializations
    if (Array.isArray(specializations)) {
      for (const spec of specializations) {
        await db.query(
          'INSERT INTO mechanic_specialization (mechanic_id, specialization) VALUES (?, ?)',
          [mechanicId, spec]
        );
      }
    }
    res.status(201).json({ message: 'Mechanic added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
