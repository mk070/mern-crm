const mongoose = require('mongoose');

const OAuthTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  platform: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresIn: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema);
