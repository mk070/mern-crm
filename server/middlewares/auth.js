const jwt = require("jsonwebtoken");
const { User } = require("../models/admin");

const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const  id = decoded.id;
    // Check if user still exists
    const user = await User.findById(id);
    // console.log("User from database:", user);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User no longer exists" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }

    return res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};

module.exports = auth;
