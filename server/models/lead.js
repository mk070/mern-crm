const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  sno: { type: Number, required: true, unique: true }, // Added unique constraint
  name: { type: String, required: true },
  email: { type: String, required: true, match: [/.+\@.+\..+/, 'Please fill a valid email address'] }, // Added regex validation for email
  phone: { type: String, required: true }, // Changed to String to handle different formats
  address: { type: String, required: true },
  source: { type: String, required: true },
});

const Lead = mongoose.model("Lead", LeadSchema);

module.exports = Lead;
