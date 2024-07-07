const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware for authorization header
const setTwitterAuthHeader = (req, res, next) => {
  req.headers.authorization = `Bearer ${process.env.TWITTER_BEARER_TOKEN}`;
  next();
};

// Fetch X posts
router.get('/posts', setTwitterAuthHeader, async (req, res) => {
  try {
    const response = await axios.get('https://api.twitter.com/2/tweets', {
      headers: req.headers
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching X posts:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// Post new tweet
router.post('/post', setTwitterAuthHeader, async (req, res) => {
  try {
    const response = await axios.post('https://api.twitter.com/2/tweets', {
      status: req.body.content
    }, {
      headers: req.headers
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error posting to X:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
