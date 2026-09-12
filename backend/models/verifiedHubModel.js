/**
 * Verified Hub Data Model for Impact Bridge
 * Represents administrative and program hubs verified inside our application database.
 */

const VERIFIED_HUBS_DATABASE = [
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

/**
 * Retrieves verified hubs with optional filtering
 *
 * @param {Object} filters
 * @param {string} [filters.city]
 * @param {string} [filters.status]
 * @param {string} [filters.category]
 * @param {string} [filters.search]
 * @returns {Array} Filtered list of verified hubs
 */
function getVerifiedHubs(filters = {}) {
  const { city, status, category, search } = filters;

  return VERIFIED_HUBS_DATABASE.filter((hub) => {
    // Strictly require verification status
    if (hub.verificationStatus !== 'Verified' || !hub.isVerified) {
      return false;
    }

    // City Filter
    if (city && city !== 'All' && hub.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    // Status Filter (handles 'Active Hub', 'Completed Site', etc.)
    if (status && status !== 'All') {
      if (status === 'Active' && !hub.status.includes('Active')) return false;
      if (status === 'Completed' && !hub.status.includes('Completed')) return false;
      if (status !== 'Active' && status !== 'Completed' && hub.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }
    }

    // Category Filter
    if (category && category !== 'All' && hub.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // Search Query (name, city, state, programName, address, category)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const matches =
        hub.name.toLowerCase().includes(q) ||
        hub.city.toLowerCase().includes(q) ||
        hub.state.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q) ||
        hub.programName.toLowerCase().includes(q) ||
        hub.category.toLowerCase().includes(q);

      if (!matches) return false;
    }

    return true;
  });
}

/**
 * Returns available filter options derived from verified data
 */
function getFilterOptions() {
  const verified = VERIFIED_HUBS_DATABASE.filter(h => h.verificationStatus === 'Verified');
  const cities = ['All', ...Array.from(new Set(verified.map(h => h.city)))];
  const categories = ['All', ...Array.from(new Set(verified.map(h => h.category)))];
  const statuses = ['All', ...Array.from(new Set(verified.map(h => h.status)))];

  return { cities, categories, statuses };
}

/**
 * Returns total count of all verified hubs in the database
 */
function getTotalVerifiedCount() {
  return VERIFIED_HUBS_DATABASE.filter(h => h.verificationStatus === 'Verified' && h.isVerified).length;
}

module.exports = {
  VERIFIED_HUBS_DATABASE,
  getVerifiedHubs,
  getFilterOptions,
  getTotalVerifiedCount
};
