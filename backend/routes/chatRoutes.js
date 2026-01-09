const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead
} = require('../controllers/chatController');

// All routes are protected
router.use(protect);

// Chat routes
router.route('/')
  .post(sendMessage);

router.route('/conversations')
  .get(getConversations);

router.route('/:conversationId')
  .get(getMessages);

router.route('/:messageId/read')
  .put(markAsRead);

module.exports = router;