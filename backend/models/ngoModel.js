const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const NGOS_FILE = path.join(DATA_DIR, 'ngos.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Controlled status enum
const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];

const INITIAL_APPROVED_NGOS = [
  {
    id: 'NGO-2026-001',
    organizationName: 'Goonj Social Impact Foundation',
    description: 'A pan-India movement turning urban surplus into tools of dignity for rural community development and disaster relief across 28 states.',
    ngoType: 'Trust',
    founder: 'Anshu Gupta',
    authorizedRepresentative: 'Meenakshi Gupta',
    contactEmail: 'mail@goonj.org',
    phone: '+91 11 2697 2222',
    website: 'https://goonj.org',
    address: 'J-93, Sarita Vihar',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110076',
    registrationNumber: 'DL/2004/0014298',
    registrationCertificate: '/images/cert-sample.pdf',
    logo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'
    ],
    causes: ['Disaster Relief', 'Rural Development', 'Sanitation & Health', 'Women Empowerment'],
    areasOfWork: ['Clothing as Dignity', 'Not Just a Piece of Cloth', 'School to School', 'Dignity for Work'],
    programs: ['Flood Relief Material Mobilization', 'Winter Cloth Drive', 'Rural Infrastructure Self-Help'],
    yearsOfOperation: 22,
    ownerUserId: 'USR-ADMIN-01',
    status: 'APPROVED',
    isVerified: true,
    adminReview: {
      reviewedBy: 'Executive Administrator (admin@impactbridge.org)',
      reviewedAt: '2026-01-20T10:00:00.000Z',
      notes: 'FCRA and 80G tax exemptions verified against NITI Aayog Darpan portal. Exemplary track record.'
    },
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Meenakshi Gupta (Representative)',
        timestamp: '2026-01-19T08:30:00.000Z',
        note: 'NGO Registration submitted with statutory order copies.'
      },
      {
        action: 'STATUS_CHANGE_TO_APPROVED',
        performedBy: 'Executive Administrator',
        timestamp: '2026-01-20T10:00:00.000Z',
        note: 'Approved and awarded Verified Impact Bridge Partner status.'
      }
    ],
    createdAt: '2026-01-19T08:30:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'NGO-2026-002',
    organizationName: 'Akshaya Patra Foundation',
    description: 'Striving to eliminate classroom hunger through hot, nutritious mid-day meals in government and government-aided schools across India.',
    ngoType: 'Society',
    founder: 'Madhu Pandit Dasa',
    authorizedRepresentative: 'Shreedhar Venkat',
    contactEmail: 'infodesk@akshayapatra.org',
    phone: '+91 80 3014 3400',
    website: 'https://www.akshayapatra.org',
    address: 'Hare Krishna Hill, West of Chord Road, Rajajinagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560010',
    registrationNumber: 'KA/2001/0089123',
    registrationCertificate: '/images/cert-sample.pdf',
    logo: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80'
    ],
    causes: ['Child Nutrition', 'Classroom Education', 'Zero Hunger'],
    areasOfWork: ['PM POSHAN Mid-Day Meal', 'Breakfast Feeds', 'Disaster Food Relief'],
    programs: ['Centralized Kitchens Network', 'Direct Feeding to 2 Million Children'],
    yearsOfOperation: 24,
    ownerUserId: 'USR-ADMIN-01',
    status: 'APPROVED',
    isVerified: true,
    adminReview: {
      reviewedBy: 'Executive Administrator (admin@impactbridge.org)',
      reviewedAt: '2026-02-01T12:00:00.000Z',
      notes: 'State food safety certifications verified. Mega kitchen audits passed.'
    },
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Shreedhar Venkat (Authorized Officer)',
        timestamp: '2026-02-01T09:00:00.000Z',
        note: 'Submitted application for national food radar listing.'
      },
      {
        action: 'STATUS_CHANGE_TO_APPROVED',
        performedBy: 'Executive Administrator',
        timestamp: '2026-02-01T12:00:00.000Z',
        note: 'Approved as accredited partner.'
      }
    ],
    createdAt: '2026-02-01T09:00:00.000Z',
    updatedAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'NGO-2026-003',
    organizationName: 'Smile Foundation India',
    description: 'Empowering underprivileged children, youth, and women through relevant education, healthcare, and livelihood programs.',
    ngoType: 'Section 8 Non-Profit',
    founder: 'Santanu Mishra',
    authorizedRepresentative: 'Vikram Singh Verma',
    contactEmail: 'info@smilefoundationindia.org',
    phone: '+91 11 4312 3700',
    website: 'https://www.smilefoundationindia.org',
    address: '161 B/4, 3rd Floor, Gulmohar House, Yusuf Sarai Community Centre',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110049',
    registrationNumber: 'DL/2002/0045612',
    registrationCertificate: '/images/cert-sample.pdf',
    logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    causes: ['Education for All', 'Mobile Healthcare', 'Livelihood Training', 'Women Empowerment'],
    areasOfWork: ['Mission Education', 'Smile on Wheels', 'STeP (Twin e-Learning)', 'Swabhiman'],
    programs: ['Mobile Medical Units', 'Remedial Learning Centres'],
    yearsOfOperation: 21,
    ownerUserId: 'USR-ADMIN-01',
    status: 'APPROVED',
    isVerified: true,
    adminReview: {
      reviewedBy: 'Executive Administrator (admin@impactbridge.org)',
      reviewedAt: '2026-02-15T15:00:00.000Z',
      notes: 'Annual audit report and 12A/80G certificates validated.'
    },
    auditLog: [
      {
        action: 'SUBMITTED',
        performedBy: 'Santanu Mishra',
        timestamp: '2026-02-14T11:00:00.000Z',
        note: 'Submitted registration form.'
      },
      {
        action: 'STATUS_CHANGE_TO_APPROVED',
        performedBy: 'Executive Administrator',
        timestamp: '2026-02-15T15:00:00.000Z',
        note: 'Official verification granted.'
      }
    ],
    createdAt: '2026-02-14T11:00:00.000Z',
    updatedAt: '2026-02-15T15:00:00.000Z'
  }
];

class NgoModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(NGOS_FILE)) {
        fs.writeFileSync(NGOS_FILE, JSON.stringify(INITIAL_APPROVED_NGOS, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[NgoModel] Error initializing ngos.json:', err.message);
    }
  }

  loadNgos() {
    try {
      if (!fs.existsSync(NGOS_FILE)) {
        this.initDatabase();
      }
      const data = fs.readFileSync(NGOS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[NgoModel] Error reading ngos file:', err.message);
      return [];
    }
  }

  saveNgos(ngos) {
    try {
      fs.writeFileSync(NGOS_FILE, JSON.stringify(ngos, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[NgoModel] Error saving ngos file:', err.message);
      return false;
    }
  }

  create(ngoData) {
    const ngos = this.loadNgos();

    // Check duplicate registration number
    const cleanRegNo = String(ngoData.registrationNumber || '').trim().toUpperCase();
    if (cleanRegNo && ngos.some((n) => n.registrationNumber && n.registrationNumber.toUpperCase() === cleanRegNo)) {
      throw new Error('DUPLICATE_REGISTRATION_NUMBER');
    }

    const timestamp = Date.now();
    const randomHex = Math.floor(100 + Math.random() * 900);
    const newId = `NGO-${timestamp}-${randomHex}`;

    const newNgo = {
      id: newId,
      organizationName: String(ngoData.organizationName).trim(),
      description: String(ngoData.description).trim(),
      ngoType: ngoData.ngoType || 'Trust',
      founder: String(ngoData.founder || '').trim(),
      authorizedRepresentative: String(ngoData.authorizedRepresentative || '').trim(),
      contactEmail: String(ngoData.contactEmail).trim().toLowerCase(),
      phone: String(ngoData.phone).trim(),
      website: String(ngoData.website || '').trim(),
      address: String(ngoData.address).trim(),
      city: String(ngoData.city).trim(),
      state: String(ngoData.state).trim(),
      pincode: String(ngoData.pincode).trim(),
      registrationNumber: cleanRegNo,
      registrationCertificate: ngoData.registrationCertificate || '',
      logo: ngoData.logo || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
      photos: Array.isArray(ngoData.photos) ? ngoData.photos : [],
      causes: Array.isArray(ngoData.causes) ? ngoData.causes : [],
      areasOfWork: Array.isArray(ngoData.areasOfWork) ? ngoData.areasOfWork : [],
      programs: Array.isArray(ngoData.programs) ? ngoData.programs : [],
      yearsOfOperation: Number(ngoData.yearsOfOperation) || 1,
      ownerUserId: ngoData.ownerUserId,
      status: 'PENDING', // NEVER automatically published
      isVerified: false,
      adminReview: {
        reviewedBy: null,
        reviewedAt: null,
        notes: '',
        rejectionReason: ''
      },
      auditLog: [
        {
          action: 'SUBMITTED',
          performedBy: ngoData.submittedBy || 'NGO Owner',
          timestamp: new Date().toISOString(),
          note: 'New NGO registration application submitted for administrator verification.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ngos.unshift(newNgo);
    this.saveNgos(ngos);
    return newNgo;
  }

  findById(id) {
    if (!id) return null;
    const ngos = this.loadNgos();
    return ngos.find((n) => n.id === id) || null;
  }

  findByUserId(userId) {
    if (!userId) return [];
    const ngos = this.loadNgos();
    return ngos.filter((n) => n.ownerUserId === userId);
  }

  findByRegistrationNumber(regNo) {
    if (!regNo) return null;
    const ngos = this.loadNgos();
    return ngos.find((n) => n.registrationNumber && n.registrationNumber.toUpperCase() === regNo.toUpperCase()) || null;
  }

  getAllApproved(filters = {}) {
    const ngos = this.loadNgos();
    let approved = ngos.filter((n) => n.status === 'APPROVED');

    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      approved = approved.filter((n) =>
        n.organizationName.toLowerCase().includes(q) ||
        n.city.toLowerCase().includes(q) ||
        n.state.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
      );
    }

    if (filters.cause && filters.cause !== 'All') {
      approved = approved.filter((n) =>
        Array.isArray(n.causes) && n.causes.some((c) => c.toLowerCase() === filters.cause.toLowerCase())
      );
    }

    if (filters.city && filters.city !== 'All') {
      approved = approved.filter((n) => n.city.toLowerCase() === filters.city.toLowerCase());
    }

    // Exclude internal admin audit information from public listing
    return approved.map((n) => ({
      id: n.id,
      organizationName: n.organizationName,
      description: n.description,
      ngoType: n.ngoType,
      city: n.city,
      state: n.state,
      logo: n.logo,
      photos: n.photos,
      causes: n.causes,
      areasOfWork: n.areasOfWork,
      programs: n.programs,
      yearsOfOperation: n.yearsOfOperation,
      website: n.website,
      isVerified: true,
      status: 'APPROVED',
      createdAt: n.createdAt
    }));
  }

  getAllAdmin(status = 'ALL') {
    const ngos = this.loadNgos();
    if (status && status !== 'ALL') {
      return ngos.filter((n) => n.status === status.toUpperCase());
    }
    return ngos;
  }

  updateStatus(id, newStatus, adminUser, note = '') {
    const ngos = this.loadNgos();
    const ngo = ngos.find((n) => n.id === id);
    if (!ngo) return null;

    if (!VALID_STATUSES.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const previousStatus = ngo.status;
    ngo.status = newStatus;
    ngo.isVerified = newStatus === 'APPROVED';
    ngo.updatedAt = new Date().toISOString();

    ngo.adminReview = {
      reviewedBy: `${adminUser.name} (${adminUser.email})`,
      reviewedAt: new Date().toISOString(),
      notes: note || ngo.adminReview?.notes || '',
      reviewNotes: note || ngo.adminReview?.reviewNotes || ngo.adminReview?.notes || '',
      rejectionReason: newStatus === 'REJECTED' ? note : ''
    };

    if (!Array.isArray(ngo.auditLog)) ngo.auditLog = [];
    ngo.auditLog.push({
      action: `STATUS_CHANGE_TO_${newStatus}`,
      performedBy: `${adminUser.name} (Admin)`,
      timestamp: new Date().toISOString(),
      note: note || `Status transitioned from ${previousStatus} to ${newStatus}`
    });

    this.saveNgos(ngos);
    return ngo;
  }

  updateNgo(id, updates = {}, userId) {
    const ngos = this.loadNgos();
    const ngo = ngos.find((n) => n.id === id);
    if (!ngo) return null;

    // Security: Only owner or admin can edit
    if (ngo.ownerUserId !== userId) {
      throw new Error('UNAUTHORIZED_OWNER');
    }

    // Normal user must NEVER be able to mark their own NGO as APPROVED or VERIFIED
    delete updates.status;
    delete updates.isVerified;
    delete updates.adminReview;
    delete updates.auditLog;
    delete updates.ownerUserId;

    if (updates.organizationName) ngo.organizationName = String(updates.organizationName).trim();
    if (updates.description) ngo.description = String(updates.description).trim();
    if (updates.founder) ngo.founder = String(updates.founder).trim();
    if (updates.authorizedRepresentative) ngo.authorizedRepresentative = String(updates.authorizedRepresentative).trim();
    if (updates.contactEmail) ngo.contactEmail = String(updates.contactEmail).trim().toLowerCase();
    if (updates.phone) ngo.phone = String(updates.phone).trim();
    if (updates.website) ngo.website = String(updates.website).trim();
    if (updates.address) ngo.address = String(updates.address).trim();
    if (updates.city) ngo.city = String(updates.city).trim();
    if (updates.state) ngo.state = String(updates.state).trim();
    if (updates.pincode) ngo.pincode = String(updates.pincode).trim();
    if (updates.logo) ngo.logo = updates.logo;
    if (updates.registrationCertificate) ngo.registrationCertificate = updates.registrationCertificate;
    if (Array.isArray(updates.causes)) ngo.causes = updates.causes;
    if (Array.isArray(updates.areasOfWork)) ngo.areasOfWork = updates.areasOfWork;
    if (Array.isArray(updates.programs)) ngo.programs = updates.programs;
    if (Array.isArray(updates.photos)) ngo.photos = updates.photos;
    if (updates.yearsOfOperation) ngo.yearsOfOperation = Number(updates.yearsOfOperation);

    ngo.updatedAt = new Date().toISOString();
    this.saveNgos(ngos);
    return ngo;
  }

  resubmit(id, userId, note = '') {
    const ngos = this.loadNgos();
    const ngo = ngos.find((n) => n.id === id);
    if (!ngo) return null;

    if (ngo.ownerUserId !== userId) {
      throw new Error('UNAUTHORIZED_OWNER');
    }

    if (ngo.status !== 'NEEDS_INFO') {
      throw new Error('ONLY_NEEDS_INFO_CAN_RESUBMIT');
    }

    ngo.status = 'PENDING';
    ngo.updatedAt = new Date().toISOString();

    if (!Array.isArray(ngo.auditLog)) ngo.auditLog = [];
    ngo.auditLog.push({
      action: 'RESUBMITTED_BY_OWNER',
      performedBy: 'NGO Owner',
      timestamp: new Date().toISOString(),
      note: note || 'Owner addressed information requests and resubmitted application for verification.'
    });

    this.saveNgos(ngos);
    return ngo;
  }

  getStats() {
    const ngos = this.loadNgos();
    return {
      total: ngos.length,
      pending: ngos.filter((n) => n.status === 'PENDING').length,
      approved: ngos.filter((n) => n.status === 'APPROVED').length,
      rejected: ngos.filter((n) => n.status === 'REJECTED').length,
      needsInfo: ngos.filter((n) => n.status === 'NEEDS_INFO').length
    };
  }
}

module.exports = new NgoModel();
