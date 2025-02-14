const mongoose = require("mongoose");
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.createOrGetChat = async (req, res, next) => {
  try {
    let { userId1, userId2 } = req.body;

    // Check if userId1 or userId2 is an email instead of an ID
    if (!mongoose.Types.ObjectId.isValid(userId1)) {
      const user1 = await User.findOne({ email: userId1 });
      if (!user1) return res.status(404).json({ error: "User with userId1 email not found." });
      userId1 = user1._id;
    }

    if (!mongoose.Types.ObjectId.isValid(userId2)) {
      const user2 = await User.findOne({ email: userId2 });
      if (!user2) return res.status(404).json({ error: "User with userId2 email not found." });
      userId2 = user2._id;
    }

    // Ensure both users exist in the database
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    // Query existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    }).populate("participants", "username avatar");

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error creating or getting chat:", error);
    next(error);
  }
};


// Get all chats for a user
exports.getAllChats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format." });
    }

    // Query all chats for the user
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username avatar')
      .populate({
        path: 'lastMessage',
        select: 'content media createdAt isRead',
      })
      .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error("Error fetching all chats:", error);
    next(error);
  }
};

// Delete a chat by ID
exports.deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chatId format." });
    }

    // Delete the chat
    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Error deleting chat:", error);
    next(error);
  }
};

