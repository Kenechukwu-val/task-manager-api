const authController = require('../controllers/auth.controller');
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

// Route to register a new user
router.post('/register', authController.registerUser);

// Route to login a user
router.post('/login', authController.loginUser);

// Route to get user profile
router.get('/profile', protect, authController.getMe);

module.exports = router;
