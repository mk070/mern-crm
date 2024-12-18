const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    postType: { type: String, enum: ['reel', 'story', 'post'], required: true },
    scheduledTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('Post', PostSchema);
