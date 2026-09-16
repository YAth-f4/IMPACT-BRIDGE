const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'impact_bridge_super_secure_jwt_secret_2026_production';

/**
 * Authentication Middleware: Verifies JWT token and binds authentic user to req.user.
 * Rejects requests with 401 if missing, invalid, or expired token.
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError'
          ? 'Session has expired. Please sign in again.'
          : 'Invalid authentication token.'
      });
    }

    const user = userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account associated with this session no longer exists.'
      });
    }

    req.user = userModel.toSafeUser(user);
    req.userRole = user.role;
    next();
  } catch (err) {
    console.error('[authMiddleware.requireAuth] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal error verifying authentication.'
    });
  }
};

/**
 * Role Authorization Middleware: Ensures authenticated user has admin role.
 * Rejects non-admin authenticated users with 403 Forbidden.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Administrator privileges are required to perform this action.'
    });
  }
  next();
};

/**
 * Generic Role-Based Authorization Helper
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${roles.join(' or ')}.`
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireRole,
  JWT_SECRET
};
