const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'impact_bridge_super_secure_jwt_secret_2026_production';

// Helper for email regex validation
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Login user with verified credentials and generate JWT
 */
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Validation
    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address.'
      });
    }

    if (!password || !String(password).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your password.'
      });
    }

    const cleanEmail = String(email).trim();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // 2. Lookup user in database
    const user = userModel.findByEmail(cleanEmail);
    if (!user) {
      // Return non-revealing error
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 3. Verify password hash
    const isMatch = await userModel.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 4. Generate JWT
    const expiresIn = rememberMe ? '7d' : '24h';
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    const safeUser = userModel.toSafeUser(user);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${safeUser.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[authController.login] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to connect right now. Please try again.'
    });
  }
};

/**
 * Register a new user account with persistence
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name.'
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address.'
      });
    }

    const cleanEmail = String(email).trim();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 2. Create user
    try {
      const newUser = await userModel.createUser({
        name: String(name).trim(),
        email: cleanEmail,
        password: String(password),
        role: role || 'guest'
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Please sign in with your credentials.',
        user: newUser
      });
    } catch (createErr) {
      if (createErr.message === 'DUPLICATE_EMAIL') {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }
      throw createErr;
    }
  } catch (err) {
    console.error('[authController.register] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to connect right now. Please try again.'
    });
  }
};

/**
 * Get current authenticated user profile from token
 */
const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (tokenErr) {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please sign in again.'
      });
    }

    const user = userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: userModel.toSafeUser(user)
    });
  } catch (err) {
    console.error('[authController.getMe] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to verify session right now. Please try again.'
    });
  }
};

/**
 * Middleware or verification for admin role authorization
 */
const verifyAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        authorized: false,
        message: 'Authentication required.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (tokenErr) {
      return res.status(401).json({
        success: false,
        authorized: false,
        message: 'Session expired.'
      });
    }

    const user = userModel.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        authorized: false,
        message: 'Access restricted to Administrators.'
      });
    }

    return res.status(200).json({
      success: true,
      authorized: true,
      user: userModel.toSafeUser(user)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      authorized: false,
      message: 'Authorization check failed.'
    });
  }
};

module.exports = {
  login,
  register,
  getMe,
  verifyAdmin,
  JWT_SECRET
};
