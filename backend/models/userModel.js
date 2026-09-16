const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Default Seed Users with securely hashed passwords
 * Password for admin: admin123
 * Password for volunteer: volunteer123
 * Password for beneficiary: help123
 * Password for donor: donor123
 * Password for guest: guest123
 */
const SALT_ROUNDS = 10;

const DEFAULT_SEEDED_USERS = [
  {
    id: 'USR-ADMIN-01',
    name: 'Sunita Rao',
    email: 'sunita.rao@impactbridge.org',
    passwordHash: bcrypt.hashSync('admin123', SALT_ROUNDS),
    role: 'admin',
    createdAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'USR-ADMIN-02',
    name: 'System Administrator',
    email: 'admin@impactbridge.org',
    passwordHash: bcrypt.hashSync('admin123', SALT_ROUNDS),
    role: 'admin',
    createdAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'USR-VOL-01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    passwordHash: bcrypt.hashSync('volunteer123', SALT_ROUNDS),
    role: 'volunteer',
    createdAt: '2026-02-10T11:30:00.000Z'
  },
  {
    id: 'USR-BEN-01',
    name: 'Laxmi Devi',
    email: 'laxmi.devi@example.com',
    passwordHash: bcrypt.hashSync('help123', SALT_ROUNDS),
    role: 'beneficiary',
    createdAt: '2026-03-01T14:15:00.000Z'
  },
  {
    id: 'USR-DON-01',
    name: 'Aditya Singhania',
    email: 'aditya.singhania@corp.in',
    passwordHash: bcrypt.hashSync('donor123', SALT_ROUNDS),
    role: 'donor',
    createdAt: '2026-03-05T16:45:00.000Z'
  },
  {
    id: 'USR-GST-01',
    name: 'Public Citizen',
    email: 'visitor@example.com',
    passwordHash: bcrypt.hashSync('guest123', SALT_ROUNDS),
    role: 'guest',
    createdAt: '2026-04-01T10:00:00.000Z'
  }
];

class UserModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_SEEDED_USERS, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[UserModel] Error initializing users.json:', err.message);
    }
  }

  loadUsers() {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        this.initDatabase();
      }
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[UserModel] Error reading users file:', err.message);
      return DEFAULT_SEEDED_USERS;
    }
  }

  saveUsers(users) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[UserModel] Error saving users file:', err.message);
      return false;
    }
  }

  toSafeUser(user) {
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  findByEmail(email) {
    if (!email) return null;
    const users = this.loadUsers();
    return users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()) || null;
  }

  findById(id) {
    if (!id) return null;
    const users = this.loadUsers();
    return users.find((u) => u.id === id) || null;
  }

  findByGoogleId(googleId) {
    if (!googleId) return null;
    const users = this.loadUsers();
    return users.find((u) => u.googleId === String(googleId)) || null;
  }

  /**
   * Find or create user via verified Google credentials.
   * Preserves existing roles and ensures new users get the safe default normal-user role.
   */
  async findOrCreateGoogleUser({ googleId, email, name, avatar }) {
    if (!email) {
      throw new Error('MISSING_EMAIL');
    }

    const users = this.loadUsers();
    const cleanEmail = String(email).toLowerCase().trim();
    const strGoogleId = googleId ? String(googleId) : null;

    // 1. Check if user already exists by googleId
    if (strGoogleId) {
      const existingGoogleUser = users.find((u) => u.googleId === strGoogleId);
      if (existingGoogleUser) {
        let updated = false;
        if (avatar && !existingGoogleUser.avatar) {
          existingGoogleUser.avatar = avatar;
          updated = true;
        }
        if (name && (!existingGoogleUser.name || existingGoogleUser.name === 'Community Member')) {
          existingGoogleUser.name = name.trim();
          updated = true;
        }
        if (updated) {
          this.saveUsers(users);
        }
        return this.toSafeUser(existingGoogleUser);
      }
    }

    // 2. Check if user exists by verified email (account linking)
    const existingEmailUser = users.find((u) => u.email.toLowerCase().trim() === cleanEmail);
    if (existingEmailUser) {
      // Link Google ID to existing account while strictly preserving existing database role
      if (strGoogleId && !existingEmailUser.googleId) {
        existingEmailUser.googleId = strGoogleId;
      }
      if (!existingEmailUser.authProvider) {
        existingEmailUser.authProvider = 'local+google';
      } else if (!existingEmailUser.authProvider.includes('google')) {
        existingEmailUser.authProvider = `${existingEmailUser.authProvider}+google`;
      }
      if (avatar && !existingEmailUser.avatar) {
        existingEmailUser.avatar = avatar;
      }
      this.saveUsers(users);
      return this.toSafeUser(existingEmailUser);
    }

    // 3. Brand new Google user — apply safe default normal-user onboarding role ('donor')
    // Under no circumstances can a new Google user self-assign Admin
    const newUser = {
      id: `USR-GGL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: (name && String(name).trim()) || 'Community Member',
      email: cleanEmail,
      passwordHash: null,
      role: 'donor', // Safe community role
      googleId: strGoogleId,
      authProvider: 'google',
      avatar: avatar || null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return this.toSafeUser(newUser);
  }

  async comparePassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false;
    try {
      return await bcrypt.compare(plainPassword, passwordHash);
    } catch (err) {
      console.error('[UserModel] Password compare error:', err.message);
      return false;
    }
  }

  async createUser({ name, email, password, role = 'guest' }) {
    const users = this.loadUsers();
    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate
    if (users.some((u) => u.email.toLowerCase().trim() === cleanEmail)) {
      throw new Error('DUPLICATE_EMAIL');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const validRoles = ['admin', 'volunteer', 'beneficiary', 'donor', 'guest'];
    const assignedRole = validRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'guest';

    const newUser = {
      id: `USR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: assignedRole,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return this.toSafeUser(newUser);
  }

  getAllSafeUsers() {
    const users = this.loadUsers();
    return users.map((u) => this.toSafeUser(u));
  }
}

module.exports = new UserModel();
