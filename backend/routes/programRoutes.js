const express = require('express');
const router = express.Router();
const programModel = require('../models/programModel');

/**
 * GET /api/programs
 * Public programs listing with optional category and status filters
 */
router.get('/', (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 50 } = req.query;
    const result = programModel.findAll({
      category,
      status,
      search,
      page: Number(page),
      limit: Number(limit)
    });
    const stats = programModel.getStats();

    return res.status(200).json({
      success: true,
      programs: result.programs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      stats
    });
  } catch (err) {
    console.error('[programRoutes.getAll] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve programs.'
    });
  }
});

/**
 * GET /api/programs/:id
 * Public single program details
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const program = programModel.findById(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found.'
      });
    }

    return res.status(200).json({
      success: true,
      program
    });
  } catch (err) {
    console.error('[programRoutes.getById] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve program details.'
    });
  }
});

module.exports = router;
