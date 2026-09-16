const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ABOUT_FILE = path.join(DATA_DIR, 'about.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const generateSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Verified Real Social-Impact Figures for "Inspiring Changemakers"
 * IMPORTANT: These individuals are NOT employees, founders, directors, or staff of Impact Bridge.
 * They are curated notable changemakers whose pioneering social-impact work inspires grassroots action.
 */
const DEFAULT_INSPIRING_CHANGEMAKERS = [
  {
    name: 'Kailash Satyarthi',
    slug: 'kailash-satyarthi',
    designation: 'Child Rights Activist & Nobel Peace Prize Laureate',
    organization: 'Bachpan Bachao Andolan (Save the Childhood Movement)',
    shortBio: 'Nobel Peace Prize laureate who spearheaded global movements against child labor and has liberated over 100,000 children from exploitation and trafficking.',
    fullBio: 'Kailash Satyarthi is an internationally acclaimed Indian child rights advocate who was awarded the 2014 Nobel Peace Prize alongside Malala Yousafzai. In 1980, he founded Bachpan Bachao Andolan (Save the Childhood Movement), pioneering grassroots rescue missions for children trapped in bonded labor across carpet, brick kiln, and garment industries. He organized the Global March Against Child Labour across 103 countries, which catalyzed the unanimous international adoption of ILO Convention 182 on the Worst Forms of Child Labour. Through the Kailash Satyarthi Children’s Foundation, he champions child-friendly villages (Bal Mitra Gram) and child protection policies worldwide.',
    achievements: [
      'Conferred the Nobel Peace Prize in 2014 for dedicated struggles against child suppression and universal education rights',
      'Rescued and rehabilitated more than 100,000 children from forced labor, slavery, and human trafficking',
      'Catalyzed the international adoption of ILO Convention 182 on the Worst Forms of Child Labour',
      'Pioneered Rugmark (now GoodWeave) to certify child-labor-free supply chains in the global carpet industry'
    ],
    impactArea: 'Child Rights & Anti-Trafficking',
    imageUrl: '/images/changemakers/kailash-satyarthi.jpg',
    sourceUrl: 'https://www.nobelprize.org/prizes/peace/2014/satyarthi/facts/',
    order: 1
  },
  {
    name: 'Anshu Gupta',
    slug: 'anshu-gupta',
    designation: 'Founder & Social Reformer (Ramon Magsaysay Awardee)',
    organization: 'Goonj',
    shortBio: 'Ramon Magsaysay awardee who transformed discarded urban clothing and surplus into a potent currency for community-led rural infrastructure and disaster relief.',
    fullBio: 'Anshu Gupta, known affectionately as the "Clothing Man of India", founded Goonj in 1999 to reposition clothing as a basic, overlooked human need in disaster response and poverty alleviation. Through Goonj’s innovative "Dignity For Work" initiative, rural communities across India identify vital local infrastructure challenges—building bamboo bridges, desilting canals, paving roads—and execute them autonomously using family resource and clothing kits as dignified community currency rather than charity. Goonj also broke cultural taboos surrounding menstrual hygiene in rural areas through its "Not Just a Piece of Cloth" initiative, converting clean cotton surplus into sanitized reusable cloth pads.',
    achievements: [
      'Conferred the Ramon Magsaysay Award in 2015 for transforming discarded clothing into a development resource',
      'Mobilizes over 6,000 tons of urban surplus materials annually across 27+ Indian states',
      'Pioneered "Dignity For Work", enabling thousands of village-led infrastructure projects without cash donations',
      'Founded "Not Just a Piece of Cloth", providing eco-friendly menstrual care kits to millions of rural women'
    ],
    impactArea: 'Rural Development & Circular Economy',
    imageUrl: '/images/changemakers/anshu-gupta.jpg',
    sourceUrl: 'https://www.rmaward.asia/awardee/gupta-anshu',
    order: 2
  },
  {
    name: 'Dr. Harish Hande',
    slug: 'harish-hande',
    designation: 'Social Entrepreneur & Renewable Energy Pioneer',
    organization: 'SELCO India',
    shortBio: 'Ramon Magsaysay awardee and renewable energy innovator who proved decentralized solar power and tailored microfinance can eradicate energy poverty for rural families.',
    fullBio: 'Dr. Harish Hande is an energy engineer who graduated from IIT Kharagpur and earned his doctorate from the University of Massachusetts Lowell. In 1995, he co-founded SELCO India on the breakthrough premise that impoverished families could afford and sustainably maintain clean renewable energy if technology, financing, and after-sales service were tailored to their actual cash flows. SELCO partnered with regional rural banks and microfinance institutions to provide decentralized solar lighting and thermal systems for street vendors, midwives, farmers, and students. Through the SELCO Foundation, he actively incubates solar-powered healthcare clinics, agricultural cold storage, and decentralized livelihood equipment.',
    achievements: [
      'Awarded the Ramon Magsaysay Award in 2011 for bringing solar power technology to impoverished rural households',
      'Electrified more than 1,000,000 underserved homes, rural health clinics, and micro-enterprises',
      'Pioneered tailored micro-lending models connecting regional rural banks to unbanked clean-energy customers',
      'Established the SELCO Foundation deploying solar solutions across thousands of rural primary healthcare centers'
    ],
    impactArea: 'Decentralized Clean Energy & Rural Livelihoods',
    imageUrl: '/images/changemakers/harish-hande.jpg',
    sourceUrl: 'https://www.rmaward.asia/awardee/hande-harish',
    order: 3
  },
  {
    name: 'Bezwada Wilson',
    slug: 'bezwada-wilson',
    designation: 'Human Rights Defender & National Convener',
    organization: 'Safai Karmachari Andolan (SKA)',
    shortBio: 'Ramon Magsaysay awardee who has led a historic 30-year nationwide movement to eradicate manual scavenging and restore constitutional dignity to sanitation workers.',
    fullBio: 'Bezwada Wilson was born into a Dalit family in the Kolar Gold Fields of Karnataka, where generations of his family were relegated to manual scavenging. Confronted by the systemic caste humiliation and grave occupational hazards forced upon his community, he resolved to abolish manual scavenging completely. In 1994, he co-founded the Safai Karmachari Andolan (SKA), mobilizing a nationwide grassroots movement that actively identifies and demolishes dry latrines while fighting precedent-setting legal battles in the Supreme Court of India. SKA has liberated and rehabilitated hundreds of thousands of workers, fighting tirelessly for mechanized sanitation, statutory compensation, and children’s educational emancipation.',
    achievements: [
      'Awarded the Ramon Magsaysay Award in 2016 for leading a grassroots movement to eradicate manual scavenging and restore human dignity',
      'Helped liberate and rehabilitate over 300,000 manual scavengers across 500+ districts in India',
      'Successfully litigated before the Supreme Court of India to mandate enforcement of anti-scavenging legislation and sewage worker compensation',
      'Organized the historic nationwide 30,000-kilometer Bhim Yatra demanding an end to caste-based sanitation labor'
    ],
    impactArea: 'Human Rights & Social Dignity',
    imageUrl: '/images/changemakers/bezwada-wilson.jpg',
    sourceUrl: 'https://www.rmaward.asia/awardee/wilson-bezwada',
    order: 4
  }
];

/**
 * Default Seed Content for IMPACT BRIDGE About Page
 * 5 Standard Sections: Mission, Vision, Strategic Goals, Approach Steps, Inspiring Changemakers.
 * No timeline/journey or leadership team fields.
 */
const DEFAULT_ABOUT_CONTENT = {
  id: 'ABOUT-SINGLETON-01',
  mission: {
    title: 'Our Mission',
    description: 'To deploy technology-driven, transparent, and scalable grassroots interventions that uplift marginalized families out of poverty and equip the next generation with digital skills.'
  },
  vision: {
    title: 'Our Vision',
    description: 'An equitable India where every child has a digital classroom, every patient receives primary care, and every community owns drought and flood resilience infrastructure.'
  },
  strategicGoals: [
    {
      title: '100,000 Beneficiaries by 2027',
      description: 'Expanding grassroots reach across rural and urban settlements.',
      order: 1
    },
    {
      title: '50 Solar-Powered Slum Labs',
      description: 'Equipping community learning centers with off-grid digital infrastructure.',
      order: 2
    },
    {
      title: '100% Clean Water Access in 25 Desert Villages',
      description: 'Building permanent rainwater taankas and community wells.',
      order: 3
    }
  ],
  approachSteps: [
    {
      stepNumber: 1,
      title: 'Grassroots Data Audit',
      description: 'We conduct baseline socio-economic and demographic field surveys to pinpoint exact community bottlenecks before committing funds.',
      order: 1
    },
    {
      stepNumber: 2,
      title: 'Co-Design with Locals',
      description: 'Programs are co-developed with village panchayats and slum youth committees to guarantee 100% local ownership and cultural resonance.',
      order: 2
    },
    {
      stepNumber: 3,
      title: 'Digital Field Telemetry',
      description: 'Every ration kit, tablet, and medical checkup is logged in real-time via geotagged mobile audits on our central NGO ledger.',
      order: 3
    },
    {
      stepNumber: 4,
      title: 'Self-Sustaining Exit',
      description: 'We build local leadership capacity to transition projects into independent community cooperatives within 18–24 months.',
      order: 4
    }
  ],
  inspiringChangemakers: DEFAULT_INSPIRING_CHANGEMAKERS,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

class AboutModel {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      if (!fs.existsSync(ABOUT_FILE)) {
        fs.writeFileSync(ABOUT_FILE, JSON.stringify(DEFAULT_ABOUT_CONTENT, null, 2), 'utf-8');
      } else {
        // If file exists, check if it needs migration from legacy timeline/leadership or missing slugs/images
        const raw = fs.readFileSync(ABOUT_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        let needsMigration = false;

        if (parsed.timeline || parsed.journey || parsed.leadership || !parsed.inspiringChangemakers) {
          needsMigration = true;
        }

        let changemakers = parsed.inspiringChangemakers || DEFAULT_INSPIRING_CHANGEMAKERS;
        if (Array.isArray(changemakers)) {
          // Check if any changemakers need slug backfilled or broken wikimedia URLs replaced with local assets
          changemakers = changemakers.map((c, idx) => {
            const defaultMatch = DEFAULT_INSPIRING_CHANGEMAKERS.find(
              (def) => def.name.toLowerCase() === (c.name || '').toLowerCase()
            );
            const slug = c.slug || defaultMatch?.slug || generateSlug(c.name);
            let imageUrl = c.imageUrl;
            if (!imageUrl || imageUrl.includes('upload.wikimedia.org')) {
              imageUrl = defaultMatch?.imageUrl || `/images/changemakers/${slug}.jpg`;
            }
            if (c.slug !== slug || c.imageUrl !== imageUrl) {
              needsMigration = true;
            }
            return {
              ...c,
              slug,
              imageUrl,
              order: typeof c.order === 'number' ? c.order : idx + 1
            };
          });
        }

        if (needsMigration) {
          const migrated = {
            id: parsed.id || 'ABOUT-SINGLETON-01',
            mission: parsed.mission || DEFAULT_ABOUT_CONTENT.mission,
            vision: parsed.vision || DEFAULT_ABOUT_CONTENT.vision,
            strategicGoals: parsed.strategicGoals || DEFAULT_ABOUT_CONTENT.strategicGoals,
            approachSteps: parsed.approachSteps || DEFAULT_ABOUT_CONTENT.approachSteps,
            inspiringChangemakers: changemakers,
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          fs.writeFileSync(ABOUT_FILE, JSON.stringify(migrated, null, 2), 'utf-8');
        }
      }
    } catch (err) {
      console.error('[AboutModel] Error initializing about.json:', err.message);
    }
  }

  /**
   * Retrieves the current singleton About content document.
   * Returns fallback structure if file cannot be read.
   */
  getContent() {
    try {
      if (!fs.existsSync(ABOUT_FILE)) {
        this.initDatabase();
      }
      const raw = fs.readFileSync(ABOUT_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed || DEFAULT_ABOUT_CONTENT;
    } catch (err) {
      console.error('[AboutModel] Error reading about file:', err.message);
      return DEFAULT_ABOUT_CONTENT;
    }
  }

  /**
   * Finds an inspiring changemaker by stable slug identifier.
   * Case-insensitive matching.
   */
  getChangemakerBySlug(slug) {
    if (!slug || typeof slug !== 'string') return null;
    const content = this.getContent();
    const changemakers = content.inspiringChangemakers || [];
    const targetSlug = slug.trim().toLowerCase();
    return changemakers.find((c) => String(c.slug || '').trim().toLowerCase() === targetSlug) || null;
  }

  /**
   * Updates the singleton About content document in place.
   * Preserves createdAt, updates updatedAt, and prevents unexpected field injection.
   */
  updateContent(updatedFields) {
    try {
      const current = this.getContent();
      const now = new Date().toISOString();

      const merged = {
        id: current.id || 'ABOUT-SINGLETON-01',
        mission: {
          title: updatedFields.mission?.title !== undefined
            ? String(updatedFields.mission.title).trim()
            : (current.mission?.title ?? ''),
          description: updatedFields.mission?.description !== undefined
            ? String(updatedFields.mission.description).trim()
            : (current.mission?.description ?? '')
        },
        vision: {
          title: updatedFields.vision?.title !== undefined
            ? String(updatedFields.vision.title).trim()
            : (current.vision?.title ?? ''),
          description: updatedFields.vision?.description !== undefined
            ? String(updatedFields.vision.description).trim()
            : (current.vision?.description ?? '')
        },
        strategicGoals: Array.isArray(updatedFields.strategicGoals)
          ? updatedFields.strategicGoals.map((g, idx) => ({
              title: String(g.title || '').trim(),
              description: String(g.description || '').trim(),
              order: typeof g.order === 'number' ? g.order : idx + 1
            }))
          : current.strategicGoals || [],
        approachSteps: Array.isArray(updatedFields.approachSteps)
          ? updatedFields.approachSteps.map((s, idx) => ({
              stepNumber: Number(s.stepNumber) || idx + 1,
              title: String(s.title || '').trim(),
              description: String(s.description || '').trim(),
              order: typeof s.order === 'number' ? s.order : idx + 1
            }))
          : current.approachSteps || [],
        inspiringChangemakers: Array.isArray(updatedFields.inspiringChangemakers)
          ? updatedFields.inspiringChangemakers.map((c, idx) => ({
              name: String(c.name || '').trim(),
              slug: String(c.slug || generateSlug(c.name) || '').trim().toLowerCase(),
              designation: String(c.designation || '').trim(),
              organization: String(c.organization || '').trim(),
              shortBio: String(c.shortBio || '').trim(),
              fullBio: String(c.fullBio || '').trim(),
              achievements: Array.isArray(c.achievements)
                ? c.achievements.map((a) => String(a || '').trim()).filter(Boolean)
                : [],
              impactArea: String(c.impactArea || '').trim(),
              imageUrl: c.imageUrl ? String(c.imageUrl).trim() : '',
              sourceUrl: c.sourceUrl ? String(c.sourceUrl).trim() : '',
              order: typeof c.order === 'number' ? c.order : idx + 1
            }))
          : current.inspiringChangemakers || DEFAULT_INSPIRING_CHANGEMAKERS,
        createdAt: current.createdAt || now,
        updatedAt: now
      };

      fs.writeFileSync(ABOUT_FILE, JSON.stringify(merged, null, 2), 'utf-8');
      return merged;
    } catch (err) {
      console.error('[AboutModel] Error writing about.json:', err.message);
      throw new Error('FAILED_TO_SAVE_ABOUT_CONTENT');
    }
  }

  /**
   * Reset content back to the default seed dataset.
   */
  resetToDefault() {
    try {
      const resetData = {
        ...DEFAULT_ABOUT_CONTENT,
        inspiringChangemakers: DEFAULT_INSPIRING_CHANGEMAKERS,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(ABOUT_FILE, JSON.stringify(resetData, null, 2), 'utf-8');
      return resetData;
    } catch (err) {
      console.error('[AboutModel] Error resetting about.json:', err.message);
      throw err;
    }
  }
}

// Singleton export
module.exports = new AboutModel();
