
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware that checks for a token but doesn't require it
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (err) {
      req.user = null;
    }
    
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// Middleware that requires authentication
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Authentication token invalid' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
