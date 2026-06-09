const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretNetflixCloneKey2026!@#";

// 📝 SIGN UP ROUTE: /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }

    // Check for existing user account
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: "An account with this email already exists." });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      profiles: [{ name: "Primary", avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" }] // Default setup
    });

    await user.save();

    // Create and sign JWT token string
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email } });

  } catch (err) {
    res.status(500).json({ msg: "Server error during registration.", error: err.message });
  }
});

// 🔑 SIGN IN ROUTE: /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email credentials." });
    }

    // Validate incoming raw input against database hash text
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password credentials." });
    }

    // Provide authenticated token session
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email } });

  } catch (err) {
    res.status(500).json({ msg: "Server error during login.", error: err.message });
  }
});

module.exports = router;