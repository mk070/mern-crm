const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Employee} = require("../models/employee");
const OtherDetails = require('../models/otherdetails') // Adjust the path according to your project structure

// Middleware to parse JSON b odies
router.use(express.json());

// POST route to add new employee details
router.post('/', async (req, res) => {
    try {
        const newDetails = new OtherDetails({
            dob: req.body.dob,
            position: req.body.position,
            doj: req.body.doj,
            contact: req.body.contact
        });
        const savedDetails = await newDetails.save();
        res.status(201).send(savedDetails);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// GET route to fetch all employee details
router.get('/employee-details', async (req, res) => {
    try {
        const details = await OtherDetails.find();
        res.status(200).send(details);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET route to fetch a single employee's details by ID
// Node.js/Express pseudo-code
router.get('/api/employee-details/:userId', (req, res) => {
    const userId = req.params.userId;
    Employee.findById(userId)
    .populate('otherDetails')  // Assuming 'otherDetails' is a reference in your Employee model
    .then(employee => {
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    })
    .catch(err => {
        res.status(500).send({ message: 'Server error', error: err });
    });
});


module.exports = router;
