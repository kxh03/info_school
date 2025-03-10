
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, name, university } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      name,
      university
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        university: user.university,
        bio: user.bio,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        university: user.university,
        bio: user.bio,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('joinedClubs', 'name description university')
      .populate('adminOfClubs', 'name description university');

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        university: user.university,
        bio: user.bio,
        avatar: user.avatar,
        joinedClubs: user.joinedClubs,
        adminOfClubs: user.adminOfClubs
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('joinedClubs', 'name description university')
      .populate('adminOfClubs', 'name description university');

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        name: user.name,
        university: user.university,
        bio: user.bio,
        avatar: user.avatar,
        joinedClubs: user.joinedClubs,
        adminOfClubs: user.adminOfClubs
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.university = req.body.university || user.university;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.name,
        university: updatedUser.university,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
