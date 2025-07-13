const Task = require('../models/task.model');
const asyncHandler = require('express-async-handler');

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private

// Block marking as done if any subtasks aren't done
const checkCompletionGuard = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const taskId = req.params.id;

    if (status !== 'done') return next(); //Only care if marking as done

    const task = await Task.findById(taskId).populate('subtasks', 'done');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const hasIncompleteSubtasks = task.subtasks.some(sub => sub.status !== 'done');
    if (hasIncompleteSubtasks){
        return res.status(400).json({
            message: 'Cannot mark task as done. Some subtasks are not completed.'
        })
    }

    next();
});

module.exports = { checkCompletionGuard }