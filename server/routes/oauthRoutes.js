const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');
const auth = require('../middlewares/auth'); // Assuming you have an auth middleware

// This is the Instagram redirect URI
router.post('/instagram', auth,oauthController.handleInstagramAuth);

router.get('/status',auth, oauthController.getConnectionStatus);

router.get('/connections',auth, oauthController.getConnections);

router.delete('/connections/:platform',auth, oauthController.removeConnection);

module.exports = router;
