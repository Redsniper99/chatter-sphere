const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, markAsRead } = require('../controllers/messageController');

// Send a message
router.post('/send', sendMessage);

// Get chat history between two users
router.get('/history/:userId1/:userId2', getChatHistory);

// Mark messages as read
router.post('/mark-as-read', markAsRead);

module.exports = router;
