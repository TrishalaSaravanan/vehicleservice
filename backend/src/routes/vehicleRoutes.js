// Vehicle Routes
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Add Vehicle
router.post('/add', vehicleController.addVehicle);

// Get vehicles by customer
router.get('/customer/:customer_id', vehicleController.getVehiclesByCustomer);

// Delete vehicle by ID
router.delete('/delete/:id', vehicleController.deleteVehicle);

module.exports = router;
