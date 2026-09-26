const express = require('express');
const router = express.Router();
const donationModel = require('../models/donationModel');

/**
 * POST /api/donations
 * Public donation submission
 */
router.post('/', (req, res) => {
  try {
    const {
      donorName,
      email,
      phone,
      amount,
      purpose,
      programId,
      paymentMethod,
      panNumber,
      anonymous,
      message,
      donorType
    } = req.body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum donation amount is ₹100.'
      });
    }

    if (!donorName || !String(donorName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Donor name is required.'
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required for 80G tax receipt generation.'
      });
    }

    const created = donationModel.create({
      donorName,
      email,
      phone,
      amount: parsedAmount,
      purpose: purpose || 'General Impact Fund',
      programId: programId || null,
      paymentMethod: paymentMethod || 'Online Payment Gateway',
      panNumber: panNumber ? String(panNumber).toUpperCase().trim() : '',
      anonymous: Boolean(anonymous),
      message: message || '',
      donorType: donorType || 'Individual Philanthropist'
    });

    return res.status(201).json({
      success: true,
      message: `Thank you! Your donation of ₹${parsedAmount.toLocaleString('en-IN')} has been securely recorded.`,
      donation: created
    });
  } catch (err) {
    console.error('[donationRoutes.create] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to record donation. Please try again.'
    });
  }
});

/**
 * GET /api/donations
 * Public donation metrics and statistics
 */
router.get('/', (req, res) => {
  try {
    const stats = donationModel.getStats();
    const result = donationModel.findAll({ limit: 10 });
    return res.status(200).json({
      success: true,
      stats,
      recentDonations: result.donations
    });
  } catch (err) {
    console.error('[donationRoutes.getStats] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve donation statistics.'
    });
  }
});

module.exports = router;
