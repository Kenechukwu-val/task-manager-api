const Task = require('../models/task.model');

const deleteTaskAndSubtasks = async (taskId) => {
    const task = await Task.findById(taskId);
    if (!task) return;

    // Delete all subtasks associated with the task
    for (const subtaskId of task.subtasks) {
        await deleteTaskAndSubtasks(subtaskId);
    }

    // Delete the task itself
    await Task.findByIdAndDelete(taskId);
};

module.exports = deleteTaskAndSubtasks;