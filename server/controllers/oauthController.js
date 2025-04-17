// controllers/oauthController.js
const { exchangeInstagramCode, refreshInstagramToken } = require('../services/oauthService');
const OAuthToken = require('../models/OAuthToken');

exports.handleInstagramAuth = async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange code for tokens
    const tokenData = await exchangeInstagramCode(code);
    
    // Store in database
    await OAuthToken.create({
      userId: req.user.id, // Get from your auth system
      platform: 'instagram',
      accessToken: tokenData.access_token,
      platformUserId: tokenData.user_id,
      platformUsername: tokenData.username,
      expiresAt: tokenData.expires_at,
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Instagram connected successfully' 
    });
  } catch (error) {
    console.error('Instagram auth error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to authenticate with Instagram' 
    });
  }
};

exports.getConnectionStatus = async (req, res) => {
  try {
    const { platform } = req.query;
    const userId = req.user.id; // Get from your auth system
    
    const connection = await OAuthToken.findOne({
      userId,
      platform
    });

    if (!connection) {
      return res.status(404).json({
      connected: false,
      message: 'No connection found for the specified platform'
      });
    }
    res.status(200).json({
      connected: !!connection
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check connection status' });
  }
};