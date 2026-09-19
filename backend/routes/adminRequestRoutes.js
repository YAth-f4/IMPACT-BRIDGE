const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Enforce strict authentication AND admin role for all routes in this router
router.use(requireAuth);
router.use(requireAdmin);

// Real Admin Analytics & Counts
router.get('/stats', requestController.getAdminStats);

// Find Help Management
router.get('/find-help', requestController.getAllFindHelpRequests);
router.get('/find-help/:id', requestController.getFindHelpRequestById);
router.patch('/find-help/:id/status', requestController.updateFindHelpStatus);

// Fund Raise Management
router.get('/fund-raise', requestController.getAllFundRaiseRequests);
router.patch('/fund-raise/:id/status', requestController.updateFundRaiseStatus);

// Volunteer Applications Management
router.get('/volunteers', requestController.getAllVolunteerApplications);
router.patch('/volunteers/:id/status', requestController.updateVolunteerStatus);

// User Management
router.get('/users', requestController.getAllUsers);
router.patch('/users/:id/role', requestController.updateUserRole);

module.exports = router;
