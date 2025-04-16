const oauthService = require('../services/oauthService');
const OAuthToken = require('../models/OAuthToken');

exports.instagramCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.user.id; // get this from JWT/session
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    const tokenData = await oauthService.exchangeInstagramCode(code, redirectUri);

    await oauthService.saveOAuthToken({
      userId,
      platform: 'instagram',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    });

    res.redirect(`${process.env.FRONTEND_URL}/connected?platform=instagram`);
  } catch (err) {
    console.error('Instagram OAuth Error:', err);
    res.status(500).json({ error: 'OAuth failed' });
  }
};


exports.checkOAuthStatus = async (req, res) => {
  try {
    const { platform } = req.query;
    const userId = req.user?.id; // Ensure you have authentication middleware

    if (!userId || !platform) {
      return res.status(400).json({ connected: false });
    }

    const token = await OAuthToken.findOne({ userId, platform });

    if (token) {
      return res.status(200).json({ connected: true });
    } else {
      return res.status(200).json({ connected: false });
    }
  } catch (error) {
    console.error('OAuth status check failed:', error);
    res.status(500).json({ connected: false });
  }
};
