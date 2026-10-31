
const express = require("express");
const { registerController, loginController, getProfileController } = require("../controllers/authController");

//Middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Student registration
router.post("/register", registerController);
router.post("/login", loginController);

// Protected profile route
router.get("/profile", protect, getProfileController);

module.exports = router;
