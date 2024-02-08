// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); 

// Get all users (requires authentication and admin access)
router.get('/users', authMiddleware, adminMiddleware, userController.getAllUsers);

// Get a single user by ID (requires authentication)
router.get('/users/:id', authMiddleware, userController.getUserById);

// Delete a user by ID (requires authentication and admin access)
router.delete('/users/:id', authMiddleware, adminMiddleware, userController.deleteUserById);

// Other user-related routes...

module.exports = router;
