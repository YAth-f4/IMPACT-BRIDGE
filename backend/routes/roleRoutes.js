const express = require('express');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const findHelpModel = require('../models/findHelpRequestModel');
const fundRaiseModel = require('../models/fundRaiseRequestModel');
const volunteerAppModel = require('../models/volunteerApplicationModel');
const donationModel = require('../models/donationModel');

const donorRouter = express.Router();
const volunteerRouter = express.Router();
const beneficiaryRouter = express.Router();
const usersRouter = express.Router();

/**
 * =========================================================
 * DONOR ROLE ENDPOINTS
 * Mounted at /api/donor
 * =========================================================
 */
// GET /api/donor/donations (requireAuth, requireRole('donor'))
donorRouter.get('/donations', requireAuth, requireRole('donor'), (req, res) => {
  try {
    const campaigns = fundRaiseModel.findByUserId(req.user.id);
    const allDonations = donationModel.loadDonations ? donationModel.loadDonations() : [];
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const donorDonations = allDonations
      .filter((d) => (d.email && d.email.toLowerCase().trim() === userEmail) || d.userId === req.user.id)
      .map((d) => donationModel.toSafeDonation(d));

    return res.status(200).json({
      success: true,
      role: 'donor',
      userId: req.user.id,
      donations: donorDonations,
      campaigns,
      count: donorDonations.length
    });
  } catch (err) {
    console.error('[roleRoutes.donor.donations] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve donations.' });
  }
});

/**
 * =========================================================
 * VOLUNTEER ROLE ENDPOINTS
 * Mounted at /api/volunteer
 * =========================================================
 */
// GET /api/volunteer/applications (requireAuth, requireRole('volunteer'))
volunteerRouter.get('/applications', requireAuth, requireRole('volunteer'), (req, res) => {
  try {
    const apps = volunteerAppModel.findByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      role: 'volunteer',
      userId: req.user.id,
      applications: apps,
      count: apps.length
    });
  } catch (err) {
    console.error('[roleRoutes.volunteer.applications] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve volunteer applications.' });
  }
});

/**
 * =========================================================
 * BENEFICIARY ROLE ENDPOINTS
 * Mounted at /api/beneficiary
 * =========================================================
 */
// GET /api/beneficiary/requests (requireAuth, requireRole('beneficiary'))
beneficiaryRouter.get('/requests', requireAuth, requireRole('beneficiary'), (req, res) => {
  try {
    const requests = findHelpModel.findByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      role: 'beneficiary',
      userId: req.user.id,
      requests,
      count: requests.length
    });
  } catch (err) {
    console.error('[roleRoutes.beneficiary.requests] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve beneficiary requests.' });
  }
});

// GET /api/beneficiary/requests/:id (requireAuth, requireRole('beneficiary'))
// Enforces that beneficiary can ONLY access their own request, never another beneficiary's request
beneficiaryRouter.get('/requests/:id', requireAuth, requireRole('beneficiary'), (req, res) => {
  try {
    const request = findHelpModel.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Strict ownership verification (Test J)
    if (request.userId && request.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. You do not have permission to view this request.'
      });
    }

    return res.status(200).json({
      success: true,
      request
    });
  } catch (err) {
    console.error('[roleRoutes.beneficiary.getRequestById] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve request.' });
  }
});

/**
 * =========================================================
 * USER PROFILE ENDPOINTS
 * Mounted at /api/users
 * =========================================================
 */
const authController = require('../controllers/authController');
usersRouter.patch('/me', requireAuth, authController.updateMe);

module.exports = {
  donorRouter,
  volunteerRouter,
  beneficiaryRouter,
  usersRouter
};
