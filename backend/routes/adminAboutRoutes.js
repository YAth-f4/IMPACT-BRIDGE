const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// All endpoints in this router require authentication and administrator privileges
router.use(requireAuth);
router.use(requireAdmin);

// GET /api/admin/about — Retrieve current About content with full administrative metadata
router.get('/', aboutController.getAdminAbout);

// PUT /api/admin/about — Update About content with in-place singleton persistence
router.put('/', aboutController.updateAbout);

// POST /api/admin/about/reset — Reset About content to official defaults
router.post('/reset', aboutController.resetAbout);

module.exports = router;
