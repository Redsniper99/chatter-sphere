const User = require('../models/userModel');

// Search users by username or email
exports.searchUsers = async (req, res, next) => {
  try {
    const query = req.query.query; // Get search query from URL params
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    const users = await User.find(
      {
        $or: [
          { username: new RegExp(query, 'i') }, // Case-insensitive search for username
          { email: new RegExp(query, 'i') } // Case-insensitive search for email
        ]
      },
      'id username avatar' // Select only necessary fields
    );

    res.json(users);
  } catch (error) {
    next(error);
  }
};


