const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

// Create or retrieve a private chat between two users
const createChat =  async (req, res) => {
  const { userId1, userId2 } = req.body; // IDs of the two users

  if (!userId1 || !userId2) {
    return res.status(400).json({ message: 'Both users are required' });
  }

  try {
    // Check if a chat already exists between these users
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    });

    // If chat doesn't exist, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [userId1, userId2],
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Send a message in a private chat
const sendMessage = async (req, res) => {
  const { senderId, receiverId, messageContent } = req.body;

  if (!senderId || !receiverId || !messageContent) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find or create a chat between sender and receiver
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create a new message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
    });

    await message.save();

    // Add message to the chat's messages array
    chat.messages.push(message);
    await chat.save();

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Get all messages from a private chat
const getAllMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch chat by ID and populate the messages
    const chat = await Chat.findById(chatId).populate('messages');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = router;
