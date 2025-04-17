// controllers/oauthController.js
const { exchangeInstagramCode, refreshInstagramToken } = require('../services/oauthService');
const OAuthToken = require('../models/OAuthToken');

exports.handleInstagramAuth = async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange code for tokens
    const tokenData = await exchangeInstagramCode(code);
    
    // Store in database - upsert to handle reconnections
    await OAuthToken.findOneAndUpdate(
      { 
        userId: 1, // Replace with actual user ID from your auth system
        platform: 'instagram'
      },
      {
        accessToken: tokenData.access_token,
        platformUserId: tokenData.user_id,
        platformUsername: tokenData.username,
        expiresAt: tokenData.expires_at,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    
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
    const userId = 1; // Get from your auth system
    
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

// Get user's connected accounts
exports.getConnections = async (req, res) => {
  try {
    const connections = await OAuthToken.find(
      { userId: 1 }, // Replace with actual user ID from your auth system
      'platform platformUsername expiresAt createdAt'
    );
    
    res.status(200).json({ 
      connections: connections.map(conn => ({
        platform: conn.platform,
        username: conn.platformUsername,
        connectedAt: conn.createdAt,
        expiresAt: conn.expiresAt
      }))
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ message: 'Failed to retrieve connected accounts' });
  }
};

// Remove a connection
exports.removeConnection = async (req, res) => {
  try {
    const { platform } = req.params;
    
    const result = await OAuthToken.deleteOne({
      userId: 1,
      platform
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `No connected ${platform} account found` });
    }
    
    res.status(200).json({ message: `${platform} account disconnected successfully` });
  } catch (error) {
    console.error(`Error removing ${req.params.platform} connection:`, error);
    res.status(500).json({ message: `Failed to disconnect ${req.params.platform} account` });
  }
};