const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}
const postRoutes = require('./routes/postroutes');
const authRoutes = require('./routes/authroutes');
const adminRoutes = require('./routes/adminroutes');
app.use(express.json()); // allow JSON body parsing
app.use(cors({
  origin: 'https://blog-app-bynandana.vercel.app/home', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Mount routes
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

module.exports = app;
