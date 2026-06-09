const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 Import streamlined middleware cleanly

// Route: Get all profiles for user
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

// Route: Add a new profile sub-identity
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User account connection instance missing." });
    }

    if (!user.profiles) user.profiles = [];

    if (user.profiles.length >= 5) {
      return res.status(400).json({ msg: "Maximum of 5 profiles allowed." });
    }

    user.profiles.push({ name, avatar });
    await user.save();

    res.status(201).json(user.profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;