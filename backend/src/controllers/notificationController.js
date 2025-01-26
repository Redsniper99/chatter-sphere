const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

// Get all notifications for a user
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id; // Authenticated user ID from middleware
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found.');
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found.');
    }

    res.json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};
