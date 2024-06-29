const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
const { Employee} = require("../models/employee");
const { Client } = require("../models/user");
const fs = require('fs');
// Configuring file upload middleware with some restrictions
router.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // for example, 50MB limit
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
}));
router.use(express.static(path.join(__dirname, '../uploads')));
// POST endpoint for uploading files
router.post('/upload', async (req, res) => {
    if (!req.files || !req.files.pdfFile) {
        return res.status(400).send('PDF file is required.');
    }
    if (!req.body.userId) {
        return res.status(400).send('User ID is required.');
    }

    try {
        const { pdfFile } = req.files;
        const { userId } = req.body;
        const uploadPath = path.join(__dirname, '../uploads', pdfFile.name);

        // Move the file to the upload directory
        await pdfFile.mv(uploadPath);

        // Update user data in the database
        const user = await Employee.findByIdAndUpdate(userId, { pdfUrl: uploadPath }, { new: true });
        if (!user) {
            return res.status(404).send('Employee not found.');
        }
        res.json(user);
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

router.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find({});
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/assignClients', async (req, res) => {
    const { employeeId, clientIds } = req.body;

    if (!mongoose.isValidObjectId(employeeId) || !Array.isArray(clientIds) || clientIds.some(id => !mongoose.isValidObjectId(id))) {
        return res.status(400).send('Invalid employee ID or client IDs.');
    }

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, {
            $addToSet: { clientassign: { $each: clientIds } }
        }, { new: true }).populate('clientassign');

        if (!updatedEmployee) {
            return res.status(404).send('Employee not found.');
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error assigning clients:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});


router.get('/empdetails', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
router.get('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;

    if (!mongoose.isValidObjectId(employeeId)) {
        return res.status(400).send('Invalid employee ID.');
    }

    try {
        const employee = await Employee.findById(employeeId).populate('clientassign');
        if (!employee) {
            return res.status(404).send('Employee not found.');
        }

        const assignedClients = employee.clientassign;
        const pdfUrl = employee.pdfUrl ? `../uploads/${employee.pdfUrl}` : null;  // Fetch PDF URL from employee data

        res.json({
            employee,
            assignedClients,
            pdfUrl
        });
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});




router.get('/pdf/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Employee.findById(userId);
        if (!user || !user.pdfUrl) {
            return res.status(404).send('PDF not found for this user.');
        }
        const pdfPath = user.pdfUrl;
        res.sendFile(path.resolve(pdfPath));
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});


module.exports = router;