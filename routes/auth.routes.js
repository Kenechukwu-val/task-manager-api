const userController = require('../controllers/auth.controller');
const express = require('express');
const router = express.Router();

// Route to register a new user
router.post('/register', userController.registerUser);

// Route to login a user
router.post('/login', userController.loginUser);

// Route to get user profile
router.get('/profile', userController.getMe);

module.exports = router;
