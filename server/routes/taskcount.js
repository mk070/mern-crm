const router = require("express").Router();
const Task  = require('../models/task');
const Lead = require('../models/lead');
const Query = require('../models/query');

router.get('/', async (req, res) => {
    try {
        const taskCount = await Task.countDocuments();
        res.json({ taskCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
router.get('/leadcount', async (req, res) => {
    try {
        const leadCount = await Lead.countDocuments();
        res.json({ leadCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/querycount', async (req, res) => {
    try {
        const queryCount = await Query.countDocuments();
        res.json({ queryCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;
