const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');

// Middleware to protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if token is provided in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return unauthorized error
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user by ID from the token
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});