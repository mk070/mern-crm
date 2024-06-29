const express = require("express");
const Task = require('../models/task');
const router = express.Router();
const mongoose = require('mongoose');

// POST route to create a task
router.post('/tasks', async (req, res) => {
    const { employeeId, todo, followUps } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ error: 'Invalid employeeId format' });
    }

    let parsedTodo, parsedFollowUps;
    try {
        parsedTodo = JSON.parse(todo);
        parsedFollowUps = JSON.parse(followUps);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON format for todo or followUps: ' + e.message });
    }

    if (!Array.isArray(parsedTodo) || !parsedTodo.length || !Array.isArray(parsedFollowUps) || !parsedFollowUps.length) {
        return res.status(400).json({ error: 'todo and followUps must be non-empty arrays.' });
    }

    try {
        const task = new Task({
            employeeId: employeeId,
            todo: parsedTodo,
            followUps: parsedFollowUps,
        });
        const savedTask = await task.save();
        res.json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save task', details: error.message });
    }
});

// GET route to fetch tasks by employeeId
router.get('/:empId', async (req, res) => {
    const { empId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(empId)) {
        return res.status(400).json({ error: 'Invalid employeeId format' });
    }

    try {
        const tasks = await Task.find({ employeeId: empId });
        if (!tasks.length) {
            return res.status(404).json({ message: 'No tasks found for this employee.' });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tasks', details: error.message });
    }
});


// PUT route to mark a task as done by taskId
router.put('/:taskId', async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: 'Invalid taskId format' });
    }

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Mark the task as done
        task.done = true;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark task as done', details: error.message });
    }
});



module.exports = router;
