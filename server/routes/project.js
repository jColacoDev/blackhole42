const express = require('express');
const jwt = require('jsonwebtoken');
const MyProject = require('../models/myProject');
const { requireAuth } = require('../middleware/authMiddleware'); // Import middleware
const CoreProject = require('../models/coreProject');
const User = require('../models/user');
const Project = require('../models/project');
const { default: axios } = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
    const { cursus_id, update } = req.query;
    if (!cursus_id) {
      return res.status(400).json({ message: 'cursus_id is required' });
    }
    try {
      if (update === 'true') {
        const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
          grant_type: 'client_credentials',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        });
        const accessToken = tokenResponse.data.access_token;
        const fetchProjectsFromApi42_andSaveDatabase = async (page = 1, per_page = 100) => {
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
            total: response.headers['x-total'],
            perPage: response.headers['x-per-page'],
            currentPage: response.headers['x-page']
          };
        };
        const firstPageData = await fetchProjectsFromApi42_andSaveDatabase();
        let allProjects = firstPageData.projects;
        const totalProjects = firstPageData.total;
        const totalPages = Math.ceil(totalProjects / firstPageData.perPage);
        for (let page = 2; page <= totalPages; page++) {
          const pageData = await fetchProjectsFromApi42_andSaveDatabase(page);
          allProjects = allProjects.concat(pageData.projects);
        }
        for (const project of allProjects) {
          await Project.findOneAndUpdate(
            { id: project.id },
            project,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
        res.json(allProjects);
      } else {
        const projects = await fetchProjectsFromDatabase(cursus_id);
        res.json(projects);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/myproject', requireAuth, async (req, res) => {
    const user_id = req.user.id;
  
    try {
      const user = await User.findById(user_id).populate('myProjects');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.myProjects);
    } catch (error) {
      console.error('Error fetching user projects from the database:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
    
    const fetchProjectsFromDatabase = async (cursus_id) => {
        try {
            const projects = await Project.find({ 'cursus.id': cursus_id });
            return projects;
        } catch (error) {
            console.error('Error fetching projects from the database:', error);
            throw error;
        }
    };

    router.get('/coreproject', async (req, res) => {
      try {
        const coreProjects = await CoreProject.find();
        res.status(200).json(coreProjects);
      } catch (error) {
        console.error('Failed to fetch core projects:', error);
        res.status(500).json({ error: 'Failed to fetch core projects' });
      }
    });

    const { Types } = require('mongoose');

    router.put('/myproject/:projectId', async (req, res) => {
      const projectId = req.params.projectId;
      const { grade, start_date, end_date } = req.body;
    
      console.log("grade:", grade)
      console.log("start_date:", start_date)
      console.log("end_date:", end_date)
      console.log("projectId:", projectId)
      try {
        // if (!Types.ObjectId.isValid(projectId)) {
        //   console.log("here:", projectId)
        //   return res.status(400).json({ message: 'Invalid project ID format' });
        // }
    
        const updatedProject = await MyProject.findOneAndUpdate(
          { id: projectId },
          { grade, start_date, end_date },
          { new: true }
        );
    
        if (!updatedProject) {
          return res.status(404).json({ message: 'Project not found' });
        }
    
        res.json(updatedProject);
      } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    
module.exports = router;
    