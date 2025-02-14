const express = require('express');
const { searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

const router = express.Router();

// Search for users (Protected route)
router.get('/search', searchUsers);

module.exports = router;
