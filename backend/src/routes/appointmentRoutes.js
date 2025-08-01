
const express = require('express');
const router = express.Router();
const db = require('../db');

// Update appointment status and assign mechanic
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, mechanic_id } = req.body;
    const { id } = req.params;
    if (!status || !['Accepted', 'Rejected', 'Assigned', 'Completed', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }
    let query = 'UPDATE appointment SET status = ?';
    let params = [status];
    if (mechanic_id) {
      // Fetch mechanic name
      const [rows] = await db.query('SELECT name FROM mechanic WHERE id = ?', [mechanic_id]);
      const mechanic_name = rows && rows[0] ? rows[0].name : null;
      query += ', mechanic_id = ?';
      params.push(mechanic_id);
      if (mechanic_name) {
        query += ', mechanic_name = ?';
        params.push(mechanic_name);
      }
    }
    query += ' WHERE id = ?';
    params.push(id);
    await db.query(query, params);
    res.json({ success: true, message: 'Appointment status updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

// Get appointments (admin: all, customer: filtered, mechanic: filtered)
router.get('/', async (req, res) => {
  try {
    const { customerId, mechanicId } = req.query;
    let query =
      `SELECT a.*, 
              c.name AS customer_name, c.phone AS customer_phone, c.address AS customer_address,
              v.make AS vehicle_make, v.model AS vehicle_model, v.year AS vehicle_year, v.license_plate AS vehicle_license_plate,
              s.name AS service_name, s.description AS service_description,
              m.name AS mechanic_name
         FROM appointment a
         LEFT JOIN customer c ON a.customer_id = c.id
         LEFT JOIN vehicle v ON a.vehicle_id = v.id
         LEFT JOIN service s ON a.service_id = s.id
         LEFT JOIN mechanic m ON a.mechanic_id = m.id`;
    let params = [];
    
    if (customerId) {
      query += ' WHERE a.customer_id = ?';
      params.push(customerId);
    } else if (mechanicId) {
      query += ' WHERE a.mechanic_id = ?';
      params.push(mechanicId);
    }
    
    query += ' ORDER BY a.appointment_date DESC';
    const [appointments] = await db.query(query, params);
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Book a new appointment
router.post('/', async (req, res) => {
  try {
    const { customer_id, vehicle_id, mechanic_id, service_id, appointment_date, status, price, notes } = req.body;
    if (!customer_id || !vehicle_id || !service_id || !appointment_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await db.query(
      `INSERT INTO appointment (customer_id, vehicle_id, mechanic_id, service_id, appointment_date, status, price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        vehicle_id,
        mechanic_id || null,
        service_id,
        appointment_date,
        status || 'Pending',
        price || null,
        notes || ''
      ]
    );
    res.status(201).json({ success: true, message: 'Appointment booked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

module.exports = router;
