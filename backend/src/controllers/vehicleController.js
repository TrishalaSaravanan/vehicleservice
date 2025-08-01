// Delete vehicle by ID
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Vehicle ID is required' });
    }
    const [result] = await db.query('DELETE FROM vehicle WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getVehiclesByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const [rows] = await db.query('SELECT * FROM vehicle WHERE customer_id = ?', [customer_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Vehicle Controller
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.addVehicle = async (req, res) => {
  try {
    const { customer_id, make, model, year, vin, license_plate, mileage } = req.body;
    if (!customer_id || !make || !model || !year || !vin || !license_plate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const id = uuidv4();
    await db.query(
      'INSERT INTO vehicle (id, customer_id, make, model, year, vin, license_plate, mileage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, customer_id, make, model, year, vin, license_plate, mileage || 0]
    );
    res.status(201).json({ message: 'Vehicle added successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
