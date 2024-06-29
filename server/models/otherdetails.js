const mongoose = require("mongoose");

const OtherDetailsSchema = new mongoose.Schema({
  dob:{ type: Date,required: true},
  position:{ type: String, required: true },
  doj:{type: Date,required: true},
  contact:{ type: Date,required: true},
  


});

const OtherDetails = mongoose.model("OtherDetails", OtherDetailsSchema);

module.exports = OtherDetails;
