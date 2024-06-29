const mongoose = require('mongoose');
const { Employee } = require('./employee');

const taskSchema = new mongoose.Schema({
    employeeId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Reference to the Employee model
        required: true
    }],
    todo: [{
        type: String,
        required: true
    }],
    followUps: [{
        type: String,
        required: true
    }]
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
