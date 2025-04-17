const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

// This is the Instagram redirect URI
router.get('/instagram', oauthController.handleInstagramAuth);

router.get('/status', oauthController.getConnectionStatus);


module.exports = router;
