// server/controllers/adminAuthController.js

const { User } = require("../models/admin");
const Joi = require("joi");

// Validate login input
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

// Login controller
exports.login = async (req, res) => {
  try {
    // Validate request body
    const { error } = validateLogin(req.body);
    // Check for validation errors
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: error.details[0].message 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false,             
        message: "Invalid email or password" 
      });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(req.body.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();
    console.log(token)
    // Set token in HTTP-only cookie for added security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return success without exposing token in response body
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        // lastName: user.lastName,
        // role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
};

// Check auth status
exports.checkAuth = async (req, res) => {
  // If this point is reached, the auth middleware has already verified the token
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    },
  });
};

// Logout controller
exports.logout = (req, res) => {
    res.clearCookie('token'); // Clear auth cookie
    res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = exports;