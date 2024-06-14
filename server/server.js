require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const project = require('./models/project');
require('dotenv').config();
const { requireAuth } = require('./middleware/authMiddleware.js');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

const startMongoDb = async (cloud = false) => {
    const db = cloud ? process.env.DATABASE_CLOUD : process.env.DATABASE;
    try{
        mongoose.set("strictQuery", false);
        const success = await mongoose.connect(db, { })
        
        console.log(`DB Connected:`)
        if(cloud) console.log(` cloud mongoDB at jColacoDev db`)
        else console.log(` local mongoDB at ${process.env.DATABASE}`)
        
    } catch (error){
        console.log('DB connection error',error)
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

app.listen(process.env.PORT, () => console.log(`http server is ready at http://localhost:${process.env.PORT}`));
