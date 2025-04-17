// services/oauthService.js
const axios = require('axios');

exports.exchangeInstagramCode = async (code) => {
  try {
    // Step 1: Exchange code for short-lived token
    const tokenResponse = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      
      new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const { access_token, user_id } = tokenResponse.data;
    
    // Step 2: Get user information
    const userResponse = await axios.get(
      `https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`
    );
    
    const { username } = userResponse.data;
    
    // Step 3: Get long-lived token
    const longTokenResponse = await axios.get(
      'https://graph.instagram.com/access_token',
      {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          access_token
        }
      }
    );
    
    const longLivedToken = longTokenResponse.data.access_token;
    const expiresIn = longTokenResponse.data.expires_in;
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
    
    return {
      access_token: longLivedToken,
      user_id,
      username,
      expires_at: expiresAt
    };
  } catch (error) {
    console.error('Instagram token exchange error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Instagram');
  }
};