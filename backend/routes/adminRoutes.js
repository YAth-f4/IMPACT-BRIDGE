const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

/**
 * =========================================================================
 * STRICT ADMIN AUTHORIZATION
 * Every /api/admin/* route strictly enforces requireAuth + requireAdmin.
 * Guests return 401 Unauthorized.
 * Non-admin roles (DONOR, VOLUNTEER, BENEFICIARY) return 403 Forbidden.
 * Database is the single source of truth; never trusts client-side roles.
 * =========================================================================
 */
router.use(requireAuth);
router.use(requireAdmin);

// 1. Dashboard Summary
router.get('/dashboard', adminController.getDashboardSummary);
router.get('/stats', adminController.getDashboardSummary); // Backward-compatibility alias

// 2. User Management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/role', adminController.updateUserRole);

// 3. NGO Admin Management
router.get('/ngos', adminController.getNgos);
router.get('/ngos/:id', adminController.getNgoById);
router.patch('/ngos/:id/status', adminController.updateNgoStatus);

// 4. Find Help Request Management
router.get('/help-requests', adminController.getHelpRequests);
router.get('/help-requests/:id', adminController.getHelpRequestById);
router.patch('/help-requests/:id/status', adminController.updateHelpRequestStatus);

// Help request aliases for frontend compatibility
router.get('/find-help', adminController.getHelpRequests);
router.get('/find-help/:id', adminController.getHelpRequestById);
router.patch('/find-help/:id/status', adminController.updateHelpRequestStatus);

// 5. Fund Raise Management
router.get('/fund-raises', adminController.getFundRaises);
router.get('/fund-raises/:id', adminController.getFundRaiseById);
router.patch('/fund-raises/:id/status', adminController.updateFundRaiseStatus);

// Fund raise aliases for frontend compatibility
router.get('/fund-raise', adminController.getFundRaises);
router.get('/fund-raise/:id', adminController.getFundRaiseById);
router.patch('/fund-raise/:id/status', adminController.updateFundRaiseStatus);

// 6. Donations Management
router.get('/donations', adminController.getDonations);
router.post('/donations', adminController.createDonation);

// 7. Program Management
router.get('/programs', adminController.getPrograms);
router.get('/programs/:id', adminController.getProgramById);
router.post('/programs', adminController.createProgram);
router.put('/programs/:id', adminController.updateProgram);
router.delete('/programs/:id', adminController.deleteProgram);

// 8. Messages / Contact Requests
router.get('/messages', adminController.getMessages);
router.get('/messages/:id', adminController.getMessageById);
router.patch('/messages/:id/status', adminController.updateMessageStatus);
router.delete('/messages/:id', adminController.deleteMessage);

// 9. Verified Hub Management
router.get('/verified-hubs', adminController.getVerifiedHubs);
router.get('/verified-hubs/:id', adminController.getVerifiedHubById);
router.post('/verified-hubs', adminController.createVerifiedHub);
router.put('/verified-hubs/:id', adminController.updateVerifiedHub);
router.delete('/verified-hubs/:id', adminController.deleteVerifiedHub);

// 10. Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

// 11. Volunteer Applications (Existing system compatibility)
router.get('/volunteers', adminController.getVolunteerApplications);
router.patch('/volunteers/:id/status', adminController.updateVolunteerStatus);

module.exports = router;
