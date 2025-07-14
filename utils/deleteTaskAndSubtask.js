const Task = require('../models/task.model');

const deleteTaskAndSubtask = async (taskId) => {
    const task = await Task.findById(taskId);
    if (!task) return;

    // Delete all subtasks associated with the task
    for (const subtaskId of task.subtasks) {
        await deleteTaskAndSubtask(subtaskId);
    }

    // Delete the task itself
    await Task.findByIdAndDelete(taskId);
};

module.exports = deleteTaskAndSubtask;