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

// Apply CORS to all routes (handles preflight automatically)
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URL) {
    console.error('MONGO_URL environment variable is not set');
    return;
  }

  await mongoose.connect(process.env.MONGO_URL);
  isConnected = true;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
});

module.exports = app;
