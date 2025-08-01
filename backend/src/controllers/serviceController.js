// Delete a service
exports.deleteService = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  try {
    const [result] = await db.query('DELETE FROM service WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Service with id ${id} not found` });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};
// Update a service
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;
  if (!id || !name || !price || !duration) {
    return res.status(400).json({ error: 'ID, name, price, and duration are required' });
  }
  try {
    const [result] = await db.query(
      'UPDATE service SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?',
      [name, description, price, duration, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Service with id ${id} not found` });
    }
    res.json({ id, name, description, price, duration });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};
// backend/src/controllers/serviceController.js
const db = require('../db');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM service');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

// Add a new service
exports.addService = async (req, res) => {
  const { name, description, price, duration } = req.body;
  if (!name || !price || !duration) {
    return res.status(400).json({ error: 'Name, price, and duration are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO service (name, description, price, duration) VALUES (?, ?, ?, ?)',
      [name, description, price, duration]
    );
    res.status(201).json({ id: result.insertId, name, description, price, duration });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

// Optionally: Delete, Update, Get by ID can be added here
