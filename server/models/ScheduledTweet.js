// models/ScheduledTweet.js
const mongoose = require('mongoose');

const ScheduledTweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  posted: {
    type: Boolean,
    default: false,
  },
});

const ScheduledTweet = mongoose.model('ScheduledTweet', ScheduledTweetSchema);

module.exports = ScheduledTweet;