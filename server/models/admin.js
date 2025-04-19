const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");

const adminSchema = new mongoose.Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	confirmpassword: { type: String, required: true },
});

// Method to generate auth token
adminSchema.methods.generateAuthToken = function() {
	// Generate JWT with user id and role
	return jwt.sign(
	  { 
		id: this._id,
		email: this.email,
		// role: this.role,
	  },
	  process.env.JWT_SECRET,
	  { expiresIn: "24h" } // Token expires in 24 hours
	);
  };
  
  // Pre save hook to hash passwords
  adminSchema.pre("save", async function(next) {
	if (!this.isModified("password")) return next();
	
	try {
	  const salt = await bcrypt.genSalt(10);
	  this.password = await bcrypt.hash(this.password, salt);
	  next();
	} catch (error) {
	  next(error);
	}
  });
  
  // Compare password method
  adminSchema.methods.comparePassword = async function(password) {
	return await bcrypt.compare(password, this.password);
  };
  
  const User = mongoose.model("admin", adminSchema);
  
  module.exports = { User };