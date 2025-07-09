const taskController = require('../controllers/task.controller');
const express  = require('express');
const router   =  express.Router();


// Route to create a new task
router.post('/', taskController.createTask);

// Route to get all tasks for the authenticated user
router.get('/', taskController.getTasks);   

// Route to update a task
router.put('/:id', taskController.updateTask);

// Route to delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;