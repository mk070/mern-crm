const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

// This is the Instagram redirect URI
router.post('/instagram', oauthController.handleInstagramAuth);

router.get('/status', oauthController.getConnectionStatus);

router.get('/connections', oauthController.getConnections);

router.delete('/connections/:platform', oauthController.removeConnection);

module.exports = router;
