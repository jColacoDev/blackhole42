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

      const userProjects = [];
      const existingProjectIds = new Set();

      for (const project of projects) {
        if (!existingProjectIds.has(project.id)) {
          const existingProject = await MyProject.findOne({ id: project.id });

          if (!existingProject) {
            const newProject = new MyProject({
              id: project.id,
              email: userData.email,
              grade: 0,
              start_date: null,
              end_date: null,
            });
            const savedProject = await newProject.save();
            userProjects.push(savedProject);
            existingProjectIds.add(project.id);
          } else {
            // console.warn(`Skipping duplicate project with id ${project.id}`);
          }
        } else {
          // console.warn(`Skipping duplicate project with id ${project.id}`);
        }
      }
      user.myProjects = userProjects.map(project => project._id);
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Server Error in findOrCreateUser:', error);
    throw error;
  }
}

module.exports = { findOrCreateUser };
