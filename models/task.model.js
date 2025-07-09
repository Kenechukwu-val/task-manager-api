const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for the task']
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['todo', 'in progress', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    subtasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);