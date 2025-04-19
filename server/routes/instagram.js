// routes/instagram.js
const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

// Create an Instagram post immediately
router.post('/publish', auth, upload.single('media'), instagramController.publishPost);

// Schedule an Instagram post for later
router.post('/schedule', auth, upload.single('media'), instagramController.schedulePost);

// Get user's Instagram account details
router.get('/account', auth, instagramController.getAccountDetails);

// Disconnect Instagram account
// router.delete('/disconnect', auth, instagramController.disconnectAccount);

module.exports = router;