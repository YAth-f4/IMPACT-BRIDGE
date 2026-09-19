const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FUND_RAISE_FILE = path.join(DATA_DIR, 'fundRaiseRequests.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];

const INITIAL_FUNDRAISERS = [
  {
    id: 'REQ-FR-2026-001',
    userId: 'USR-DON-01',
    organizerName: 'Aditya Singhania',
    email: 'aditya.singhania@corp.in',
    phone: '+91 98200 12345',
    title: 'Solar Powered STEM Digital Lab for Sundarbans',
    category: 'Education & Tech',
    targetAmount: 350000,
    raisedAmount: 120000,
    description: 'Setting up off-grid solar panels, battery banks, and 15 rugged learning tablets for children living in tidal delta islands.',
    beneficiaryStory: 'Children currently travel 2 hours by rowboat to access electricity. This lab powers offline Wikipedia and math tutorials.',
    location: 'Sundarbans, West Bengal',
    status: 'APPROVED',
    adminNotes: 'Campaign verified and partner hub confirmed by Dr. Ananya Iyer.',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Aditya Singhania',
        timestamp: '2026-08-20T10:00:00.000Z',
        note: 'Fundraiser proposal submitted'
      },
      {
        action: 'STATUS_CHANGED_PENDING_TO_APPROVED',
        performedBy: 'Executive Administrator (admin@impactbridge.org)',
        timestamp: '2026-08-22T14:00:00.000Z',
        note: 'Approved for public listing'
      }
    ],
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-22T14:00:00.000Z'
  },
  {
    id: 'REQ-FR-2026-002',
    userId: 'USR-VOL-01',
    organizerName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98111 22334',
    title: 'Warm Winter Clothes & Blanket Drive for Delhi Slums',
    category: 'Emergency Shelter',
    targetAmount: 150000,
    raisedAmount: 0,
    description: 'Procuring 800 thermal blankets, woollen sweaters, and socks for pavement dwellers and migrant families before peak north Indian winter.',
    beneficiaryStory: 'Winter nighttime temperatures dip to 3°C on Yamuna banks; thermal kits prevent cold shock in newborns and seniors.',
    location: 'Yamuna Floodplains & Okhla, New Delhi',
    status: 'PENDING',
    adminNotes: '',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Aarav Sharma',
        timestamp: '2026-09-12T15:30:00.000Z',
        note: 'Submitted for upcoming winter cycle'
      }
    ],
    createdAt: '2026-09-12T15:30:00.000Z',
    updatedAt: '2026-09-12T15:30:00.000Z'
  }
];

class FundRaiseRequestModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(FUND_RAISE_FILE)) {
        fs.writeFileSync(FUND_RAISE_FILE, JSON.stringify(INITIAL_FUNDRAISERS, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[FundRaiseRequestModel] Error initializing file:', err.message);
    }
  }

  loadRequests() {
    try {
      if (!fs.existsSync(FUND_RAISE_FILE)) {
        this.initDatabase();
      }
      const data = fs.readFileSync(FUND_RAISE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[FundRaiseRequestModel] Error reading file:', err.message);
      return INITIAL_FUNDRAISERS;
    }
  }

  saveRequests(requests) {
    try {
      const tempFile = `${FUND_RAISE_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(requests, null, 2), 'utf-8');
      fs.renameSync(tempFile, FUND_RAISE_FILE);
      return true;
    } catch (err) {
      console.error('[FundRaiseRequestModel] Error saving file:', err.message);
      return false;
    }
  }

  create({ userId, organizerName, email, phone, title, category, targetAmount, description, beneficiaryStory, location }) {
    if (!organizerName || !email || !title || !targetAmount || !description) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    const requests = this.loadRequests();
    const id = `REQ-FR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newRequest = {
      id,
      userId: userId ? String(userId) : null,
      organizerName: String(organizerName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      title: String(title).trim(),
      category: category || 'Community Support',
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      description: String(description).trim(),
      beneficiaryStory: String(beneficiaryStory || '').trim(),
      location: String(location || 'Pan-India').trim(),
      status: 'PENDING', // Security: campaigns MUST NOT be public until admin approves
      adminNotes: '',
      auditLog: [
        {
          action: 'SUBMITTED',
          performedBy: organizerName.trim(),
          timestamp: now,
          note: 'Fundraising proposal submitted and awaiting admin approval'
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

  findApproved() {
    const requests = this.loadRequests();
    return requests.filter((r) => r.status === 'APPROVED');
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
          r.title.toLowerCase().includes(q) ||
          r.organizerName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

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

    req.auditLog.push({
      action: `STATUS_CHANGED_${oldStatus}_TO_${upperStatus}`,
      performedBy: adminUser?.name ? `${adminUser.name} (${adminUser.email})` : 'System Administrator',
      timestamp: now,
      note: note ? note.trim() : `Status updated to ${upperStatus}`
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

module.exports = new FundRaiseRequestModel();
