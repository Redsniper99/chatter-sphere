const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatMessages,
  markAsRead,
  deleteMessage,
  updateMessage
} = require('../controllers/messageController');

// Send a message
router.post('/send', sendMessage);

// Get all messages in a chat
router.get('/:chatId', getChatMessages);

// Mark messages as read
router.patch('/mark-as-read', markAsRead);

// Delete a message
router.delete('/:messageId', deleteMessage);

// Edit a message
router.patch('/:messageId', updateMessage);

module.exports = router;
