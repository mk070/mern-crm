const mongoose = require('mongoose');

const proposalTemplateSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  sections: [String],
  content: String, // The detailed template content for the editor
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProposalTemplate', proposalTemplateSchema);
