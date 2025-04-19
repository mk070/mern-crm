
const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const auth = require("../middleware/auth");

// Login route
router.post("/login", adminAuthController.login);

// Check auth status route (protected)
router.get("/status", auth, adminAuthController.checkAuth);

// Logout route
router.post("/logout", adminAuthController.logout);

module.exports = router;