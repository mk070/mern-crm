// backend/routes/instagram.js
const express = require('express');
const upload = require('../upload');
const router = express.Router();
const reelController = require('../controllers/reelController');
// const storyController = require('../controllers/storyController');
const postController = require('../controllers/postController');

// Routes for Reels
router.post('/reel/create-reel', reelController.createReel);
// router.get('/reels', reelController.getAllReels);
// Add more routes for reels as needed

// Routes for Stories
// router.post('/stories/create', storyController.createStory);
// router.get('/stories', storyController.getAllStories);
// Add more routes for stories as needed

// Routes for Posts
router.post('/post/create-post', upload.single('media'), postController.createPost);
router.post('/post/generatecaption',upload.single('media'), postController.caption);
// router.get('/posts', postController.getAllPosts);
// Add more routes for posts as needed

module.exports = router;
