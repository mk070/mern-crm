const router = require("express").Router();
const { Client } = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const clientCount = await Client.countDocuments();
        res.json({ clientCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


module.exports = router;
