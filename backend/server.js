require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware'); // Path to our separated middleware file

const app = express();

// 1. CORS & PARSING MIDDLEWARE
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Added fallback React ports
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// 2. MOUNT AUTHENTICATION CHECKER GLOBALLY
app.use(authMiddleware);

// 3. DATABASE CONNECTION
// (Ensure MONGO_URI is set in your .env file or fallback to local string context)
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/netflixClone";
mongoose.connect(mongoURI)
  .then(() => console.log("🚀 MongoDB connected successfully!"))
  .catch((error) => console.error("❌ DB connection failed:", error.message));

// 4. ROUTE MOUNT HOOKS
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profile'));

app.get('/', (req, res) => res.send("Netflix Clone API is running perfectly."));

// 5. SERVER RUNTIME PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📡 Server running on port: ${PORT}`));

