require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const project = require('./models/project');
const { requireAuth } = require('./middleware/authMiddleware.js');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to handle JSON parsing and CORS
app.use(express.json());
app.use(cors());

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
        console.log(`DB Connected:`);
        if (cloud) console.log(` cloud mongoDB at jColacoDev db`);
        else console.log(` local mongoDB at ${process.env.DATABASE}`);
    } catch (error) {
        console.log('DB connection error', error);
    }
};
startMongoDb(false);

app.get('/api/projects', requireAuth, async (req, res) => {
    try {
        const projects = await project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
