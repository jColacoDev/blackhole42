const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    console.error('No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error('Token verification error');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        console.error('User not found middleware');
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = { requireAuth };
