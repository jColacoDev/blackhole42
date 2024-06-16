// routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { requireAuth } = require('../middleware/authMiddleware'); // Import middleware
const bcrypt = require('bcryptjs');

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields based on request body
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.daily_hours) user.daily_hours = req.body.daily_hours;
    if (req.body.weekly_days) user.weekly_days = req.body.weekly_days;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
