const router = require("express").Router();
const { Employee } = require("../models/employee"); 

router.get('/', async (req, res) => {
    try {
        const userCount = await Employee.countDocuments();
        res.json({ userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


module.exports = router;
