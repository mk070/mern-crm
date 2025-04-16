const axios = require('axios');
const OAuthToken = require('../models/OAuthToken');

exports.exchangeInstagramCode = async (code, redirectUri) => {
  const response = await axios.post(
    'https://api.instagram.com/oauth/access_token',
    new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data; // includes access_token, user_id, etc.
};

exports.saveOAuthToken = async ({ userId, platform, accessToken, refreshToken, expiresIn }) => {
  await OAuthToken.findOneAndUpdate(
    { userId, platform },
    { accessToken, refreshToken, expiresIn, createdAt: new Date() },
    { upsert: true, new: true }
  );
};
