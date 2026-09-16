const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Reads all subscribers from storage.
 * @returns {Array<Object>}
 */
const getAllSubscribers = () => {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[NewsletterModel] Error reading subscribers file:', err);
    return [];
  }
};

/**
 * Saves subscribers array to storage atomically.
 * @param {Array<Object>} subscribers
 */
const saveSubscribers = (subscribers) => {
  try {
    const tempFile = `${SUBSCRIBERS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(subscribers, null, 2), 'utf-8');
    fs.renameSync(tempFile, SUBSCRIBERS_FILE);
  } catch (err) {
    console.error('[NewsletterModel] Error writing subscribers file:', err);
    throw err;
  }
};

/**
 * Subscribes an email to the Monthly Impact Dispatch.
 * @param {string} email
 * @returns {{ subscriber: Object, isNew: boolean }}
 */
const subscribeEmail = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const subscribers = getAllSubscribers();

  const existing = subscribers.find((s) => s.email.toLowerCase() === normalizedEmail);

  if (existing) {
    if (existing.status !== 'active') {
      existing.status = 'active';
      existing.reactivatedAt = new Date().toISOString();
      saveSubscribers(subscribers);
    }
    return { subscriber: existing, isNew: false };
  }

  const newSubscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    email: normalizedEmail,
    status: 'active',
    subscribedAt: new Date().toISOString(),
    source: 'Monthly Impact Dispatch'
  };

  subscribers.push(newSubscriber);
  saveSubscribers(subscribers);

  return { subscriber: newSubscriber, isNew: true };
};

module.exports = {
  getAllSubscribers,
  subscribeEmail
};
