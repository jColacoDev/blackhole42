const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { requireAuth } = require('../middleware/authMiddleware'); // Import middleware
const bcrypt = require('bcryptjs');
const Level = require('../models/level');

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'GET /user not found get user' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'GET /user Server error' });
  }
});

router.get('/levels', async (req, res) => {
  console.log("here")
  try {
    const levels = await Level.find();
    console.log("levels",levels)
    res.status(200).json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ message: 'GET /levels Server error' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'PUT /user user not found)' });

    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.daily_hours) user.daily_hours = req.body.daily_hours;
    if (req.body.weekly_days) user.weekly_days = req.body.weekly_days;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'PUT /user user Server error' });
  }
});

module.exports = router;
