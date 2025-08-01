const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
// Get current mechanic profile
router.get('/mechanic/profile', authMiddleware, authController.getMechanicProfile);
// Admin: Delete customer
router.delete('/admin/customers/:id', authMiddleware, authController.adminDeleteCustomer);

// Update current customer profile
router.put('/customer/profile', authMiddleware, authController.updateCustomerProfile);
// Get current customer profile
router.get('/customer/profile', authMiddleware, authController.getCustomerProfile);
// Login route
router.post('/login', authController.login);
// Logout route (NEW: Clear cookies and session)
router.post('/logout', authMiddleware, authController.logout);
// Signup route
router.post('/signup', authController.signup);
// Signup route
router.post('/signup', authController.signup);
// Get all customers (admin)
router.get('/admin/customers', authMiddleware, authController.getAllCustomers);
// Admin: Update customer details
router.put('/admin/customers/:id', authMiddleware, authController.adminUpdateCustomer);

module.exports = router;
