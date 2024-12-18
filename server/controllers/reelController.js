const Reel = require('../models/Reel');

exports.createReel = async (req, res) => {
    const { content, scheduledAt } = req.body;
    try {
        const newReel = await Reel.create({ content, scheduledAt });
        res.status(201).json(newReel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create reel' });
    }
};
