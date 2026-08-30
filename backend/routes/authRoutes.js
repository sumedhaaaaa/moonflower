const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const User = require("../models/User");
const twilio = require('twilio');

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedFrontendUrls = [
  FRONTEND_URL,
  ...(process.env.ADDITIONAL_FRONTEND_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
].map((url) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}).filter(Boolean);

const getFrontendUrl = (candidate) => {
  try {
    const origin = new URL(candidate).origin;
    return allowedFrontendUrls.includes(origin) ? origin : FRONTEND_URL;
  } catch {
    return FRONTEND_URL;
  }
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

// Registration endpoint (for new account creation)
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({ 
      username: fullName, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();
    
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Legacy signup endpoint (keeping for compatibility)
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.json({ message: "User registered successfully" });
});

// Session-based login (for Google OAuth compatibility)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set user in session (for session-based auth)
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      res.json({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          photo: user.photo,
          googleId: user.googleId,
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// JWT-based login (legacy)
router.post("/login-jwt", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
  res.json({ token, userId: user._id, username: user.username });
});

// Logout endpoint
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// Google OAuth
router.get("/google", (req, res, next) => {
  // Store the approved frontend in the OAuth session so the callback returns
  // the user to the same app instance that started the login.
  req.session.oauthFrontendUrl = getFrontendUrl(req.query.returnTo);
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    const frontendUrl = getFrontendUrl(req.session.oauthFrontendUrl);

    passport.authenticate("google", { session: false }, (authError, user) => {
      delete req.session.oauthFrontendUrl;

      if (authError || !user) {
        if (authError) console.error("Google OAuth error:", authError);
        return res.redirect(`${frontendUrl}/login`);
      }

      try {
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.redirect(`${frontendUrl}/?token=${encodeURIComponent(token)}`);
      } catch (error) {
        console.error("Google JWT error:", error);
        res.redirect(`${frontendUrl}/login`);
      }
    })(req, res, next);
  }
);

// Get current user info
router.get("/me", async (req, res) => {
  try {
    // Check JWT from Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user) {
          return res.json({
            username: user.username,
            email: user.email,
            photo: user.photo,
            googleId: user.googleId,
          });
        }
        // No user for this token — fall through to session check below
      } catch (jwtErr) {
        // Expired/invalid token — fall through to session check instead of failing here
      }
    }

    // Keep existing session-based authentication working
    if (req.isAuthenticated() && req.user) {
      const { username, email, photo, googleId } = req.user;
      return res.json({ username, email, photo, googleId });
    }

    return res.status(401).json({ message: "Not authenticated" });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Send OTP to phone
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number required" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone, otp });
  } else {
    user.otp = otp;
  }
  await user.save();
  try {
    await twilioClient.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: twilioPhone,
      to: phone
    });
    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Twilio error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });
  const user = await User.findOne({ phone });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  user.otp = undefined;
  await user.save();
  // Issue JWT
  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
  res.json({ token, userId: user._id });
});

module.exports = router;
