const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/verifyToken', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'GET /token/verifyToken Unauthorized no Token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err)
      return res.status(401).json({ message: 'GET /token/verifyToken Unauthorized bad Token' });
  });
});

module.exports = router;
