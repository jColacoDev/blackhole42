require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const { requireAuth } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const Project = require('./models/project');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_SERVER,
  credentials: true // Allow cookies to be sent back and forth
}));
app.use(express.json());

// Routes
app.use('/api/token', tokenRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
const startMongoDb = async (cloud = false) => {
  const db = cloud ? process.env.DATABASE_CLOUD : process.env.DATABASE;
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(db);
    console.log(`DB Connected: ${db}`);
  } catch (error) {
    console.log('DB connection error', error);
  }
};
startMongoDb(false);

app.get('/api/projects', requireAuth, async (req, res) => {
    try {
        const projects = await Project.find({});
        
        console.log("projects")
        console.log(projects)
        res.json(projects);
    } catch (error) {
        console.log("projects2")
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
