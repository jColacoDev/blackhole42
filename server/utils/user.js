const User = require('../models/user');

async function findOrCreateUser(userData) {
  let user = await User.findOne({ email: userData.email });

  if (!user) {
      const name = userData.login || extractNameFromEmail(userData.email);
      const password = generateSecurePassword();

      user = new User({
          email: userData.email,
          password: password,
          name: name,
      });
      await user.save();
  }
  return user;
}

module.exports = { findOrCreateUser };
