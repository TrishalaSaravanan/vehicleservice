// backend/routes/mechanicRoutes.js
const express = require('express');
const router = express.Router();
const mechanicController = require('../src/controllers/mechanicController');



// POST /api/mechanics - Add a new mechanic
router.post('/', mechanicController.addMechanic);

// PUT /api/mechanics/:id - Update mechanic
router.put('/:id', mechanicController.updateMechanic);

// GET /api/mechanics - Get all mechanics
router.get('/', mechanicController.getAllMechanics);

// DELETE /api/mechanics/:id - Delete mechanic
router.delete('/:id', mechanicController.deleteMechanic);

module.exports = router;
