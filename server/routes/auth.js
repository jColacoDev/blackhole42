const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const axios = require('axios');
const { findOrCreateUser } = require('../utils/user');
const { generateToken } = require('../utils/utils');

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Seed initial projects
    const userProjects = projects.map(project => ({
      ...project,
      user: newUser._id
    }));
    const createdProjects = await MyProject.insertMany(userProjects);

    // Update user with the seeded projects
    newUser.myProjects = createdProjects.map(project => project._id);
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ userId: newUser._id, token });
  } 
  catch (err) {
    console.error('Error signing up user:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user, token });
  }
  catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    // Step 1: Request access token from 42 API
    const response = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NODE_SERVER}/api/auth/callback`
    });
    const { access_token } = response.data;

    // Step 2: Fetch user data from 42 API using access token
    const userResponse = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const userData = userResponse.data;
    
    // Step 3: Extract specific fields from userData
    const {
      id,
      email,
      login,
      first_name,
      url,
      image,
      pool_month,
      pool_year,
      cursus_users,
      projects_users
    } = userData;

    const formattedUserData = {
      id,
      email,
      login,
      first_name,
      url,
      image: image.link,
      pool_month,
      pool_year,
      cursus_id: cursus_users[1].cursus_id,
      cursus_user_level: cursus_users[1].level,
      cursus_user_blackholed_at: cursus_users[1].blackholed_at,
      cursus_user_created_at: cursus_users[1].created_at,
      projects_users
    };

    // Step 4: Find or create user in database
    const user = await findOrCreateUser(userData);
    // Step 5: Generate JWT token for the user
    const token = generateToken(user);

    // Step 6: Send formattedUserData and token to frontend
    const redirectUrl = `${process.env.NEXT_PUBLIC_SERVER}/auth/redirect?token=${token}&user=${encodeURIComponent(JSON.stringify(formattedUserData))}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Error in 42 authentication callback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
