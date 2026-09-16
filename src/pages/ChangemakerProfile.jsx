import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import usePageMeta from '../utils/usePageMeta';
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Award,
  Globe2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Info
} from 'lucide-react';

// Verified fallback baseline in case offline/initial render
const BASELINE_CHANGEMAKERS = {
  'kailash-satyarthi': {
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
  'anshu-gupta': {
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
  'harish-hande': {
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
  'bezwada-wilson': {
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
};

export default function ChangemakerProfile() {
  const { slug } = useParams();
  const normalizedSlug = slug ? slug.trim().toLowerCase() : '';

  const [profile, setProfile] = useState(() => BASELINE_CHANGEMAKERS[normalizedSlug] || null);
  const [isLoading, setIsLoading] = useState(!BASELINE_CHANGEMAKERS[normalizedSlug]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [imgError, setImgError] = useState(false);

  usePageMeta(
    profile ? `${profile.name} — Inspiring Changemaker | Impact Bridge` : 'Changemaker Profile — Impact Bridge',
    profile
      ? `${profile.name}, ${profile.designation} at ${profile.organization}. ${profile.shortBio}`
      : 'Explore verified biographical and social-impact profiles of India’s most inspiring humanitarian leaders.'
  );

  const fetchProfile = React.useCallback(() => {
    setIsLoading(true);
    setFetchError(null);
    setIsNotFound(false);

    fetch(`/api/about/changemakers/${normalizedSlug}`)
      .then(async (res) => {
        if (res.status === 404) {
          setIsNotFound(true);
          setProfile(null);
          return null;
        }
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to fetch changemaker profile`);
        }
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        if (json.success && json.data) {
          setProfile(json.data);
          setIsNotFound(false);
        } else {
          throw new Error(json.message || 'Invalid profile data structure');
        }
      })
      .catch((err) => {
        console.warn('[ChangemakerProfile] Fetch warning:', err.message);
        // If baseline has this slug, keep it as fallback
        if (BASELINE_CHANGEMAKERS[normalizedSlug]) {
          setProfile(BASELINE_CHANGEMAKERS[normalizedSlug]);
        } else {
          setFetchError('Unable to load this profile right now.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [normalizedSlug]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Ensure native browser Back button and trackpad two-finger swipe back gesture
  // return to /about even when the profile is opened in a newly spawned tab.
  useEffect(() => {
    if (window.history.length <= 1 && !window.history.state?.isPrimed) {
      try {
        const currentPath = window.location.pathname;
        window.history.replaceState({ isPrimed: true, path: '/about' }, '', '/about');
        window.history.pushState({ isPrimed: true, path: currentPath }, '', currentPath);
      } catch (err) {
        console.warn('[Navigation] History stack init notice:', err);
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'IB';
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('');
  };

  // 1. LOADING STATE
  if (isLoading && !profile) {
    return (
      <div className="nb-container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '3rem 2.5rem',
            backgroundColor: '#FFFFFF',
            border: '3px solid #000',
            borderRadius: '8px',
            boxShadow: '6px 6px 0 #000'
          }}
        >
          <Loader2 size={40} className="animate-spin" color="var(--brand-dark-green)" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem' }}>
            Loading Changemaker Profile...
          </h2>
          <p style={{ color: '#5A6F64', fontSize: '0.9rem', maxWidth: '360px' }}>
            Retrieving verified biographical information from Impact Bridge knowledge repository.
          </p>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (fetchError && !profile) {
    return (
      <div className="nb-container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <Card
          variant="white"
          style={{
            padding: '3rem 2rem',
            maxWidth: '560px',
            margin: '0 auto',
            border: '3px solid #000',
            boxShadow: '6px 6px 0 #000'
          }}
        >
          <AlertCircle size={48} color="#D97706" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '0.5rem' }}>
            Unable to load this profile right now.
          </h2>
          <p style={{ color: '#5A6F64', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '2rem' }}>
            We encountered a temporary network or server error while retrieving this changemaker’s details. Please try again or return to the About page.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="yellow" icon={RefreshCw} onClick={fetchProfile}>
              Retry
            </Button>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <Button variant="white" icon={ArrowLeft}>
                Back to About
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // 3. NOT FOUND STATE
  if (isNotFound || !profile) {
    return (
      <div className="nb-container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <Card
          variant="white"
          style={{
            padding: '3.5rem 2rem',
            maxWidth: '560px',
            margin: '0 auto',
            border: '3px solid #000',
            boxShadow: '6px 6px 0 #000'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#FFEBEA',
              border: '2px solid #000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '3px 3px 0 #000'
            }}
          >
            <AlertCircle size={32} color="#DC2626" />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '1.75rem',
              marginBottom: '0.5rem'
            }}
          >
            Changemaker Not Found
          </h2>
          <p style={{ color: '#5A6F64', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            We could not find any verified social-impact changemaker matching the identifier:
            <br />
            <code
              style={{
                backgroundColor: '#F3F4F6',
                padding: '0.2rem 0.6rem',
                border: '1.5px solid #000',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-block',
                marginTop: '0.5rem'
              }}
            >
              {slug}
            </code>
          </p>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button variant="yellow" icon={ArrowLeft}>
              ← BACK TO ABOUT
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 4. MAIN FULL PROFILE VIEW (Google Knowledge Panel Inspired Hierarchy)
  const showImage = profile.imageUrl && !imgError;

  return (
    <div
      className="changemaker-profile-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        paddingBottom: '5rem',
        minHeight: '80vh'
      }}
    >
      {/* 1. TOP BREADCRUMB & BACK ACTION */}
      <section
        style={{
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)',
          padding: '1.25rem 0'
        }}
      >
        <div className="nb-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <Link
              to="/about"
              style={{
                textDecoration: 'none',
                color: '#1A2922',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '2px solid #000',
                borderRadius: '4px',
                boxShadow: '2px 2px 0 #000',
                transition: 'transform 0.1s ease'
              }}
              id="back-to-about-btn"
            >
              <ArrowLeft size={16} strokeWidth={2.8} />
              <span>← BACK TO ABOUT</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Badge variant="yellow" size="sm">
                INSPIRING CHANGEMAKERS
              </Badge>
              {profile.impactArea && (
                <Badge variant="green" size="sm">
                  {profile.impactArea}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HERO KNOWLEDGE PANEL HEADER */}
      <section className="nb-container">
        <div
          className="nb-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #000',
            borderRadius: '10px',
            boxShadow: '6px 6px 0 #000',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 320px) 1fr',
              gap: '0'
            }}
            className="profile-hero-grid"
          >
            <style>{`
              @media (max-width: 768px) {
                .profile-hero-grid {
                  grid-template-columns: 1fr !important;
                }
                .profile-hero-photo-wrap {
                  height: 300px !important;
                  border-right: none !important;
                  border-bottom: 3px solid #000 !important;
                }
              }
              @media (max-width: 480px) {
                .profile-hero-photo-wrap {
                  height: 260px !important;
                }
              }
            `}</style>

            {/* Profile Photo */}
            <div
              className="profile-hero-photo-wrap"
              style={{
                backgroundColor: '#DFECE4',
                borderRight: '3px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '320px'
              }}
            >
              {showImage ? (
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  onError={() => setImgError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '4.5rem',
                    color: 'var(--brand-dark-green)'
                  }}
                >
                  {getInitials(profile.name)}
                </div>
              )}
            </div>

            {/* Hero Information */}
            <div
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#4B6356',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}
                >
                  <Award size={14} color="var(--brand-dark-green)" />
                  <span>Public Social Impact Tribute</span>
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.85rem, 3.5vw, 2.8rem)',
                    lineHeight: 1.15,
                    color: '#1A2922',
                    marginBottom: '0.5rem'
                  }}
                >
                  {profile.name}
                </h1>

                <div
                  style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                    fontWeight: 800,
                    color: 'var(--brand-dark-green)',
                    lineHeight: 1.4,
                    marginBottom: '0.5rem'
                  }}
                >
                  {profile.designation}
                </div>

                {profile.organization && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#4A6054'
                    }}
                  >
                    <Building2 size={16} />
                    <span>{profile.organization}</span>
                  </div>
                )}
              </div>

              {/* Short Bio Lead Banner */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: '#F7FAF8',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  boxShadow: '3px 3px 0 #000',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  fontWeight: 500,
                  color: '#26332D'
                }}
              >
                {profile.shortBio}
              </div>

              {/* Factual Independence Disclaimer Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: '#FFF9E6',
                  border: '1.5px solid #000',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#634A00',
                  width: 'fit-content'
                }}
              >
                <Info size={14} style={{ flexShrink: 0 }} />
                <span>Featured as an external public inspiration. Not an employee or staff member of Impact Bridge.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRUCTURED KNOWLEDGE SECTIONS (ABOUT, KEY WORK, IMPACT AREA, SOURCE) */}
      <section className="nb-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="profile-content-grid"
        >
          <style>{`
            @media (max-width: 900px) {
              .profile-content-grid {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
              }
            }
          `}</style>

          {/* LEFT / MAIN COLUMN: ABOUT BIOGRAPHY & KEY WORK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* ABOUT SECTION */}
            <Card
              variant="white"
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                border: '3px solid #000',
                boxShadow: '5px 5px 0 #000'
              }}
            >
              <div
                style={{
                  borderBottom: '3px solid #000',
                  paddingBottom: '0.75rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.35rem',
                    letterSpacing: '0.02em',
                    color: '#1A2922'
                  }}
                >
                  ABOUT
                </h2>
                <Badge variant="yellow" size="sm">
                  VERIFIED BIOGRAPHY
                </Badge>
              </div>

              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#26332D',
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <p>{profile.fullBio || profile.shortBio}</p>
              </div>
            </Card>

            {/* KEY WORK / CONTRIBUTIONS SECTION */}
            <Card
              variant="white"
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                border: '3px solid #000',
                boxShadow: '5px 5px 0 #000'
              }}
            >
              <div
                style={{
                  borderBottom: '3px solid #000',
                  paddingBottom: '0.75rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.35rem',
                    letterSpacing: '0.02em',
                    color: '#1A2922'
                  }}
                >
                  KEY WORK / CONTRIBUTIONS
                </h2>
                <Badge variant="green" size="sm">
                  NOTABLE ACHIEVEMENTS
                </Badge>
              </div>

              {profile.achievements && profile.achievements.length > 0 ? (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  {profile.achievements.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        backgroundColor: '#F6FAF7',
                        border: '2px solid #000',
                        borderRadius: '6px',
                        padding: '0.85rem 1rem',
                        boxShadow: '2px 2px 0 #000'
                      }}
                    >
                      <CheckCircle2
                        size={20}
                        color="var(--brand-dark-green)"
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          lineHeight: 1.5,
                          color: '#1A2922'
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#5A6F64', fontSize: '0.9rem' }}>
                  No listed contributions available for this profile.
                </p>
              )}
            </Card>
          </div>

          {/* RIGHT / SIDEBAR COLUMN: QUICK FACTS, IMPACT AREA & VERIFIED SOURCE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* IMPACT AREA & DOMAIN */}
            <Card
              variant="lightgreen"
              style={{
                padding: '1.75rem',
                border: '3px solid #000',
                boxShadow: '5px 5px 0 #000'
              }}
            >
              <div
                style={{
                  borderBottom: '2px solid #000',
                  paddingBottom: '0.65rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Globe2 size={18} color="var(--brand-dark-green)" />
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    color: '#1A2922'
                  }}
                >
                  IMPACT AREA
                </h3>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4B6356', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Primary Focus
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--brand-dark-green)' }}>
                  {profile.impactArea || 'Social Development'}
                </div>
              </div>

              {profile.organization && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4B6356', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Associated Organization
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A2922' }}>
                    {profile.organization}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4B6356', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Profile Slug
                </div>
                <code
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: '#FFFFFF',
                    padding: '0.2rem 0.5rem',
                    border: '1.5px solid #000',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                >
                  {profile.slug}
                </code>
              </div>
            </Card>

            {/* VERIFIED SOURCE & LEARN MORE */}
            <Card
              variant="yellow"
              style={{
                padding: '1.75rem',
                border: '3px solid #000',
                boxShadow: '5px 5px 0 #000',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  borderBottom: '2px solid #000',
                  paddingBottom: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    color: '#000000'
                  }}
                >
                  SOURCE
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#000', color: '#FFF', padding: '0.15rem 0.5rem', borderRadius: '3px' }}>
                  VERIFIED
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#26332D', lineHeight: 1.5 }}>
                Read official archives, foundation documentations, and verified biographical records.
              </p>

              {profile.sourceUrl ? (
                <a
                  href={profile.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nb-btn nb-btn-white"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    padding: '0.75rem 1rem',
                    border: '2px solid #000',
                    boxShadow: '3px 3px 0 #000'
                  }}
                  id="profile-learn-more-source"
                >
                  <span>LEARN MORE</span>
                  <ExternalLink size={16} strokeWidth={2.5} />
                </a>
              ) : (
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#556B60' }}>
                  Official record verified via public registry.
                </div>
              )}
            </Card>

            {/* RETURN TO ABOUT & INTERNAL SAME-TAB CHANGEMAKER NAVIGATION */}
            <Card
              variant="white"
              style={{
                padding: '1.5rem',
                border: '3px solid #000',
                boxShadow: '5px 5px 0 #000'
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Explore More Changemakers
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#5A6F64', marginBottom: '1rem' }}>
                Navigate between social impact pioneers with full browser history support:
              </p>

              {/* Internal same-tab profile navigation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {Object.values(BASELINE_CHANGEMAKERS)
                  .filter((other) => other.slug !== normalizedSlug)
                  .map((other) => (
                    <Link
                      key={other.slug}
                      to={`/about/changemakers/${other.slug}`}
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#F7FAF8',
                        border: '2px solid #000',
                        borderRadius: '6px',
                        boxShadow: '2px 2px 0 #000',
                        transition: 'transform 0.1s ease',
                        fontWeight: 700,
                        fontSize: '0.84rem'
                      }}
                    >
                      <img
                        src={other.imageUrl}
                        alt={other.name}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid #000',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ color: '#1A2922', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {other.name}
                      </span>
                    </Link>
                  ))}
              </div>

              <Link to="/about" style={{ textDecoration: 'none', display: 'block' }}>
                <Button variant="green" size="sm" style={{ width: '100%' }} icon={ArrowLeft}>
                  ← BACK TO ABOUT
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
