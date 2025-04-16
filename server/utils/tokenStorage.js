const OAuthToken = require('../models/OAuthToken');

exports.getToken = async (userId, platform) => {
  const token = await OAuthToken.findOne({ userId, platform });
  if (!token) throw new Error('Token not found');
  return token;
};
