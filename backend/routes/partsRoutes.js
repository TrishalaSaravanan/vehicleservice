const express = require('express');
const router = express.Router();
const partsController = require('../controllers/partsController');

// Get all parts
router.get('/', partsController.getAllParts);
// Add a part
router.post('/', partsController.addPart);
// Edit a part
router.put('/:id', partsController.editPart);
// Delete a part
router.delete('/:id', partsController.deletePart);

module.exports = router;
