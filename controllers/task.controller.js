const Task = require('../models/task.model');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../middlewares/auth.middleware');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async ( req, res ) => {
    const { title, description, status, priority, dueDate} = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please provide a title for the task');
    }

    const task = await Task.create({
        user: req.user._id, // Assuming req.user is populated with the authenticated user's info
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate
    });

    res.status(201).json({
        message: 'Task created successfully',
        data: generateToken(task._id)
    });
});

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res ) => {
    const tasks = await Task.find({ user: req.user._id});

    if (tasks.length === 0) {
        res.status(400);
        throw new Error('No tasks found for this user');
    }

    res.status(200).json({
        message: 'Tasks retrieved successfully',
        data: generateToken(tasks)
    });
});