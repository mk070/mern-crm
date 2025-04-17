// models/OAuthToken.js
const mongoose = require('mongoose');

const OAuthTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  platform: { type: String, required: true },
  accessToken: { type: String, required: true },
  platformUserId: { type: String, required: true },
  platformUsername: { type: String, required: true },
  expiresAt: { type: Date },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to ensure one connection per platform per user
OAuthTokenSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema);