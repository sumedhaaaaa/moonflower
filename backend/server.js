// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require('cors');
// const path = require("path");
// const http = require("http"); // Required for WebSockets
// const periodRoutes = require("./routes/periodRoutes");
// require("dotenv").config();

// const app = express();
// app.use(express.static(path.join(__dirname, "../public"))); // Serve static files

// app.get("/favicon.ico", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "favicon.ico"), (err) => {
//       if (err) {
//           console.error("Favicon not found:", err);
//           res.status(404).send("Favicon not found");
//       }
//   });
// });

// const server = http.createServer(app); // Create an HTTP server
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Ensure this matches your frontend URL
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   },
// });
// app.use((req, res, next) => {
//   res.setHeader(
//       "Content-Security-Policy",
//       "default-src 'self'; img-src 'self' data:;"
//   );
//   next();
// });

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:3000", // Allow all origins temporarily for debugging
//   methods: ["GET", "POST"],
// }));


// // Debugging: Check if MONGO_URI is loaded
// if (!process.env.MONGO_URI) {
//   console.error("❌ MONGO_URI is missing in .env file");
//   process.exit(1);
// } else {
//   console.log("✅ MONGO_URI Loaded");
// }

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB connected successfully"))
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// // WebSocket Connection
// io.on("connection", (socket) => {
//   console.log("🌐 WebSocket connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("🔌 WebSocket disconnected:", socket.id);
//   });
// });

// // Import Routes

// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/user");
// const articleRoutes = require("./routes/articleRoutes"); // Import the articles route


// // Use Routes
// console.log("✅ Registering Period Routes...");

// app.use("/api/periods", periodRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/articles", articleRoutes);

// // Test Route
// app.get("/", (req, res) => {
//   console.log("sumedha");
//   res.send("🌙 MoonFlower Backend is Running");
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));









require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const session = require('express-session');
const passport = require('./config/passport');

const frontendOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
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

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header are server-to-server or direct browser navigations.
    if (!origin || frontendOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "moonflower_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  },
}));

app.use(passport.initialize());
app.use(passport.session());

const MONGO_URI = process.env.MONGO_URI;


// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));



const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/articleRoutes");
const periodRoutes = require("./routes/periodRoutes");


app.get('/', (req, res) => {
  res.send('<h1> Hello, World! </h1>');
});

app.use("/api/periods", periodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/articles", articleRoutes);

// Update CSP to allow images from self, Google, and data URIs
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https://lh3.googleusercontent.com data:;"
  );
  next();
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
