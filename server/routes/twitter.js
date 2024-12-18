const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { twitterClient, twitterBearer } = require('../twitterClient'); // Import the clients
const ScheduledTweet = require('../models/ScheduledTweet'); // Import ScheduledTweet model

// Replace with the actual user ID or Twitter handle
const USER_ID = '1761261029814575104'; // Replace with a valid user ID

// Periodic task to check and post scheduled tweets
cron.schedule('*/30 * * * *', async () => { // Runs every minute
  try {
    const now = new Date();
    const scheduledTweets = await ScheduledTweet.find({ posted: false, scheduledAt: { $lte: now } });

    for (const scheduledTweet of scheduledTweets) {
      try {
        const tweet = await twitterClient.v2.tweet(scheduledTweet.content);
        console.log('Scheduled Post:', tweet.data);

        // Update the ScheduledTweet document after posting
        scheduledTweet.posted = true;
        await scheduledTweet.save();
      } catch (error) {
        console.error('Error posting scheduled tweet:', error);
      }
    }
  } catch (error) {
    console.error('Error checking scheduled tweets:', error);
  }
});

// Post new tweet
router.post('/post', async (req, res) => {
  try {
    const { status, scheduledTime } = req.body;
    console.log('scheduledTime', scheduledTime);
    if (!status || !status.trim()) {
      return res.status(400).json({ message: 'Status cannot be empty' });
    }

    if (scheduledTime) {
      const scheduleDate = new Date(scheduledTime);
      if (scheduleDate > new Date()) {
        // Create a new ScheduledTweet document
        const newScheduledTweet = new ScheduledTweet({
          content: status,
          scheduledAt: scheduleDate,
        });

        // Save the ScheduledTweet to the database
        await newScheduledTweet.save();

        res.json({ message: 'Post scheduled successfully!', scheduledTweet: newScheduledTweet });
      } else {
        return res.status(400).json({ message: 'Scheduled time must be in the future' });
      }
    } else {
      // If no scheduledTime provided, post the tweet immediately
      const tweet = await twitterClient.v2.tweet(status);
      res.json({ id: tweet.data.id, content: tweet.data.text });
    }
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(403).json({ message: 'Forbidden. Check your API keys and permissions.', details: error.message });
  }
});

// Test authorization
router.get('/test-authorization', async (req, res) => {
  try {
    const userDetails = await twitterBearer.v2.user(USER_ID);
    res.json({ message: 'Authorization successful', userDetails: userDetails.data });
  } catch (error) {
    console.error('Error testing authorization:', error);
    res.status(403).json({ message: 'Authorization test failed. Check your API keys and permissions.', details: error.message });
  }
});

module.exports = router;
