const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
  },
  phone: { type: String, required: true },
  company: { type: String, required: true },   // updated from "address" to "company"
  source: { type: String, required: true },
  status: { type: String, default: "new" },     // added default value
  budget: { type: String },                     // optional
  notes: { type: String }                       // optional
});

const Lead = mongoose.model("Lead", LeadSchema);

module.exports = Lead;
