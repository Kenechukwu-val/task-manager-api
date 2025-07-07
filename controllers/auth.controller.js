const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');


// @desc Register a new user
// @route POST /api/auth/register
// @access Public
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //Validate user input
    if (!name || !email || !password ) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    //Create user
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});

// @desc Authenticate a user
// @route POST /api/auth/login
// @access Public
exports.loginUser = asyncHandler(async ( req, res ) => {
    const { email, password } = req.body;

    //Validate user input
    if ( !email || !password ) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    //Check if user exists
    const user = await User.findOne({ email });
    if ( !user || !(await user.matchPassword(password))) {
        res.status(400);
        throw new Error('Invalid email or password');
    }                 
    //User authenticated successfully, return user data
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    });
});

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    });

});
