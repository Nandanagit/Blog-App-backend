const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv=require("dotenv");
dotenv.config();
const postRoutes = require('./routes/postroutes');
const authRoutes = require('./routes/authroutes');
app.use(express.json()); // allow JSON body parsing
app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Mount routes
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
const PORT = 7000;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
