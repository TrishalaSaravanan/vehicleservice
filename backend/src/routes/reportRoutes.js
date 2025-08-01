const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Customer Reports
router.get('/customers', authMiddleware, reportController.getCustomerReport);
router.get('/customers/export', authMiddleware, reportController.exportCustomerReport);

// Mechanic Reports
router.get('/mechanics', authMiddleware, reportController.getMechanicReport);
router.get('/mechanics/export', authMiddleware, reportController.exportMechanicReport);

module.exports = router;
