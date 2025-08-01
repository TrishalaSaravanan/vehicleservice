const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Test database connection
router.get('/test-db', adminController.testDatabase);

// Admin Dashboard Stats
router.get('/stats', authMiddleware, adminController.getAdminStats);

// Service Distribution for Charts
router.get('/service-distribution', authMiddleware, adminController.getServiceDistribution);

// Revenue by Service for Charts
router.get('/revenue-by-service', authMiddleware, adminController.getRevenueByService);

// Weekly Appointments for Charts
router.get('/weekly-appointments', authMiddleware, adminController.getWeeklyAppointments);

module.exports = router;
