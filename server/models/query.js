const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    query: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const QueryModel = mongoose.model('Query', QuerySchema);
  module.exports = QueryModel;