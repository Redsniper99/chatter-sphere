const express = require('express');
const router = express.Router();
const {
  createOrGetChat,
  getAllChats,
  deleteChat
} = require('../controllers/chatController');

// Create or get an existing chat
router.post('/', createOrGetChat);

// Get all chats for a user
router.get('/:userId', getAllChats);

// Delete a chat (Optional)
router.delete('/:chatId', deleteChat);

module.exports = router;
