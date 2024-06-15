const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/verifyToken', (req, res) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  console.log("Token received:", token);
  console.log("JWT Secret:", process.env.JWT_SECRET);
  // Check if the token is present
  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: 'Unauthorized' });
  }


  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Token is valid, decodedToken contains the payload
    console.log("Token is valid, decoded token:", decodedToken);
    res.json({ message: 'Token is valid', userId: decodedToken.userId });
  });
});

module.exports = router;
