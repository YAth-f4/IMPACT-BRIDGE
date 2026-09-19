const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const VOL_APPS_FILE = path.join(DATA_DIR, 'volunteerApplications.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];

const INITIAL_APPLICATIONS = [
  {
    id: 'REQ-VOL-2026-001',
    userId: 'USR-VOL-01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 01234',
    city: 'Mumbai',
    skills: ['Python Coding', 'STEM Teaching', 'Graphic Design'],
    interests: ['Education Support', 'Digital Literacy'],
    availability: 'Weekends (6 hrs/week)',
    emergencyContact: 'Sunil Sharma (+91 98765 01235)',
    status: 'APPROVED',
    hoursLogged: 142,
    assignedPrograms: ['PRG-101 (GyanSetu Digital Classrooms)', 'PRG-107 (Yuva Kaushal Coding Bootcamp)'],
    adminNotes: 'Field orientation completed. Active volunteer and mentor lead.',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Aarav Sharma',
        timestamp: '2026-02-10T11:30:00.000Z',
        note: 'Application submitted'
      },
      {
        action: 'STATUS_CHANGED_PENDING_TO_APPROVED',
        performedBy: 'Executive Administrator (admin@impactbridge.org)',
        timestamp: '2026-02-12T10:00:00.000Z',
        note: 'Approved after background verification'
      }
    ],
    createdAt: '2026-02-10T11:30:00.000Z',
    updatedAt: '2026-02-12T10:00:00.000Z'
  },
  {
    id: 'REQ-VOL-2026-002',
    userId: null,
    name: 'Megha Sundaram',
    email: 'megha.sundaram@iitb.ac.in',
    phone: '+91 98333 44556',
    city: 'Mumbai',
    skills: ['Renewable Energy', 'Solar Hardware', 'Tutoring'],
    interests: ['STEM Education', 'Clean Energy'],
    availability: 'Saturdays & Sundays (8 hrs/week)',
    emergencyContact: 'Dr. V. Sundaram (+91 98333 44557)',
    status: 'PENDING',
    hoursLogged: 0,
    assignedPrograms: [],
    adminNotes: '',
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Megha Sundaram (Public Applicant)',
        timestamp: '2026-09-14T09:15:00.000Z',
        note: 'New volunteer registration'
      }
    ],
    createdAt: '2026-09-14T09:15:00.000Z',
    updatedAt: '2026-09-14T09:15:00.000Z'
  }
];

class VolunteerApplicationModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(VOL_APPS_FILE)) {
        fs.writeFileSync(VOL_APPS_FILE, JSON.stringify(INITIAL_APPLICATIONS, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[VolunteerApplicationModel] Error initializing file:', err.message);
    }
  }

  loadApplications() {
    try {
      if (!fs.existsSync(VOL_APPS_FILE)) {
        this.initDatabase();
      }
      const data = fs.readFileSync(VOL_APPS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[VolunteerApplicationModel] Error reading file:', err.message);
      return INITIAL_APPLICATIONS;
    }
  }

  saveApplications(apps) {
    try {
      const tempFile = `${VOL_APPS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(apps, null, 2), 'utf-8');
      fs.renameSync(tempFile, VOL_APPS_FILE);
      return true;
    } catch (err) {
      console.error('[VolunteerApplicationModel] Error saving file:', err.message);
      return false;
    }
  }

  create({ userId = null, name, email, phone, city, skills = [], interests = [], availability, emergencyContact = '', programId = null }) {
    if (!name || !email || !phone || !city) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    const apps = this.loadApplications();
    const id = `REQ-VOL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newApp = {
      id,
      userId: userId ? String(userId) : null,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      city: String(city).trim(),
      skills: Array.isArray(skills) ? skills : String(skills).split(',').map((s) => s.trim()).filter(Boolean),
      interests: Array.isArray(interests) ? interests : [String(interests)],
      availability: availability || 'Flexible Weekends',
      emergencyContact: String(emergencyContact || '').trim(),
      status: 'PENDING',
      hoursLogged: 0,
      assignedPrograms: programId ? [programId] : [],
      adminNotes: '',
      auditLog: [
        {
          action: 'SUBMITTED',
          performedBy: name.trim(),
          timestamp: now,
          note: 'Volunteer application submitted'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    apps.unshift(newApp);
    this.saveApplications(apps);
    return newApp;
  }

  findById(id) {
    if (!id) return null;
    const apps = this.loadApplications();
    return apps.find((a) => a.id === id) || null;
  }

  findByUserId(userId) {
    if (!userId) return [];
    const apps = this.loadApplications();
    return apps.filter((a) => a.userId === String(userId));
  }

  findByEmail(email) {
    if (!email) return null;
    const apps = this.loadApplications();
    return apps.find((a) => a.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  findAll({ status, search, limit = 100, page = 1 } = {}) {
    let apps = this.loadApplications();

    if (status && status !== 'ALL') {
      apps = apps.filter((a) => a.status.toUpperCase() === status.toUpperCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      apps = apps.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
      );
    }

    apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = apps.length;
    const startIndex = (page - 1) * limit;
    const paginated = apps.slice(startIndex, startIndex + limit);

    return {
      applications: paginated,
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

    const apps = this.loadApplications();
    const app = apps.find((a) => a.id === id);
    if (!app) {
      throw new Error('APPLICATION_NOT_FOUND');
    }

    const oldStatus = app.status;
    const now = new Date().toISOString();

    app.status = upperStatus;
    if (note && note.trim()) {
      app.adminNotes = note.trim();
    }
    app.updatedAt = now;

    app.auditLog.push({
      action: `STATUS_CHANGED_${oldStatus}_TO_${upperStatus}`,
      performedBy: adminUser?.name ? `${adminUser.name} (${adminUser.email})` : 'System Administrator',
      timestamp: now,
      note: note ? note.trim() : `Application status set to ${upperStatus}`
    });

    this.saveApplications(apps);
    return app;
  }

  logHours(id, hours, programTitle = '') {
    const apps = this.loadApplications();
    const app = apps.find((a) => a.id === id);
    if (!app) return null;

    app.hoursLogged = (app.hoursLogged || 0) + Number(hours);
    app.updatedAt = new Date().toISOString();
    app.auditLog.push({
      action: 'HOURS_LOGGED',
      performedBy: app.name,
      timestamp: new Date().toISOString(),
      note: `Logged ${hours} hours for ${programTitle || 'Community service'}`
    });

    this.saveApplications(apps);
    return app;
  }

  getStats() {
    const apps = this.loadApplications();
    return {
      total: apps.length,
      pending: apps.filter((a) => a.status === 'PENDING').length,
      approved: apps.filter((a) => a.status === 'APPROVED').length,
      rejected: apps.filter((a) => a.status === 'REJECTED').length,
      needsInfo: apps.filter((a) => a.status === 'NEEDS_INFO').length
    };
  }
}

module.exports = new VolunteerApplicationModel();
