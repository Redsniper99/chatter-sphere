const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// Send a new message
exports.sendMessage = async (req, res, next) => {
  try {
    const { senderId, chatId, content, media } = req.body;

    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ error: 'Sender not found' });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const message = new Message({ chatId, sender: senderId, content, media });
    await message.save();

    // Update last message in chat
    chat.lastMessage = message._id;
    await chat.save();

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

// Get all messages of a chat
exports.getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username avatar');

    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

// Mark messages as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    await Message.updateMany(
      { chatId, recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};

// Delete a message
exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Edit a message
exports.updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { content },
      { new: true }
    );

    res.json({ message });
  } catch (error) {
    next(error);
  }
};
