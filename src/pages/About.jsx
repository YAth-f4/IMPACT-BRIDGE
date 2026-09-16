import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import usePageMeta from '../utils/usePageMeta';
import {
  Compass,
  Sparkles,
  Target,
  UserCheck,
  Building2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Search,
  X
} from 'lucide-react';

// Verified Baseline Datasets (Ensures instant, reliable rendering while API loads)
const DEFAULT_APPROACHES = [
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
];

const DEFAULT_GOALS = [
  { title: '100,000 Beneficiaries by 2027', description: 'Expanding grassroots reach across rural and urban settlements.', order: 1 },
  { title: '50 Solar-Powered Slum Labs', description: 'Equipping community learning centers with off-grid digital infrastructure.', order: 2 },
  { title: '100% Clean Water Access in 25 Desert Villages', description: 'Building permanent rainwater taankas and community wells.', order: 3 }
];

const DEFAULT_CHANGEMAKERS = [
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

export default function About() {
  const { ngoProfile } = useApp();
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  usePageMeta(
    'About — Impact Bridge',
    'Learn about Impact Bridge Foundation, our mission, vision, systematic methodology, and the inspiring changemakers powering social progress across India.'
  );

  const fetchAboutContent = () => {
    setIsLoading(true);
    setFetchError(null);

    fetch('/api/about')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to fetch About page content`);
        }
        return res.json();
      })
      .then((res) => {
        if (res.success && res.data) {
          setAboutData(res.data);
        } else {
          throw new Error(res.message || 'Malformed About response');
        }
      })
      .catch((err) => {
        console.warn('[AboutPage] API notice (using verified baseline):', err.message);
        setFetchError('Unable to sync live About data from server. Showing verified baseline content.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const handleImgError = (name) => {
    setImgErrors((prev) => ({ ...prev, [name]: true }));
  };

  const getInitials = (name) => {
    if (!name) return 'IB';
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('');
  };

  const mission = aboutData?.mission || {
    title: 'Our Mission',
    description: 'To deploy technology-driven, transparent, and scalable grassroots interventions that uplift marginalized families out of poverty and equip the next generation with digital skills.'
  };

  const vision = aboutData?.vision || {
    title: 'Our Vision',
    description: 'An equitable India where every child has a digital classroom, every patient receives primary care, and every community owns drought and flood resilience infrastructure.'
  };

  const strategicGoals = (aboutData?.strategicGoals && aboutData.strategicGoals.length > 0)
    ? aboutData.strategicGoals
    : DEFAULT_GOALS;

  const approachSteps = (aboutData?.approachSteps && aboutData.approachSteps.length > 0)
    ? aboutData.approachSteps
    : DEFAULT_APPROACHES;

  const allChangemakers = (aboutData?.inspiringChangemakers && aboutData.inspiringChangemakers.length > 0)
    ? aboutData.inspiringChangemakers
    : DEFAULT_CHANGEMAKERS;

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    allChangemakers.forEach((c) => {
      if (c.impactArea) cats.add(c.impactArea);
    });
    return Array.from(cats);
  }, [allChangemakers]);

  // Filtered Changemakers based on search query and category
  const filteredChangemakers = useMemo(() => {
    return allChangemakers.filter((c) => {
      const matchesCategory = selectedCategory === 'All' || c.impactArea === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        (c.designation && c.designation.toLowerCase().includes(q)) ||
        (c.organization && c.organization.toLowerCase().includes(q)) ||
        (c.impactArea && c.impactArea.toLowerCase().includes(q)) ||
        (c.shortBio && c.shortBio.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [allChangemakers, searchQuery, selectedCategory]);

  return (
    <div className="about-page" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: '3.5rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">ABOUT IMPACT BRIDGE FOUNDATION</Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              marginTop: '0.75rem',
              marginBottom: '1rem',
              lineHeight: 1.15
            }}
          >
            Engineering Dignity, Opportunity & Resilience Across India
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#3A4E44',
              maxWidth: '820px',
              lineHeight: 1.6
            }}
          >
            Registered in 2018 as a Public Charitable Trust (Reg: {ngoProfile.registrationNumber}), IMPACT BRIDGE is dedicated to bridging structural divides in child education, rural medicine, and community resilience.
          </p>

          {/* Sync status notice if fetch error occurs */}
          {fetchError && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#FFF4E5',
                border: '2px solid #000',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '3px 3px 0 #000',
                maxWidth: '650px'
              }}
            >
              <AlertCircle size={20} color="#D97706" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#78350F' }}>
                {fetchError}
              </span>
              <button
                onClick={fetchAboutContent}
                className="nb-btn nb-btn-yellow nb-btn-sm"
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Retry syncing with backend"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. MISSION, VISION & OBJECTIVES */}
      <section className="nb-container">
        <div className="grid-3" style={{ marginBottom: '1rem' }}>
          {/* Mission Card */}
          <Card variant="green" hover={true} style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Compass size={24} color="var(--accent-yellow)" />
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem' }}>{mission.title || 'Our Mission'}</h3>
            </div>
            <p style={{ color: '#D6E9DE', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500, flex: 1 }}>
              {mission.description}
            </p>
          </Card>

          {/* Vision Card */}
          <Card variant="yellow" hover={true} style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={24} color="#000000" />
              <h3 style={{ color: '#000000', fontSize: '1.35rem' }}>{vision.title || 'Our Vision'}</h3>
            </div>
            <p style={{ color: '#26332D', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600, flex: 1 }}>
              {vision.description}
            </p>
          </Card>

          {/* Strategic Goals Card */}
          <Card variant="lightgreen" hover={true} style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target size={24} color="var(--brand-dark-green)" />
              <h3 style={{ color: '#26332D', fontSize: '1.35rem' }}>Strategic Goals</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', fontWeight: 700, flex: 1 }}>
              {strategicGoals.map((goal, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#1A2922' }}>
                  <span style={{ color: 'var(--brand-dark-green)', fontWeight: 900 }}>✓</span>
                  <span>{goal.title}{goal.description ? ` — ${goal.description}` : ''}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* 3. OUR 4-STEP SYSTEMATIC APPROACH */}
      <section
        style={{
          backgroundColor: 'var(--white)',
          borderTop: 'var(--border-thick)',
          borderBottom: 'var(--border-thick)',
          padding: '4.5rem 0'
        }}
      >
        <div className="nb-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="yellow">METHODOLOGY</Badge>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', marginTop: '0.5rem' }}>
              Our 4-Step Systematic Approach
            </h2>
            <p style={{ color: '#5A6F64', fontWeight: 600, maxWidth: '640px', margin: '0.5rem auto 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
              How we transform philanthropic capital and volunteer energy into lasting grassroots self-reliance.
            </p>
          </div>

          <div className="grid-4">
            {approachSteps.map((app, idx) => {
              const stepDisplay = app.stepNumber != null
                ? (app.stepNumber < 10 ? `0${app.stepNumber}` : `${app.stepNumber}`)
                : (app.step || `0${idx + 1}`);
              return (
                <Card
                  key={app.stepNumber || app.step || idx}
                  variant="default"
                  hover={true}
                  style={{
                    padding: '1.75rem',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.8rem',
                      fontWeight: 900,
                      color: 'var(--brand-dark-green)',
                      opacity: 0.2,
                      position: 'absolute',
                      top: '10px',
                      right: '16px',
                      pointerEvents: 'none'
                    }}
                  >
                    {stepDisplay}
                  </div>

                  <Badge variant="green" size="sm" style={{ marginBottom: '1rem', width: 'fit-content' }}>
                    PHASE {stepDisplay}
                  </Badge>

                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                    {app.title}
                  </h4>

                  <p style={{ fontSize: '0.88rem', color: '#3A4E44', lineHeight: 1.55, fontWeight: 500, flex: 1 }}>
                    {app.description || app.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INSPIRING CHANGEMAKERS */}
      <section
        style={{
          backgroundColor: '#EBF4EF',
          borderTop: 'var(--border-thick)',
          borderBottom: 'var(--border-thick)',
          padding: '4.5rem 0'
        }}
      >
        <div className="nb-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Badge variant="yellow" size="md">SOCIAL IMPACT ICONS</Badge>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                marginTop: '0.5rem',
                color: '#1A2922'
              }}
            >
              Inspiring Changemakers
            </h2>
            <p
              style={{
                color: '#4B6356',
                fontWeight: 600,
                maxWidth: '740px',
                margin: '0.6rem auto 0',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}
            >
              A curated tribute to eminent Indian social reformers and humanitarians whose lifelong dedication to justice, dignity, and sustainable grassroots development inspires our daily mission.
            </p>

            {/* Factual Disclaimer Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.25rem',
                padding: '0.4rem 0.9rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #000',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#556B60',
                boxShadow: '2px 2px 0 #000'
              }}
            >
              <span>ℹ️</span>
              <span>Featured as public inspirations. These leaders are independent changemakers and not employees or staff of Impact Bridge.</span>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FFFFFF',
                border: '3px solid #000',
                borderRadius: '8px',
                boxShadow: '3px 3px 0 #000',
                padding: '0.5rem 1rem'
              }}
            >
              <Search size={20} color="#556B60" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search changemakers by name, cause, organization..."
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  width: '100%',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                  title="Clear search"
                >
                  <X size={18} color="#000" />
                </button>
              )}
            </div>

            {/* Category Filter Pills & Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: '2px solid #000',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                        boxShadow: isSelected ? '2px 2px 0 #000' : '1px 1px 0 #000',
                        transition: 'all 0.1s ease',
                        fontFamily: 'inherit'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#556B60' }}>
                Showing {filteredChangemakers.length} of {allChangemakers.length} Changemakers
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && !aboutData && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0', gap: '0.75rem' }}>
              <Loader2 size={32} className="animate-spin" color="var(--brand-dark-green)" />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Loading Inspiring Changemakers...</span>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredChangemakers.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                backgroundColor: '#FFFFFF',
                border: '3px solid #000',
                borderRadius: '8px',
                boxShadow: '4px 4px 0 #000',
                maxWidth: '550px',
                margin: '0 auto'
              }}
            >
              <UserCheck size={48} color="#8A9E94" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>No Matching Changemakers Found</h3>
              <p style={{ color: '#5A6F64', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                No verified changemakers match "{searchQuery}" in category "{selectedCategory}".
              </p>
              <Button
                variant="yellow"
                size="sm"
                style={{ marginTop: '1.25rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset Search Filters
              </Button>
            </div>
          )}

          {/* Changemaker Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 'clamp(1.25rem, 3vw, 2rem)'
            }}
          >
            {filteredChangemakers.map((c, idx) => {
              const hasImgError = imgErrors[c.name];
              const showImage = c.imageUrl && !hasImgError;
              const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              const profileUrl = `/about/changemakers/${slug}`;

              return (
                <div
                  key={c.name || idx}
                  className="nb-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '3px solid #000',
                    borderRadius: '8px',
                    boxShadow: '4px 4px 0 #000',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  {/* Photo Container */}
                  <div
                    style={{
                      height: '240px',
                      width: '100%',
                      borderBottom: '3px solid #000',
                      backgroundColor: '#DFECE4',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showImage ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        onError={() => handleImgError(c.name)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          fontSize: '3.5rem',
                          color: 'var(--brand-dark-green)'
                        }}
                      >
                        {getInitials(c.name)}
                      </div>
                    )}

                    {/* Floating Impact Tag */}
                    {c.impactArea && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          zIndex: 2
                        }}
                      >
                        <Badge variant="green" size="sm">
                          {c.impactArea}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        lineHeight: 1.25,
                        color: '#1A2922',
                        marginBottom: '0.35rem'
                      }}
                    >
                      {c.name}
                    </h3>

                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: 'var(--brand-dark-green)',
                        marginBottom: '0.35rem',
                        lineHeight: 1.35
                      }}
                    >
                      {c.designation}
                    </div>

                    {c.organization && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#556B60',
                          marginBottom: '0.85rem'
                        }}
                      >
                        <Building2 size={13} />
                        <span>{c.organization}</span>
                      </div>
                    )}

                    <p
                      style={{
                        fontSize: '0.86rem',
                        color: '#4B6356',
                        lineHeight: 1.5,
                        fontWeight: 500,
                        marginBottom: '1.25rem',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {c.shortBio}
                    </p>

                    {/* Action Bar with New Tab link */}
                    <div
                      style={{
                        paddingTop: '0.85rem',
                        borderTop: '2px dashed #D6E4DC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nb-btn nb-btn-yellow nb-btn-sm"
                        style={{
                          width: '100%',
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          letterSpacing: '0.04em'
                        }}
                        id={`view-profile-${slug}`}
                      >
                        VIEW FULL PROFILE
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
