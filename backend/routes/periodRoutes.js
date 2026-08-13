const express = require("express");
const Period = require("../models/Period");
const authenticateToken = require("../middleware/auth");
const router = express.Router();


router.post("/add", authenticateToken, async (req, res) => {
  try {
    //console.log(req.body);
    const { lastPeriod, cycleLength, periodLength, monthsToCalculate  } = req.body;

    // Validate data
    if (!lastPeriod || !cycleLength || !periodLength || !monthsToCalculate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new entry
    const newPeriod = new Period({
      userId: req.user.id, // associate with user
      lastPeriod: new Date(lastPeriod),
      cycleLength,
      periodLength,
      monthsToCalculate,
    });

    console.log (newPeriod);
    await newPeriod.save(); // Save to MongoDB
    res.status(201).json({ message: "Period data saved successfully", data: newPeriod });
  } catch (error) {
    console.error("Error saving period data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Session-based endpoint for adding period records
router.post("/add-session", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { lastPeriod, cycleLength, periodLength, monthsToCalculate } = req.body;

  // Validate data
  if (!lastPeriod || !cycleLength || !periodLength || !monthsToCalculate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create new entry
  const newPeriod = new Period({
    userId: req.user._id,
    lastPeriod: new Date(lastPeriod),
    cycleLength,
    periodLength,
    monthsToCalculate,
  });

  newPeriod.save()
    .then(savedPeriod => {
      console.log("Period saved:", savedPeriod);
      res.status(201).json({ message: "Period data saved successfully", data: savedPeriod });
    })
    .catch(error => {
      console.error("Error saving period data:", error);
      res.status(500).json({ error: "Server error" });
    });
});

// Get all period data
router.get("/", async (req, res) => {
  try {
    const periods = await Period.find(); // Fetch all period records from MongoDB
    res.status(200).json(periods);
  } catch (error) {
    console.error("Error fetching period data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const periods = await Period.find({ userId });
    res.json(periods); // returns an array, empty if no data
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Session-based endpoint for user period records
// Get user's period records
// Supports both Passport session authentication and JWT authentication
router.get("/user-session", async (req, res) => {
  try {
    let userId;

    // 1. Check JWT authentication first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const jwt = require("jsonwebtoken");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        userId = decoded.userId;

        console.log("JWT user ID:", userId);
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError.message);
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }

    // 2. If no JWT, check Passport session
    if (!userId && req.isAuthenticated() && req.user) {
      userId = req.user._id;

      console.log("Session user ID:", userId);
    }

    // 3. No authentication
    if (!userId) {
      console.log("User not authenticated");
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 4. Find periods belonging to this user
    console.log("Looking for periods with userId:", userId);

    const periods = await Period.find({ userId });

    console.log("Found periods:", periods);

    res.json(periods);

  } catch (error) {
    console.error("Error fetching periods:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
