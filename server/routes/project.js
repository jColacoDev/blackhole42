const express = require('express');
const jwt = require('jsonwebtoken');
const MyProject = require('../models/myProject');
const { requireAuth } = require('../middleware/authMiddleware'); // Import middleware
const CoreProject = require('../models/coreProject');
const User = require('../models/user');
const Project = require('../models/project');
const { default: axios } = require('axios');

const router = express.Router();

const fetchProjectsFromApi42_andSaveDatabase = async (page = 1, per_page = 100, cursus_id, accessToken) => {
  const response = await axios.get(`https://api.intra.42.fr/v2/cursus/${cursus_id}/projects`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: {
      page,
      per_page
    }
  });
  return {
    projects: response.data,
    total: parseInt(response.headers['x-total'], 10),
    perPage: parseInt(response.headers['x-per-page'], 10),
    currentPage: parseInt(response.headers['x-page'], 10)
  };
};

router.get('/42project', requireAuth, async (req, res) => {
  const { cursus_id, update } = req.query;
  console.log("here", req.query)
  if (!cursus_id)
    return res.status(400).json({ message: 'GET /projects cursus_id is required' });

  try {
    if (update == 'true') {
      const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      });
      const accessToken = tokenResponse.data.access_token;

      const firstPageData = await fetchProjectsFromApi42_andSaveDatabase(1, 100, cursus_id, accessToken);
      let allProjects = firstPageData.projects;
      const totalProjects = firstPageData.total;
      const totalPages = Math.ceil(totalProjects / firstPageData.perPage);
      
      for (let page = 2; page <= totalPages; page++) {
        const pageData = await fetchProjectsFromApi42_andSaveDatabase(page, 100, cursus_id, accessToken);
        allProjects = allProjects.concat(pageData.projects);
      }
      for (const project of allProjects) {
        await Project.findOneAndUpdate(
          { id: project.id },
          project,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      for (const project of allProjects) {
        const coreProjectUpdate = {
          name: project.name,
          xp: project.difficulty
        };
        await CoreProject.findOneAndUpdate(
          { id: project.id },
          coreProjectUpdate,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      
      console.log("allProjects:", allProjects);
      res.json(allProjects);
    } else {
      const projects = await fetchProjectsFromDatabase(cursus_id);
      res.json(projects);
    }
  } catch (error) {
    res.status(500).json({ message: 'GET /projects Server error' });
  }
});

router.get('/myproject', requireAuth, async (req, res) => {
  const user_id = req.user.id;
  try {
    const user = await User.findById(user_id).populate('myProjects');
    if (!user) {
      return res.status(404).json({ message: 'GET /projects/myproject User not found' });
    }
    res.json(user.myProjects);
  } catch (error) {
    res.status(500).json({ message: 'GET /projects/myproject Server error' });
  }
});

router.get('/coreproject', async (req, res) => {
  try {
    const coreProjects = await CoreProject.find();
    res.status(200).json(coreProjects);
  } catch (error) {
    res.status(500).json({ error: 'GET /projects/coreproject Failed to fetch core projects' });
  }
});

router.put('/myproject/:projectId', requireAuth, async (req, res) => {
  const projectId = req.params.projectId;
  const { grade, start_date, end_date } = req.body;
  try {
    const updatedProject = await MyProject.findOneAndUpdate(
      { id: projectId },
      { grade, start_date, end_date },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'PUT /projects/myproject/:projectId Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'PUT /projects/myproject/:projectId Server error' });
  }
});

const fetchProjectsFromDatabase = async (cursus_id) => {
  try {
    return await Project.find({ 'cursus.id': cursus_id });
  } catch (error) {
    console.error('Error fetching projects from the database:', error);
  }
};

module.exports = router;
