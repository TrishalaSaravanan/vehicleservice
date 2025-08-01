// backend/src/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', serviceController.getAllServices);


// Add a new service
router.post('/', serviceController.addService);


// Update a service
router.put('/:id', serviceController.updateService);

// Delete a service
router.delete('/:id', serviceController.deleteService);

module.exports = router;
