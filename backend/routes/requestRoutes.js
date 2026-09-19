const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { requireAuth } = require('../middleware/authMiddleware');

// FIND HELP ROUTES
router.post('/find-help', (req, res, next) => {
  // Optional auth: if token is present, decode it, otherwise allow guest submission
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return requireAuth(req, res, next);
  }
  next();
}, requestController.submitFindHelp);

router.get('/my-find-help', requireAuth, requestController.getMyFindHelpRequests);
router.get('/find-help/track/:id', requestController.trackFindHelpRequest);

// FUND RAISE ROUTES
router.post('/fund-raise', requireAuth, requestController.submitFundRaise);
router.get('/my-fund-raise', requireAuth, requestController.getMyFundRaiseRequests);
router.get('/fund-raise/approved', requestController.getApprovedFundraisers);

// VOLUNTEER ROUTES
router.post('/volunteer', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return requireAuth(req, res, next);
  }
  next();
}, requestController.submitVolunteerApplication);

router.get('/my-volunteer', requireAuth, requestController.getMyVolunteerApplications);
router.post('/my-volunteer/log-hours', requireAuth, requestController.logVolunteerHours);

module.exports = router;
