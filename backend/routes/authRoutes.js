const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/google
router.post('/google', authController.googleLogin);

// GET /api/auth/me
router.get('/me', authController.getMe);

// PATCH /api/auth/me (User profile update - role immutable)
router.patch('/me', requireAuth, authController.updateMe);

// GET /api/auth/verify-admin
router.get('/verify-admin', authController.verifyAdmin);

module.exports = router;
