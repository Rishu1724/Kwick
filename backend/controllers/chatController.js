const Message = require('../models/Message');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const asyncHandler = require('express-async-handler');

// @desc    Send a new message
// @route   POST /api/chats
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, productId, message } = req.body;

  // Validate receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error('Receiver not found');
  }

  // Validate equipment exists
  const equipment = await Equipment.findById(productId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }

  // Create conversation ID (sorted concatenation of user IDs)
  const userIds = [req.user._id.toString(), receiverId].sort();
  const conversationId = userIds.join('-');

  const messageData = {
    conversationId,
    senderId: req.user._id,
    receiverId,
    productId,
    message
  };

  const newMessage = new Message(messageData);
  const savedMessage = await newMessage.save();

  // Populate sender and receiver info
  await savedMessage.populate('senderId', 'name email');
  await savedMessage.populate('receiverId', 'name email');
  await savedMessage.populate('productId', 'title dailyRate images');

  res.status(201).json(savedMessage);
});

// @desc    Get all conversations for a user
// @route   GET /api/chats/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  // Get all messages where user is sender or receiver
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id },
      { receiverId: req.user._id }
    ]
  })
  .populate('senderId', 'name email avatar')
  .populate('receiverId', 'name email avatar')
  .populate('productId', 'title dailyRate images')
  .sort({ createdAt: -1 });

  // Group messages by conversation
  const conversations = {};
  
  messages.forEach(message => {
    const otherUserId = message.senderId._id.toString() === req.user._id.toString() 
      ? message.receiverId._id.toString() 
      : message.senderId._id.toString();
      
    const conversationKey = [req.user._id.toString(), otherUserId].sort().join('-');
    
    if (!conversations[conversationKey]) {
      conversations[conversationKey] = {
        conversationId: conversationKey,
        participants: [
          message.senderId._id.toString() === req.user._id.toString() 
            ? message.receiverId 
            : message.senderId,
          req.user
        ],
        product: message.productId,
        lastMessage: message,
        unreadCount: message.receiverId._id.toString() === req.user._id.toString() && !message.isRead ? 1 : 0
      };
    } else {
      // Update last message and unread count
      if (message.createdAt > conversations[conversationKey].lastMessage.createdAt) {
        conversations[conversationKey].lastMessage = message;
      }
      
      if (message.receiverId._id.toString() === req.user._id.toString() && !message.isRead) {
        conversations[conversationKey].unreadCount += 1;
      }
    }
  });

  // Convert to array and sort by last message date
  const conversationsArray = Object.values(conversations);
  conversationsArray.sort((a, b) => 
    new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  );

  res.json(conversationsArray);
});

// @desc    Get messages in a conversation
// @route   GET /api/chats/:conversationId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  // Verify user is part of the conversation
  const userIds = conversationId.split('-');
  if (!userIds.includes(req.user._id.toString())) {
    res.status(401);
    throw new Error('Not authorized to view this conversation');
  }

  const messages = await Message.find({ conversationId })
    .populate('senderId', 'name email avatar')
    .populate('receiverId', 'name email avatar')
    .populate('productId', 'title dailyRate images')
    .sort({ createdAt: 1 });

  // Mark messages as read if user is receiver
  const unreadMessages = messages.filter(
    msg => msg.receiverId._id.toString() === req.user._id.toString() && !msg.isRead
  );

  if (unreadMessages.length > 0) {
    await Message.updateMany(
      { 
        _id: { $in: unreadMessages.map(msg => msg._id) } 
      },
      { isRead: true }
    );
  }

  res.json(messages);
});

// @desc    Mark message as read
// @route   PUT /api/chats/:messageId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Verify user is receiver of the message
  if (message.receiverId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to mark this message as read');
  }

  message.isRead = true;
  const updatedMessage = await message.save();

  res.json(updatedMessage);
});

module.exports = {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead
};