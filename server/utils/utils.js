const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function extractNameFromEmail(email) {
    return email.substring(0, email.indexOf('@'));
  }
  
function generateSecurePassword() {
    const randomPassword = Math.random().toString(36).slice(-8);
    return bcrypt.hashSync(randomPassword, 10);
}

function generateToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { extractNameFromEmail, generateSecurePassword, generateToken };
