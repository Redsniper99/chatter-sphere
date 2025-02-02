const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, markAsRead, getAllChats } = require('../controllers/messageController');

// Send a message
router.post('/send', sendMessage);

// get all chats
router.get("/all/:userId", getAllChats); // Get all chats for a user


// Get chat history between two users
router.get('/history/:userId1/:userId2', getChatHistory);

// Mark messages as read
router.post('/mark-as-read', markAsRead);

module.exports = router;
