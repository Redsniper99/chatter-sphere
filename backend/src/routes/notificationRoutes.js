const express = require('express');
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/authMiddleware'); // Middleware for authentication
const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authenticateUser, getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', authenticateUser, markAsRead);

// Delete a notification
router.delete('/:notificationId', authenticateUser, deleteNotification);

module.exports = router;
