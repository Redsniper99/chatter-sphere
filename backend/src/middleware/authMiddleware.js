const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user; // Attach the user to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};
