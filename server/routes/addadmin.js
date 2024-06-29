const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/admin');
const bcrypt = require("bcrypt");
const userModel = User; // Assuming that the User model is exported from your user model file

// Middleware to check if the user is an admin
router.post('/register-admin', async (req, res) => {
    // Validate the incoming data using Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Check if the admin already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('Admin already registered.');

        // Create a new admin user
        user = new User({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        });

        // Hash password before saving to the database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.confirmpassword = await bcrypt.hash(user.confirmpassword, salt);

        // Save the new admin
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();
        
        // Send the JWT token and admin details
        res.status(201).send({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).send('Error in saving admin: ' + err.message);
    }
});

module.exports = router;
