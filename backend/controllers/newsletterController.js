const newsletterModel = require('../models/newsletterModel');

// RFC 5322 compliant practical email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates email format and structure.
 * @param {string} email
 * @returns {string|null} Error string if invalid, otherwise null.
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return 'Please provide a valid email address.';
  }

  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email address cannot be empty.';
  }

  if (trimmed.length > 254) {
    return 'Email address is too long (maximum 254 characters).';
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g., name@example.com).';
  }

  return null;
};

/**
 * POST /api/newsletter/subscribe
 * Subscribes a user's email to the Monthly Impact Dispatch.
 */
const subscribe = async (req, res) => {
  try {
    const { email } = req.body || {};

    const validationError = validateEmail(email);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }

    const { subscriber, isNew } = newsletterModel.subscribeEmail(email);

    if (!isNew) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the Monthly Impact Dispatch! Thank you for your continued support.',
        subscriber: {
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You will receive our next Monthly Impact Dispatch.',
      subscriber: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
  } catch (err) {
    console.error('[NewsletterController] Subscription error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your subscription. Please try again later.'
    });
  }
};

/**
 * GET /api/newsletter/subscribers (Admin view / health)
 */
const getSubscribers = async (_req, res) => {
  try {
    const subscribers = newsletterModel.getAllSubscribers();
    return res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (err) {
    console.error('[NewsletterController] Error fetching subscribers:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscriber records.'
    });
  }
};

module.exports = {
  subscribe,
  getSubscribers
};
