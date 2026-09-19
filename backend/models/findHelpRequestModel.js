const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FIND_HELP_FILE = path.join(DATA_DIR, 'findHelpRequests.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Controlled status enum
const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];

const INITIAL_REQUESTS = [
  {
    id: 'REQ-FH-2026-001',
    userId: 'USR-BEN-01',
    requesterName: 'Laxmi Devi',
    phone: '+91 98765 43210',
    email: 'laxmi.devi@example.com',
    city: 'Mumbai',
    category: 'Education Support',
    description: 'Require study kit & digital tablet device for 8th grade student daughter.',
    urgency: 'Medium',
    status: 'APPROVED',
    adminNotes: 'Verified with Mumbai Slum Innovation Lab (Dharavi). Device allocated.',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Laxmi Devi',
        timestamp: '2026-09-08T10:00:00.000Z',
        note: 'Request submitted online'
      },
      {
        action: 'STATUS_CHANGE_TO_APPROVED',
        performedBy: 'Executive Administrator (admin@impactbridge.org)',
        timestamp: '2026-09-09T14:30:00.000Z',
        note: 'Verified with Mumbai Slum Innovation Lab (Dharavi). Device allocated.'
      }
    ],
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-09T14:30:00.000Z'
  },
  {
    id: 'REQ-FH-2026-002',
    userId: null,
    requesterName: 'Ramesh Patel',
    phone: '+91 91234 56789',
    email: 'ramesh.patel.delhi@example.com',
    city: 'New Delhi',
    category: 'Food & Nutrition',
    description: 'Emergency monthly nutrition ration pack for family of 4 affected by construction stoppage.',
    urgency: 'Emergency',
    status: 'PENDING',
    adminNotes: '',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Ramesh Patel (Public User)',
        timestamp: '2026-09-15T08:20:00.000Z',
        note: 'Submitted via public Find Help portal'
      }
    ],
    createdAt: '2026-09-15T08:20:00.000Z',
    updatedAt: '2026-09-15T08:20:00.000Z'
  },
  {
    id: 'REQ-FH-2026-003',
    userId: null,
    requesterName: 'Geeta Soren',
    phone: '+91 94567 89012',
    email: '',
    city: 'Ranchi',
    category: 'Healthcare & Medicine',
    description: 'Need assistance for post-surgery medication supplies and mobility walker.',
    urgency: 'High',
    status: 'NEEDS_INFO',
    adminNotes: 'Kindly provide hospital discharge summary and prescription copy.',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Geeta Soren (Public User)',
        timestamp: '2026-09-16T11:45:00.000Z',
        note: 'Initial submission'
      },
      {
        action: 'STATUS_CHANGE_TO_NEEDS_INFO',
        performedBy: 'Executive Administrator (admin@impactbridge.org)',
        timestamp: '2026-09-17T09:15:00.000Z',
        note: 'Requested hospital discharge slip'
      }
    ],
    createdAt: '2026-09-16T11:45:00.000Z',
    updatedAt: '2026-09-17T09:15:00.000Z'
  }
];

class FindHelpRequestModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(FIND_HELP_FILE)) {
        fs.writeFileSync(FIND_HELP_FILE, JSON.stringify(INITIAL_REQUESTS, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[FindHelpRequestModel] Error initializing findHelpRequests.json:', err.message);
    }
  }

  loadRequests() {
    try {
      if (!fs.existsSync(FIND_HELP_FILE)) {
        this.initDatabase();
      }
      const data = fs.readFileSync(FIND_HELP_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[FindHelpRequestModel] Error reading file:', err.message);
      return INITIAL_REQUESTS;
    }
  }

  saveRequests(requests) {
    try {
      const tempFile = `${FIND_HELP_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(requests, null, 2), 'utf-8');
      fs.renameSync(tempFile, FIND_HELP_FILE);
      return true;
    } catch (err) {
      console.error('[FindHelpRequestModel] Error saving file:', err.message);
      return false;
    }
  }

  create({ userId = null, requesterName, phone, email = '', city, category, description, urgency = 'Normal' }) {
    if (!requesterName || !phone || !city || !description) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    const requests = this.loadRequests();
    const id = `REQ-FH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newRequest = {
      id,
      userId: userId ? String(userId) : null,
      requesterName: String(requesterName).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim().toLowerCase() : '',
      city: String(city).trim(),
      category: category || 'Food & Nutrition',
      description: String(description).trim(),
      urgency: urgency || 'Normal',
      status: 'PENDING', // Strict default: always requires admin review
      adminNotes: '',
      auditLog: [
        {
          action: 'SUBMITTED',
          performedBy: requesterName.trim() + (userId ? ' (Registered User)' : ' (Guest User)'),
          timestamp: now,
          note: 'Request submitted successfully and placed in Admin review queue'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    requests.unshift(newRequest);
    this.saveRequests(requests);
    return newRequest;
  }

  findById(id) {
    if (!id) return null;
    const requests = this.loadRequests();
    return requests.find((r) => r.id === id) || null;
  }

  findByUserId(userId) {
    if (!userId) return [];
    const requests = this.loadRequests();
    return requests.filter((r) => r.userId === String(userId));
  }

  findAll({ status, category, search, limit = 100, page = 1 } = {}) {
    let requests = this.loadRequests();

    if (status && status !== 'ALL') {
      requests = requests.filter((r) => r.status.toUpperCase() === status.toUpperCase());
    }

    if (category && category !== 'ALL') {
      requests = requests.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      requests = requests.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.requesterName.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    // Sort descending by date
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = requests.length;
    const startIndex = (page - 1) * limit;
    const paginated = requests.slice(startIndex, startIndex + limit);

    return {
      requests: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  updateStatus(id, newStatus, adminUser, note = '') {
    const upperStatus = String(newStatus).toUpperCase();
    if (!VALID_STATUSES.includes(upperStatus)) {
      throw new Error(`INVALID_STATUS: Allowed values are ${VALID_STATUSES.join(', ')}`);
    }

    const requests = this.loadRequests();
    const req = requests.find((r) => r.id === id);
    if (!req) {
      throw new Error('REQUEST_NOT_FOUND');
    }

    const oldStatus = req.status;
    const now = new Date().toISOString();

    req.status = upperStatus;
    if (note && note.trim()) {
      req.adminNotes = note.trim();
    }
    req.updatedAt = now;

    // Append to audit trail
    req.auditLog.push({
      action: `STATUS_CHANGED_${oldStatus}_TO_${upperStatus}`,
      performedBy: adminUser?.name ? `${adminUser.name} (${adminUser.email})` : 'System Administrator',
      timestamp: now,
      note: note ? note.trim() : `Status changed to ${upperStatus}`
    });

    this.saveRequests(requests);
    return req;
  }

  getStats() {
    const requests = this.loadRequests();
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === 'PENDING').length,
      approved: requests.filter((r) => r.status === 'APPROVED').length,
      rejected: requests.filter((r) => r.status === 'REJECTED').length,
      needsInfo: requests.filter((r) => r.status === 'NEEDS_INFO').length
    };
  }
}

module.exports = new FindHelpRequestModel();
