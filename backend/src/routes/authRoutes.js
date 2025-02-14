const express = require('express');
const {
  getProfile,
  register,
  login,
  logout,
  googleLogin,
  updateStatus,
  sendNotification,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// User Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.post('/google-login', googleLogin);
router.get('/profile', authenticateUser, getProfile);

// User Profile and Status Routes
router.patch('/status', authenticateUser, updateStatus);

// Notification Routes
router.post('/send-notification', authenticateUser, sendNotification);

module.exports = router;
