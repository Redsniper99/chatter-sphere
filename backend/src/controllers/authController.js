const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel'); // Assuming you have a Notification model

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Update last seen
    await user.updateLastSeen();

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Logout user
exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

// Google login
exports.googleLogin = async (req, res, next) => {
  try {
    const { googleId, email, username, avatar } = req.body;
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({ googleId, email, username, avatar });
    }

    // Update last seen
    await user.updateLastSeen();

    const token = generateToken(user._id);
    res.json({ message: 'Google login successful', token, user });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Update user status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = req.user;

    await user.updateStatus(status);
    res.json({ message: 'Status updated successfully', status });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Send notification
exports.sendNotification = async (req, res, next) => {
  try {
    const { userId, message } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const notification = new Notification({ user: userId, message });
    await notification.save();

    user.notifications.push(notification._id);
    await user.save();

    res.json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};
