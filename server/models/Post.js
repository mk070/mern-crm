const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String },
    platforms: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          // WARNING: This might be causing the error if it tries to parse the platforms value
          console.log('Post schema validating platforms:', v);
          return Array.isArray(v) && v.length > 0;
        },
        message: props => `${props.value} is not a valid platforms array`
      }
    },
    status: { type: String, required: true, enum: ['draft', 'scheduled', 'published', 'failed'] },
    publishedAt: { type: Date },
    platformPostId: { type: String }
  });

module.exports = mongoose.model('Post', postSchema);
