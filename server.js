
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { auth, requireAuth } from './middleware/auth.js';
import userRoutes from './routes/userRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(auth); // Apply auth middleware globally to check for JWT but not require it

// Routes
app.use('/api/users', userRoutes);

// Protected routes - these will require valid JWT token
app.use('/api/clubs', clubRoutes); 
app.use('/api/posts', postRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Campus Connections API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
