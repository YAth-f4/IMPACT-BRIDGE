const express = require('express');
const router = express.Router();
const adminRouter = express.Router();
const ngoController = require('../controllers/ngoController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public & User NGO endpoints
router.post('/', requireAuth, ngoController.submitNgo);
router.post('/register', requireAuth, ngoController.submitNgo);
router.get('/', ngoController.getPublicNgos);
router.get('/my', requireAuth, ngoController.getMyNgos);
router.get('/my/submissions', requireAuth, ngoController.getMyNgos);
router.get('/:id', (req, res, next) => {
  // Optional auth: check if user token is present to allow owner/admin to preview unapproved NGOs
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return requireAuth(req, res, next);
  }
  next();
}, ngoController.getPublicNgoById);
router.put('/:id', requireAuth, ngoController.updateMyNgo);
router.post('/:id/resubmit', requireAuth, ngoController.resubmitNgo);

// Admin review endpoints
adminRouter.get('/', requireAuth, requireAdmin, ngoController.adminGetAllNgos);
adminRouter.get('/:id', requireAuth, requireAdmin, ngoController.adminGetNgoById);
adminRouter.patch('/:id/status', requireAuth, requireAdmin, ngoController.adminUpdateStatus);

module.exports = {
  ngoRouter: router,
  adminNgoRouter: adminRouter
};
