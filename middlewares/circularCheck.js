const Task = require('../models/task.model');

// @desc    Middleware to check for circular dependencies in subtasks
const hasCircularDependency = async(taskId, subtasks) => {
    const visited = new Set();

    //Depth-first search to detect cycles
    const dfs = async (currentId) => {
        if (currentId.toString() === taskId.toString()) return true; // Cycle detected
        if (visited.has(currentId.toString())) return false; // Already visited this task

        visited.add(currentId.toString());
        const currentTask = await Task.findById(currentId).select('subtasks');
        if (!currentTask || !currentTask.subtasks) return false; // No subtasks or task not found

        for (let subId of currentTask.subtasks) {
            if (await dfs(subId)) return true; // Cycle found in subtasks
        }
        return false; // No cycle found
    };

    for (let subId of subtasks) {
        if (await dfs(subId)) return true;
    }

    return false;
};

const circularDependencyGuard = async (req, res, next) => {
        const taskId = req.params.id;
        const { subtasks } = req.body;

        //Only check if subtasks are been updated
        if (!subtasks || subtasks.length === 0 ) {
            return next(); // No subtasks to check, proceed
        }

        const isCircular = await hasCircularDependency(taskId, subtasks);
        if (isCircular) {
            res.status(400).json({
                message: 'Circular dependency detected, cannot assign subtasks'
            });
        }

        next(); // No circular dependency, proceed to next middleware
};

module.exports = circularDependencyGuard;