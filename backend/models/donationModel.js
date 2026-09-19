const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DONATIONS_FILE = path.join(DATA_DIR, 'donations.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_DONATIONS = [
  {
    id: 'DON-8091',
    donorName: 'Aditya & Ritu Singhania',
    email: 'aditya.singhania@corp.in',
    phone: '+91 98200 12345',
    amount: 100000,
    date: '2025-02-28',
    purpose: 'Education Kit & Smart Lab',
    programId: 'PRG-101',
    paymentMethod: 'Net Banking (HDFC)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0891',
    donorType: 'Individual Philanthropist',
    panNumber: 'ABCPS1234F',
    anonymous: false,
    message: 'Delighted to support digital classrooms in Mumbai. Keep up the phenomenal work!',
    createdAt: '2025-02-28T10:00:00.000Z'
  },
  {
    id: 'DON-8090',
    donorName: 'TechVanguard India CSR Foundation',
    email: 'csr@techvanguard.com',
    phone: '+91 80 4411 9900',
    amount: 500000,
    date: '2025-02-25',
    purpose: 'Mobile Primary Healthcare Van',
    programId: 'PRG-103',
    paymentMethod: 'Corporate Wire (NEFT)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0890',
    donorType: 'CSR Corporate',
    panNumber: 'AAACT9988K',
    anonymous: false,
    message: 'Annual CSR grant for rural telemedicine and medical supply chain.',
    createdAt: '2025-02-25T11:30:00.000Z'
  },
  {
    id: 'DON-8089',
    donorName: 'Sunita Mehra',
    email: 'sunita.mehra@gmail.com',
    phone: '+91 98110 55432',
    amount: 5000,
    date: '2025-02-24',
    purpose: 'Poshan Community Meals',
    programId: 'PRG-102',
    paymentMethod: 'UPI (GPay)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0889',
    donorType: 'Individual Donor',
    panNumber: 'BPMPM4411L',
    anonymous: false,
    message: 'In loving memory of late Shri O.P. Mehra. May nobody sleep hungry.',
    createdAt: '2025-02-24T14:15:00.000Z'
  },
  {
    id: 'DON-8088',
    donorName: 'Anonymous Well-Wisher',
    email: 'donor_anon@private.org',
    phone: '+91 98765 00000',
    amount: 25000,
    date: '2025-02-20',
    purpose: 'Emergency Flood Relief Preps',
    programId: 'PRG-106',
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0888',
    donorType: 'Individual Donor',
    panNumber: 'XXXXX0000X',
    anonymous: true,
    message: 'For rapid response boats in Assam floodplains.',
    createdAt: '2025-02-20T16:00:00.000Z'
  },
  {
    id: 'DON-8087',
    donorName: 'Deepak Varma',
    email: 'deepak.v@varmaenterprises.in',
    phone: '+91 94440 98765',
    amount: 50000,
    date: '2025-02-18',
    purpose: 'Women Handloom Artisans Grant',
    programId: 'PRG-104',
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0887',
    donorType: 'Individual Philanthropist',
    panNumber: 'ABDPV7766M',
    anonymous: false,
    message: 'Empowering Varanasi weavers with modern jacquard equipment.',
    createdAt: '2025-02-18T09:45:00.000Z'
  },
  {
    id: 'DON-8086',
    donorName: 'Pooja Hegde',
    email: 'pooja.h@yahoo.com',
    phone: '+91 98221 66554',
    amount: 2500,
    date: '2025-02-15',
    purpose: 'Cancer Screening Camp',
    programId: 'PRG-108',
    paymentMethod: 'Debit Card (Mastercard)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0886',
    donorType: 'Individual Donor',
    panNumber: 'CPHPG1122N',
    anonymous: false,
    message: 'Supporting village mammography screenings.',
    createdAt: '2025-02-15T12:20:00.000Z'
  },
  {
    id: 'DON-8085',
    donorName: 'Kishore & Friends Bengaluru',
    email: 'kishore.bglr@gmail.com',
    phone: '+91 99001 22334',
    amount: 15000,
    date: '2025-02-10',
    purpose: 'Yuva Kaushal Tech Laptops',
    programId: 'PRG-107',
    paymentMethod: 'UPI (Paytm)',
    paymentStatus: 'Completed',
    taxExempt80G: 'IB-80G-2025-0885',
    donorType: 'Crowdfunding Group',
    panNumber: 'APKPK3344Q',
    anonymous: false,
    message: 'Contributed by our Sunday cycling club.',
    createdAt: '2025-02-10T17:30:00.000Z'
  }
];

class DonationModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(DONATIONS_FILE)) {
        fs.writeFileSync(DONATIONS_FILE, JSON.stringify(INITIAL_DONATIONS, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[DonationModel] Error initializing donations.json:', err.message);
    }
  }

  loadDonations() {
    try {
      if (!fs.existsSync(DONATIONS_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(DONATIONS_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[DonationModel] Error reading donations.json:', err.message);
      return [];
    }
  }

  saveDonations(donations) {
    try {
      fs.writeFileSync(DONATIONS_FILE, JSON.stringify(donations, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[DonationModel] Error saving donations.json:', err.message);
      return false;
    }
  }

  toSafeDonation(donation) {
    if (!donation) return null;
    const safe = { ...donation };

    // Mask sensitive identification
    if (safe.panNumber) {
      safe.panNumber = `XXXXX${safe.panNumber.slice(-4)}`;
    }

    if (safe.anonymous) {
      safe.donorName = 'Anonymous Contributor';
      safe.email = 'anonymized@impactbridge.org';
      safe.phone = '+91 XXXXX XXXXX';
    }

    return safe;
  }

  findAll(filters = {}) {
    let donations = this.loadDonations();
    const { status, programId, search, page = 1, limit = 50 } = filters;

    if (status && status !== 'ALL') {
      donations = donations.filter((d) => d.paymentStatus.toLowerCase() === status.toLowerCase());
    }

    if (programId && programId !== 'ALL') {
      donations = donations.filter((d) => d.programId === programId);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      donations = donations.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.donorName.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.purpose.toLowerCase().includes(q) ||
          d.taxExempt80G.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    donations.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    const total = donations.length;
    const startIndex = (page - 1) * limit;
    const paginated = donations.slice(startIndex, startIndex + Number(limit));

    return {
      donations: paginated.map((d) => this.toSafeDonation(d)),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  }

  findById(id) {
    if (!id) return null;
    const donations = this.loadDonations();
    const donation = donations.find((d) => d.id === id);
    return donation ? this.toSafeDonation(donation) : null;
  }

  create(donationData) {
    const donations = this.loadDonations();
    const timestamp = Date.now();
    const newId = `DON-${timestamp.toString().slice(-4)}`;

    const newDonation = {
      id: newId,
      donorName: donationData.anonymous ? 'Anonymous Contributor' : String(donationData.donorName || '').trim(),
      email: String(donationData.email || '').trim().toLowerCase(),
      phone: String(donationData.phone || '').trim(),
      amount: Number(donationData.amount) || 0,
      date: new Date().toISOString().split('T')[0],
      purpose: String(donationData.purpose || 'General Impact Fund').trim(),
      programId: donationData.programId || null,
      paymentMethod: donationData.paymentMethod || 'Online Gateway',
      paymentStatus: donationData.paymentStatus || 'Completed',
      taxExempt80G: `IB-80G-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      donorType: donationData.donorType || 'Individual Donor',
      panNumber: donationData.panNumber || '',
      anonymous: Boolean(donationData.anonymous),
      message: String(donationData.message || '').trim(),
      createdAt: new Date().toISOString()
    };

    donations.unshift(newDonation);
    this.saveDonations(donations);
    return this.toSafeDonation(newDonation);
  }

  getStats() {
    const donations = this.loadDonations();
    const totalCount = donations.length;
    const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    return {
      totalCount,
      totalAmount
    };
  }
}

module.exports = new DonationModel();
