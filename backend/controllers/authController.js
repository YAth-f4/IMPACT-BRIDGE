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

/**
 * Real Google OAuth / GIS Credential Verification and Login
 * Authenticates user through official Google verification, looks up or creates user in database,
 * preserves database roles, and generates standard Impact Bridge JWT.
 */
const googleLogin = async (req, res) => {
  try {
    const { credential, accessToken, code } = req.body || {};

    if (!credential && !accessToken && !code) {
      return res.status(400).json({
        success: false,
        message: 'No Google authentication credentials were provided.'
      });
    }

    const { OAuth2Client } = require('google-auth-library');
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const googleOAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

    let verifiedPayload = null;

    // 1. Verify Google ID Token (JWT from Google Identity Services)
    if (credential) {
      try {
        const ticket = await googleOAuthClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID || undefined
        });
        verifiedPayload = ticket.getPayload();
      } catch (idErr) {
        // Fallback to Google's official public tokeninfo endpoint for resilience
        try {
          const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
          if (verifyRes.ok) {
            const data = await verifyRes.json();
            if (GOOGLE_CLIENT_ID && data.aud && data.aud !== GOOGLE_CLIENT_ID) {
              return res.status(401).json({
                success: false,
                message: 'Invalid token audience.'
              });
            }
            verifiedPayload = data;
          } else {
            console.error('[Google Auth] Token verification failed:', idErr.message);
            return res.status(401).json({
              success: false,
              message: 'Google authentication credential is invalid or has expired.'
            });
          }
        } catch (fetchErr) {
          console.error('[Google Auth] Verification error:', idErr.message);
          return res.status(401).json({
            success: false,
            message: 'Unable to verify Google credentials. Please try again.'
          });
        }
      }
    }
    // 2. Verify Google OAuth Access Token
    else if (accessToken) {
      try {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!userinfoRes.ok) {
          return res.status(401).json({
            success: false,
            message: 'Invalid Google access token.'
          });
        }
        verifiedPayload = await userinfoRes.json();
      } catch (tokenErr) {
        console.error('[Google Auth] Access token error:', tokenErr.message);
        return res.status(401).json({
          success: false,
          message: 'Unable to verify Google access token.'
        });
      }
    }
    // 3. Verify Google Authorization Code
    else if (code) {
      try {
        const { tokens } = await googleOAuthClient.getToken(code);
        if (tokens.id_token) {
          const ticket = await googleOAuthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID || undefined
          });
          verifiedPayload = ticket.getPayload();
        } else if (tokens.access_token) {
          const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
          });
          if (userinfoRes.ok) {
            verifiedPayload = await userinfoRes.json();
          }
        }
      } catch (codeErr) {
        console.error('[Google Auth] Authorization code exchange error:', codeErr.message);
        return res.status(401).json({
          success: false,
          message: 'Failed to exchange authorization code with Google.'
        });
      }
    }

    if (!verifiedPayload || !verifiedPayload.email) {
      return res.status(401).json({
        success: false,
        message: 'Could not obtain a verified email from Google.'
      });
    }

    // Ensure email is verified by Google
    const isEmailVerified = verifiedPayload.email_verified === true || verifiedPayload.email_verified === 'true';
    if (!isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your Google email address has not been verified by Google.'
      });
    }

    const verifiedGoogleId = verifiedPayload.sub;
    const verifiedEmail = verifiedPayload.email;
    const verifiedName = verifiedPayload.name || verifiedPayload.given_name || 'Google User';
    const verifiedPicture = verifiedPayload.picture || null;

    // Lookup or create user in database
    const safeUser = await userModel.findOrCreateGoogleUser({
      googleId: verifiedGoogleId,
      email: verifiedEmail,
      name: verifiedName,
      avatar: verifiedPicture
    });

    // Obtain the user's authentic database role (strictly server-side, never self-assigned)
    const userInDb = userModel.findById(safeUser.id);
    const trustedRole = userInDb ? userInDb.role : safeUser.role || 'donor';

    // Generate Impact Bridge JWT
    const payload = {
      id: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
      role: trustedRole
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      message: `Welcome to Impact Bridge, ${safeUser.name}!`,
      token,
      user: {
        ...safeUser,
        role: trustedRole
      }
    });
  } catch (err) {
    console.error('[authController.googleLogin] Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server encountered an error while authenticating with Google.'
    });
  }
};

module.exports = {
  login,
  register,
  getMe,
  verifyAdmin,
  googleLogin,
  JWT_SECRET
};
