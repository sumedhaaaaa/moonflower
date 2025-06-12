const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model
const authMiddleware = require("../middleware/auth"); // Authentication middleware

// Fetch the authenticated user’s first name
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("firstName");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
