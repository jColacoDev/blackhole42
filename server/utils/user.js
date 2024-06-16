const User = require('../models/user');
const MyProject = require('../models/myProject');
const CoreProject = require('../models/coreProject');
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

      const userProjects = [];
      const existingProjectIds = new Set(); // Track existing project ids

      for (const project of projects) {
        if (!existingProjectIds.has(project.id)) {
          const existingProject = await MyProject.findOne({ id: project.id });

          if (!existingProject) {
            // Create a new MyProject document for each CoreProject
            const newProject = new MyProject({
              id: project.id,
              email: userData.email, // User's email
              grade: 0,
              start_date: null,
              end_date: null,
            });
            const savedProject = await newProject.save();
            userProjects.push(savedProject);
            existingProjectIds.add(project.id);
          } else {
            console.warn(`Skipping duplicate project with id ${project.id}`);
          }
        } else {
          console.warn(`Skipping duplicate project with id ${project.id}`);
        }
      }

      // Update user with the seeded projects
      user.myProjects = userProjects.map(project => project._id);
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
