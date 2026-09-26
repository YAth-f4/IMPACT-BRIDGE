const express = require('express');
const router = express.Router();
const messageModel = require('../models/messageModel');

/**
 * POST /api/messages & POST /api/contact
 * Public contact form inquiry submission
 */
router.post('/', (req, res) => {
  try {
    const { senderName, email, phone, category, subject, content } = req.body;

    if (!senderName || !String(senderName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Your name is required.'
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    if (!content || !String(content).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be blank.'
      });
    }

    const newMessage = messageModel.create({
      senderName: String(senderName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      category: category || 'General Public',
      subject: subject ? String(subject).trim() : 'Inquiry via Website Contact Form',
      content: String(content).trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been submitted to the Impact Bridge team. We will respond shortly!',
      data: newMessage
    });
  } catch (err) {
    console.error('[messageRoutes.create] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch message. Please try again.'
    });
  }
});

module.exports = router;
