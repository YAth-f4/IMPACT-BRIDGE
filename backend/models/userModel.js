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

// Read configured single admin credentials from environment or fallback
const getAdminEmail = () => (process.env.ADMIN_EMAIL || 'admin@impactbridge.org').toLowerCase().trim();
const getAdminPassword = () => process.env.ADMIN_PASSWORD || 'admin123';

const buildDefaultUsers = () => {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  return [
    {
      id: 'USR-ADMIN-01',
      name: 'System Administrator',
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, SALT_ROUNDS),
      role: 'admin',
      isPrimaryAdmin: true,
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
    }
  ];
};

class UserModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(buildDefaultUsers(), null, 2), 'utf-8');
      } else {
        this.ensureSingleAdmin();
      }
    } catch (err) {
      console.error('[UserModel] Error initializing users.json:', err.message);
    }
  }

  /**
   * Ensures the single primary admin account exists and matches configured ADMIN_EMAIL/PASSWORD
   * Also prunes invalid guest users from database since Guest is strictly an unauthenticated state
   */
  ensureSingleAdmin() {
    try {
      const users = this.loadUsers();
      const adminEmail = getAdminEmail();
      const adminPassword = getAdminPassword();

      // Prune any legacy "guest" database users - guest is not an authenticated database role
      const validDbUsers = users.filter((u) => u.role !== 'guest');

      // Find all existing admins
      const adminUsers = validDbUsers.filter((u) => u.role === 'admin');

      // Keep only one primary admin
      let primaryAdmin = adminUsers.find((u) => u.email.toLowerCase() === adminEmail) || adminUsers[0];

      if (!primaryAdmin) {
        primaryAdmin = {
          id: 'USR-ADMIN-01',
          name: 'System Administrator',
          email: adminEmail,
          passwordHash: bcrypt.hashSync(adminPassword, SALT_ROUNDS),
          role: 'admin',
          isPrimaryAdmin: true,
          createdAt: new Date().toISOString()
        };
      } else {
        primaryAdmin.email = adminEmail;
        primaryAdmin.name = primaryAdmin.name || 'System Administrator';
        primaryAdmin.role = 'admin';
        primaryAdmin.isPrimaryAdmin = true;
        if (adminPassword) {
          primaryAdmin.passwordHash = bcrypt.hashSync(adminPassword, SALT_ROUNDS);
        }
      }

      // Remove any duplicate admin accounts
      const nonAdminUsers = validDbUsers.filter((u) => u.role !== 'admin');
      const updatedUsers = [primaryAdmin, ...nonAdminUsers];

      this.saveUsers(updatedUsers);
    } catch (err) {
      console.error('[UserModel] Error ensuring single admin:', err.message);
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
      return [];
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

  async findOrCreateGoogleUser({ googleId, email, name, avatar }) {
    if (!email) {
      throw new Error('MISSING_EMAIL');
    }

    const users = this.loadUsers();
    const cleanEmail = String(email).toLowerCase().trim();
    const strGoogleId = googleId ? String(googleId) : null;

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

    const existingEmailUser = users.find((u) => u.email.toLowerCase().trim() === cleanEmail);
    if (existingEmailUser) {
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

  async createUser({ name, email, password, role = 'donor' }) {
    const users = this.loadUsers();
    const cleanEmail = email.toLowerCase().trim();

    if (users.some((u) => u.email.toLowerCase().trim() === cleanEmail)) {
      throw new Error('DUPLICATE_EMAIL');
    }

    const targetRole = String(role || 'donor').toLowerCase().trim();

    // Security check: Never allow registration as admin
    if (targetRole === 'admin') {
      throw new Error('ADMIN_REGISTRATION_FORBIDDEN');
    }

    // Security check: Guest is not an authenticated database role
    if (targetRole === 'guest') {
      throw new Error('GUEST_REGISTRATION_FORBIDDEN');
    }

    const validPublicRoles = ['volunteer', 'beneficiary', 'donor'];
    if (!validPublicRoles.includes(targetRole)) {
      throw new Error('INVALID_REGISTRATION_ROLE');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: `USR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: targetRole,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return this.toSafeUser(newUser);
  }

  updateUserProfile(id, updates = {}) {
    const users = this.loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return null;

    // Strict Security Requirement: Normal users cannot update their own role
    if (updates.role !== undefined && updates.role !== user.role) {
      throw new Error('ROLE_MODIFICATION_FORBIDDEN');
    }

    if (updates.name) user.name = String(updates.name).trim();
    if (updates.phone) user.phone = String(updates.phone).trim();
    if (updates.avatar) user.avatar = String(updates.avatar).trim();

    user.updatedAt = new Date().toISOString();
    this.saveUsers(users);
    return this.toSafeUser(user);
  }

  updateUserRole(id, newRole) {
    const users = this.loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return null;

    if (user.isPrimaryAdmin && newRole !== 'admin') {
      throw new Error('PRIMARY_ADMIN_CANNOT_BE_DEMOTED');
    }

    const validRoles = ['admin', 'volunteer', 'beneficiary', 'donor'];
    if (!validRoles.includes(newRole)) {
      throw new Error('INVALID_ROLE');
    }

    user.role = newRole;
    user.updatedAt = new Date().toISOString();
    this.saveUsers(users);
    return this.toSafeUser(user);
  }

  getAllSafeUsers() {
    const users = this.loadUsers();
    return users.map((u) => this.toSafeUser(u));
  }
}

module.exports = new UserModel();
