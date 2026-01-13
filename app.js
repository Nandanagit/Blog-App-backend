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

// CORS configuration
const allowedOrigins = [
  'https://blog-app-bynandana.vercel.app',
  'http://localhost:3000' // for local development
];

app.use(cors({
  origin: [
    'https://blog-app-bynandana.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.options('*', cors());


// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Blog API',
    endpoints: {
      auth: '/auth',
      posts: '/posts',
      admin: '/admin'
    }
  });
});

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
