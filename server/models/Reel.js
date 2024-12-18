const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
    content: { type: String, required: true },
    scheduledAt: { type: Date, default: null }, // Use null for immediate posts
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Reel = mongoose.model('Reel', reelSchema);

module.exports = Reel;
