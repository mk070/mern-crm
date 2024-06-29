const router = require("express").Router();
// In your route file
const { Client } = require('../models/user') // Destructure to get User

router.get('/userdetails', async (req, res) => {
    try {
        const users = await Client.find(); 
        res.json(users);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports=router;