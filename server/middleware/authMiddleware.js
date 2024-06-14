const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        const user = await User.findById(decodedToken.userId);
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { requireAuth };
