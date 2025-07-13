const taskController = require('../controllers/task.controller');
const express  = require('express');
const router   =  express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { circularDependencyGuard } = require('../middlewares/circularCheck');
const { checkCompletionGuard } = require('../middlewares/checkCompletionGuard');


// Route to create a new task
router.post('/', protect, taskController.createTask);

// Route to get all tasks for the authenticated user
router.get('/', protect, taskController.getTasks);   

// Route to update a task
router.put('/:id', protect, checkCompletionGuard, circularDependencyGuard, taskController.updateTask);

// Route to delete a task
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;