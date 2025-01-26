const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient user
    message: { type: String, required: true }, // Notification message
    isRead: { type: Boolean, default: false }, // Status of the notification
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Notification', notificationSchema);
