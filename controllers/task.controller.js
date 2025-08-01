const Task = require('../models/task.model');
const asyncHandler = require('express-async-handler');
const deleteTaskAndSubtasks = require('../utils/delete.utils');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async ( req, res ) => {
    const { title, description, status, priority, dueDate, subtasks } = req.body;

    // Validate user input
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
        dueDate,
        subtasks: subtasks || []
    });

    res.status(201).json({
        message: 'Task created successfully',
        data: task
    });
});

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res ) => {
    const { status, priority, dueBefore, dueAfter, sortBy, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user.id }; // Filter by authenticated user

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (dueBefore) filter.dueDate = { ...filter.dueDate, $lte: new Date(dueBefore)};
    if (dueAfter) filter.dueDate = { ...filter.dueDate, $gte: new Date(dueAfter)}; 


    // Get all tasks for the authenticated user
    // Populate subtasks with title and status
    let query = Task.find(filter).populate('subtasks', 'title status');

    // Sort tasks if sortBy is provided
    if (sortBy) {
        const [field, order] = sortBy.split(':');
        query = query.sort({[field]: order === 'desc' ? -1 : 1});
    }

    // Paginate tasks
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const tasks = await query;
    if (tasks.length === 0) {
        res.status(400);
        throw new Error('No tasks found for this user');
    }

    res.status(200).json({
        message: 'Tasks retrieved successfully',
        data: tasks
    });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;

    const task = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true, // Return the updated task
        runValidators: true // Validate the updated data against the model schema
    });

    // Check if the task exists
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check if the authenticated user is the owner of the task
    if (task.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this task');
    }
    
    res.status(200).json({
        message: 'Task updated successfully',
        data: task
    });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    // Check if the task exists
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check if the authenticated user is the owner of the task
    if (task.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this task');
    }
    // Delete the task and all its subtasks
    await deleteTaskAndSubtasks(taskId);

    res.status(200).json({
        message: 'Task deleted successfully',
        data: task
    });
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [ total, done, todo, inProgress, overdue] = await Promise.all([
        Task.countDocuments({ user: userId}),
        Task.countDocuments({ user: userId, status: 'done' }),
        Task.countDocuments({ user: userId, status: 'todo' }),
        Task.countDocuments({ user: userId, status: 'in-progress' }),
        Task.countDocuments({ user: userId, dueDate: { $lt: new Date() }, status: { $ne: 'done' } }) // Overdue tasks that are not
    ]);

    res.status(200).json({
        message: 'Task statistics retrieved successfully',
        data: {
            total,
            done,
            todo,
            inProgress,
            overdue
        }
    });
});