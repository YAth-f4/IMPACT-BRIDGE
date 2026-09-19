/**
 * Verified Hub Data Model for Impact Bridge
 * Represents administrative and program hubs verified inside our application database.
 * Backed by persistent JSON file storage with atomic read/writes.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const VERIFIED_HUBS_FILE = path.join(DATA_DIR, 'verifiedHubs.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_VERIFIED_HUBS = [
  {
    id: 'LOC-01',
    name: 'Impact Bridge National HQ & Center',
    category: 'NGO Center',
    city: 'New Delhi',
    state: 'Delhi NCR',
    address: 'Plot 42, Institutional Area, Lodhi Road, New Delhi 110003',
    latitude: 28.5912,
    longitude: 77.2280,
    coordinates: [28.5912, 77.2280],
    programName: 'Central Operations, Logistics & Policy Lab',
    beneficiaries: 18500,
    volunteers: 450,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 11 4987 6500',
    lead: 'Executive Director Sunita Rao',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-02',
    name: 'Mumbai Slum Innovation Lab',
    category: 'Program',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '90 Feet Road, Dharavi, Mumbai 400017',
    latitude: 19.0434,
    longitude: 72.8562,
    coordinates: [19.0434, 72.8562],
    programName: 'GyanSetu: Digital Classrooms',
    beneficiaries: 1200,
    volunteers: 35,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 22 2407 1199',
    lead: 'Dr. Ananya Iyer',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-03',
    name: 'Okhla Mega Nutrition Kitchen',
    category: 'Beneficiary Area',
    city: 'New Delhi',
    state: 'Delhi NCR',
    address: 'Phase III Industrial Shed, Okhla, New Delhi 110020',
    latitude: 28.5355,
    longitude: 77.2690,
    coordinates: [28.5355, 77.2690],
    programName: 'Annapurna Seva: Poshan & Daily Meals',
    beneficiaries: 5000,
    volunteers: 50,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 11 2681 4433',
    lead: 'Vikramjit Singh',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-04',
    name: 'Melghat Tribal Mobile Basecamp',
    category: 'Program',
    city: 'Amravati',
    state: 'Maharashtra',
    address: 'Chikhaldara Hill Station Road, Melghat 444807',
    latitude: 21.4012,
    longitude: 77.3245,
    coordinates: [21.4012, 77.3245],
    programName: 'Arogya Vahini: Mobile Primary Healthcare',
    beneficiaries: 8500,
    volunteers: 25,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 7220 230110',
    lead: 'Dr. Rohan Deshmukh',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-05',
    name: 'Varanasi Weavers Empowerment Hub',
    category: 'Beneficiary Area',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'Bunkar Sahakari Colony, Chowkaghat, Varanasi 221002',
    latitude: 25.3340,
    longitude: 82.9975,
    coordinates: [25.3340, 82.9975],
    programName: 'Sakhi Udyam: Micro-Enterprise Collective',
    beneficiaries: 350,
    volunteers: 20,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 542 250 8821',
    lead: 'Meera Agarwal',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-06',
    name: 'Thar Desert Water Resilience Site',
    category: 'Event',
    city: 'Barmer',
    state: 'Rajasthan',
    address: 'Chohtan Block, Near Indo-Pak Border, Barmer 344702',
    latitude: 25.7532,
    longitude: 71.3967,
    coordinates: [25.7532, 71.3967],
    programName: 'Jal Chetna: Rainwater Harvesting',
    beneficiaries: 6200,
    volunteers: 30,
    status: 'Completed Site',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 2982 220450',
    lead: 'Er. Rajesh Rathore',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-07',
    name: 'Brahmaputra Flood Resilience Outpost',
    category: 'NGO Center',
    city: 'Guwahati',
    state: 'Assam',
    address: 'Brahmaputra Riverfront Staging Base, Morigaon 782105',
    latitude: 26.2500,
    longitude: 92.3400,
    coordinates: [26.2500, 92.3400],
    programName: 'Suraksha: Emergency Flood Resilience',
    beneficiaries: 12000,
    volunteers: 60,
    status: 'High Alert / Active',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 361 245 9901',
    lead: 'Pranabjyoti Barman',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-08',
    name: 'Bengaluru Youth Tech Academy',
    category: 'Program',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '100 Feet Road, 4th Block Koramangala, Bengaluru 560034',
    latitude: 12.9352,
    longitude: 77.6245,
    coordinates: [12.9352, 77.6245],
    programName: 'Yuva Kaushal: Coding & IT Skills',
    beneficiaries: 200,
    volunteers: 25,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 80 2553 7780',
    lead: 'Karthik Narayanan',
    source: 'Impact Bridge'
  },
  {
    id: 'LOC-09',
    name: 'Jaipur Mobile Cancer Outreach Depot',
    category: 'Program',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Near SMS Hospital Road, Jaipur 302004',
    latitude: 26.8920,
    longitude: 75.8150,
    coordinates: [26.8920, 75.8150],
    programName: 'Sanjeevani: Cancer Screening & Palliative',
    beneficiaries: 10000,
    volunteers: 30,
    status: 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: '+91 141 256 3390',
    lead: 'Dr. Shalini Kulkarni',
    source: 'Impact Bridge'
  }
];

function initVerifiedHubsFile() {
  try {
    if (!fs.existsSync(VERIFIED_HUBS_FILE)) {
      fs.writeFileSync(VERIFIED_HUBS_FILE, JSON.stringify(INITIAL_VERIFIED_HUBS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[VerifiedHubModel] Error initializing verifiedHubs.json:', err.message);
  }
}

initVerifiedHubsFile();

function loadHubs() {
  try {
    if (!fs.existsSync(VERIFIED_HUBS_FILE)) {
      return [...INITIAL_VERIFIED_HUBS];
    }
    const raw = fs.readFileSync(VERIFIED_HUBS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[VerifiedHubModel] Error loading verifiedHubs.json:', err.message);
    return [...INITIAL_VERIFIED_HUBS];
  }
}

function saveHubs(hubs) {
  try {
    fs.writeFileSync(VERIFIED_HUBS_FILE, JSON.stringify(hubs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[VerifiedHubModel] Error saving verifiedHubs.json:', err.message);
    return false;
  }
}

/**
 * Retrieves verified hubs with optional filtering (Used by public map)
 */
function getVerifiedHubs(filters = {}) {
  const { city, status, category, search } = filters;
  const hubs = loadHubs();

  return hubs.filter((hub) => {
    if (hub.verificationStatus !== 'Verified' || !hub.isVerified) {
      return false;
    }

    if (city && city !== 'All' && hub.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    if (status && status !== 'All') {
      if (status === 'Active' && !hub.status.includes('Active')) return false;
      if (status === 'Completed' && !hub.status.includes('Completed')) return false;
      if (status !== 'Active' && status !== 'Completed' && hub.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }
    }

    if (category && category !== 'All' && hub.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const matches =
        hub.name.toLowerCase().includes(q) ||
        hub.city.toLowerCase().includes(q) ||
        hub.state.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q) ||
        (hub.programName && hub.programName.toLowerCase().includes(q)) ||
        hub.category.toLowerCase().includes(q);

      if (!matches) return false;
    }

    return true;
  });
}

function getFilterOptions() {
  const hubs = loadHubs();
  const verified = hubs.filter((h) => h.verificationStatus === 'Verified');
  const cities = ['All', ...Array.from(new Set(verified.map((h) => h.city)))];
  const categories = ['All', ...Array.from(new Set(verified.map((h) => h.category)))];
  const statuses = ['All', ...Array.from(new Set(verified.map((h) => h.status)))];

  return { cities, categories, statuses };
}

function getTotalVerifiedCount() {
  const hubs = loadHubs();
  return hubs.filter((h) => h.verificationStatus === 'Verified' && h.isVerified).length;
}

// Admin CRUD Methods
function findById(id) {
  if (!id) return null;
  const hubs = loadHubs();
  return hubs.find((h) => h.id === id) || null;
}

function findAll(filters = {}) {
  let hubs = loadHubs();
  const { city, category, status, search, page = 1, limit = 50 } = filters;

  if (city && city !== 'All') {
    hubs = hubs.filter((h) => h.city.toLowerCase() === city.toLowerCase());
  }

  if (category && category !== 'All') {
    hubs = hubs.filter((h) => h.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'All') {
    hubs = hubs.filter((h) => h.status.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    hubs = hubs.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        (h.programName && h.programName.toLowerCase().includes(q)) ||
        h.category.toLowerCase().includes(q)
    );
  }

  const total = hubs.length;
  const startIndex = (page - 1) * limit;
  const paginated = hubs.slice(startIndex, startIndex + Number(limit));

  return {
    hubs: paginated,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit))
  };
}

function createVerifiedHub(hubData) {
  const hubs = loadHubs();
  const timestamp = Date.now();
  const newId = `LOC-${timestamp.toString().slice(-4)}`;

  const lat = Number(hubData.latitude || (hubData.coordinates && hubData.coordinates[0]) || 20.5937);
  const lng = Number(hubData.longitude || (hubData.coordinates && hubData.coordinates[1]) || 78.9629);

  const newHub = {
    id: newId,
    name: String(hubData.name).trim(),
    category: hubData.category || 'NGO Center',
    city: String(hubData.city).trim(),
    state: String(hubData.state || '').trim(),
    address: String(hubData.address || '').trim(),
    latitude: lat,
    longitude: lng,
    coordinates: [lat, lng],
    programName: String(hubData.programName || '').trim(),
    beneficiaries: Number(hubData.beneficiaries) || 0,
    volunteers: Number(hubData.volunteers) || 0,
    status: hubData.status || 'Active Hub',
    verificationStatus: 'Verified',
    isVerified: true,
    phone: String(hubData.phone || '').trim(),
    lead: String(hubData.lead || '').trim(),
    source: 'Impact Bridge',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  hubs.unshift(newHub);
  saveHubs(hubs);
  return newHub;
}

function updateVerifiedHub(id, updates = {}) {
  const hubs = loadHubs();
  const index = hubs.findIndex((h) => h.id === id);
  if (index === -1) return null;

  const current = hubs[index];
  const lat = updates.latitude !== undefined ? Number(updates.latitude) : current.latitude;
  const lng = updates.longitude !== undefined ? Number(updates.longitude) : current.longitude;

  const updatedHub = {
    ...current,
    ...updates,
    id: current.id,
    latitude: lat,
    longitude: lng,
    coordinates: [lat, lng],
    isVerified: true,
    verificationStatus: 'Verified',
    updatedAt: new Date().toISOString()
  };

  hubs[index] = updatedHub;
  saveHubs(hubs);
  return updatedHub;
}

function deleteVerifiedHub(id) {
  const hubs = loadHubs();
  const index = hubs.findIndex((h) => h.id === id);
  if (index === -1) return false;

  const removed = hubs.splice(index, 1)[0];
  saveHubs(hubs);
  return removed;
}

function getStats() {
  const hubs = loadHubs();
  return {
    total: hubs.length,
    active: hubs.filter((h) => h.status.includes('Active')).length
  };
}

module.exports = {
  get VERIFIED_HUBS_DATABASE() {
    return loadHubs();
  },
  getVerifiedHubs,
  getFilterOptions,
  getTotalVerifiedCount,
  findById,
  findAll,
  createVerifiedHub,
  updateVerifiedHub,
  deleteVerifiedHub,
  getStats
};
