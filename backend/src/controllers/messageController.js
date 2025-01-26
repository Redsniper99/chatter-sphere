const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Send a new message
exports.sendMessage = async (req, res, next) => {
  try {
    const { senderId, recipientId, content, media } = req.body;

    // Validate users
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);
    if (!sender || !recipient) {
      res.status(404);
      throw new Error('Sender or recipient not found');
    }

    // Create a new message
    const message = new Message({ sender: senderId, recipient: recipientId, content, media });
    await message.save();

    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Get chat history between two users
exports.getChatHistory = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    })
      .sort({ createdAt: 1 }) // Sort by timestamp
      .populate('sender', 'username avatar') // Populate sender details
      .populate('recipient', 'username avatar'); // Populate recipient details

    res.json({ messages });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};

// Mark messages as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { userId, senderId } = req.body;

    // Mark all unread messages from a specific sender as read
    await Message.updateMany({ recipient: userId, sender: senderId, isRead: false }, { isRead: true });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};
