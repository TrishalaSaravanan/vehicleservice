// Delete mechanic
exports.deleteMechanic = async (req, res) => {
  try {
    const mechanicId = req.params.id;
    // Get user_id from mechanic
    const [[mechanicRow]] = await db.query('SELECT user_id FROM mechanic WHERE id = ?', [mechanicId]);
    if (!mechanicRow) {
      return res.status(404).json({ message: 'Mechanic not found.' });
    }
    const userId = mechanicRow.user_id;
    // Delete certifications
    await db.query('DELETE FROM mechanic_certification WHERE mechanic_id = ?', [mechanicId]);
    // Delete specializations
    await db.query('DELETE FROM mechanic_specialization WHERE mechanic_id = ?', [mechanicId]);
    // Delete mechanic
    await db.query('DELETE FROM mechanic WHERE id = ?', [mechanicId]);
    // Delete user
    await db.query('DELETE FROM user WHERE id = ?', [userId]);
    res.json({ message: 'Mechanic deleted successfully.' });
  } catch (err) {
    console.error('DELETE MECHANIC ERROR:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
// Update mechanic details
exports.updateMechanic = async (req, res) => {
  try {
    const mechanicId = req.params.id;
    const { name, email, phone, address, experience, certifications, specializations } = req.body;
    // 1. Update mechanic table
    await db.query(
      'UPDATE mechanic SET name = ?, phone = ?, address = ?, experience = ? WHERE id = ?',
      [name, phone, address, experience, mechanicId]
    );
    // 2. Update user table (email only)
    // Get user_id from mechanic
    const [[mechanicRow]] = await db.query('SELECT user_id FROM mechanic WHERE id = ?', [mechanicId]);
    if (mechanicRow && email) {
      await db.query('UPDATE user SET email = ? WHERE id = ?', [email, mechanicRow.user_id]);
    }
    // 3. Update certifications
    await db.query('DELETE FROM mechanic_certification WHERE mechanic_id = ?', [mechanicId]);
    if (Array.isArray(certifications)) {
      for (const cert of certifications) {
        await db.query(
          'INSERT INTO mechanic_certification (mechanic_id, certification) VALUES (?, ?)',
          [mechanicId, cert]
        );
      }
    }
    // 4. Update specializations
    await db.query('DELETE FROM mechanic_specialization WHERE mechanic_id = ?', [mechanicId]);
    if (Array.isArray(specializations)) {
      for (const spec of specializations) {
        await db.query(
          'INSERT INTO mechanic_specialization (mechanic_id, specialization) VALUES (?, ?)',
          [mechanicId, spec]
        );
      }
    }
    res.json({ message: 'Mechanic updated successfully.' });
  } catch (err) {
    console.error('UPDATE MECHANIC ERROR:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
// Get all mechanics (with user info)
exports.getAllMechanics = async (req, res) => {
  try {
    // Join mechanic and user tables to get all info
    const [rows] = await db.query(`
      SELECT m.id, m.user_id, m.name, u.email, m.phone, m.address, m.experience, m.is_active, m.created_at
      FROM mechanic m
      JOIN user u ON m.user_id = u.id
      WHERE u.role = 'mechanic'
    `);
    // Optionally, fetch certifications and specializations for each mechanic
    for (const mech of rows) {
      const [certs] = await db.query('SELECT certification FROM mechanic_certification WHERE mechanic_id = ?', [mech.id]);
      const [specs] = await db.query('SELECT specialization FROM mechanic_specialization WHERE mechanic_id = ?', [mech.id]);
      mech.certification = certs.map(c => c.certification);
      mech.specialization = specs.map(s => s.specialization);
    }
    res.json(rows);
  } catch (err) {
    console.error('GET MECHANICS ERROR:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
// backend/controllers/mechanicController.js
const db = require('../db');
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
    console.error('ADD MECHANIC ERROR:',err);
    res.status(500).json({ message: 'Server error.' });
  }
};
