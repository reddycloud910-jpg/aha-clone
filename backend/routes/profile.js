const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify the user's JWT token locally
const authMiddleware = (req, res, next) => {
  // Support both lowercase 'authorization' and uppercase 'Authorization' headers
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }
  
  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🔥 FIXED: Robust check handles whether your login code saved the ID as decoded.id OR decoded.user.id
    req.userId = decoded.id || decoded.user?.id || decoded.user;
    
    if (!req.userId) {
      return res.status(401).json({ msg: "Token validation failed. User ID payload missing." });
    }
    
    next();
  } catch (err) {
    console.error("JWT Verification Middleware Error:", err.message);
    res.status(401).json({ msg: "Token is invalid." });
  }
};

// Route: Get all profiles for the logged-in user account
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: "User database entry could not be found." });
    }
    res.json(user.profiles || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Add a new profile sub-identity (Max 5)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User account connection instance missing." });
    }

    // Safety fallback initialization to guarantee the array properties exist
    if (!user.profiles) {
      user.profiles = [];
    }

    if (user.profiles.length >= 5) {
      return res.status(400).json({ msg: "Maximum of 5 profiles allowed." });
    }

    const newProfile = { name, avatar };
    user.profiles.push(newProfile);
    await user.save();

    // Returns a 201 status with the complete, newly updated array back to your React app
    res.status(201).json(user.profiles);
  } catch (err) {
    console.error("Profile Add Router Crash Context:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;