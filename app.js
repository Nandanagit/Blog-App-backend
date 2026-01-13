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
  'https://nandana-blog.vercel.app',
  'http://localhost:3000' // for local development
];

// Handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// // Apply CORS to all routes
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // Normalize the origin by removing trailing slashes
//     const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
//     if (allowedOrigins.includes(normalizedOrigin)) {
//       return callback(null, true);
//     } else {
//       console.log('CORS blocked for origin:', origin);
//       return callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Length', 'Authorization']
// }));


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
