const User = require('../models/user');
const MyProject = require('../models/myProject');
const { projects } = require('../db'); // Assuming projects is an array of project data
const { generateSecurePassword } = require('./utils');

async function findOrCreateUser(userData) {
  try {
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

      console.log('New user created:', user);

      // Seed initial projects
      const userProjects = [];
      const existingProjectIds = new Set(); // Track existing project ids

      for (const project of projects) {
        if (!existingProjectIds.has(project.id)) {
          userProjects.push({
            id: project.id,
            name: project.name,
            rank: project.rank,
            xp: project.xp,
            maxGrade: project.maxGrade,
            user: user._id
          });
          existingProjectIds.add(project.id);
        } else {
          console.warn(`Skipping duplicate project with id ${project.id}`);
        }
      }

      const createdProjects = await MyProject.insertMany(userProjects);

      console.log('Created projects:', createdProjects);

      // Update user with the seeded projects
      user.myProjects = createdProjects.map(project => project._id);
      await user.save();

      console.log('Updated user with projects:', user);
    }

    return user;
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    throw error; // Ensure errors are propagated up for proper error handling
  }
}

module.exports = { findOrCreateUser };
