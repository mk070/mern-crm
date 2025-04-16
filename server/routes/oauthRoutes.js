const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

// This is the Instagram redirect URI
router.get('/instagram/callback', oauthController.instagramCallback);

router.get('/status', oauthController.checkOAuthStatus);


module.exports = router;
