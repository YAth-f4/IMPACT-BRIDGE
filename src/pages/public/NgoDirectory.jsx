import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BridgeLoader from '../../components/common/BridgeLoader';
import { SkeletonNgoCard } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Building2,
  Search,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';

const CAUSE_OPTIONS = [
  'All',
  'Education',
  'Healthcare',
  'Hunger & Nutrition',
  'Women Empowerment',
  'Child Welfare',
  'Environment & Animals',
  'Disaster Relief',
  'Livelihood & Skill Development'
];

export default function NgoDirectory() {
  const { fetchPublicNgos } = useApp();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    loadNgos();
  }, []);

  const loadNgos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPublicNgos();
      if (Array.isArray(res)) {
        setNgos(res);
      } else if (res && res.success) {
        setNgos(res.ngos || []);
      } else {
        setError(res?.message || res?.error || 'Unable to load verified NGOs. Please try again.');
      }
    } catch (err) {
      console.error('Failed to load NGOs:', err);
      setError('A connection error occurred while retrieving verified organizations.');
    } finally {
      setLoading(false);
    }
  };

  const cities = ['All', ...new Set(ngos.map((n) => n.city).filter(Boolean))];

  const filteredNgos = ngos.filter((ngo) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ngo.organizationName?.toLowerCase().includes(q) ||
      ngo.description?.toLowerCase().includes(q) ||
      ngo.city?.toLowerCase().includes(q) ||
      ngo.state?.toLowerCase().includes(q) ||
      (Array.isArray(ngo.causes) && ngo.causes.some((c) => c.toLowerCase().includes(q)));

    const matchesCause =
      selectedCause === 'All' ||
      (Array.isArray(ngo.causes) &&
        ngo.causes.some((c) => {
          const cLower = c.toLowerCase();
          const selLower = selectedCause.toLowerCase();
          return (
            cLower === selLower ||
            cLower.includes(selLower) ||
            selLower.includes(cLower) ||
            (selLower.includes('education') && cLower.includes('education')) ||
            (selLower.includes('health') && (cLower.includes('health') || cLower.includes('medical'))) ||
            (selLower.includes('hunger') && (cLower.includes('hunger') || cLower.includes('nutrition') || cLower.includes('food'))) ||
            (selLower.includes('women') && cLower.includes('women')) ||
            (selLower.includes('child') && cLower.includes('child')) ||
            (selLower.includes('environment') && (cLower.includes('environment') || cLower.includes('conservation') || cLower.includes('wash'))) ||
            (selLower.includes('disaster') && cLower.includes('disaster')) ||
            (selLower.includes('livelihood') && (cLower.includes('livelihood') || cLower.includes('skill')))
          );
        }));

    const matchesCity =
      selectedCity === 'All' || ngo.city?.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCause && matchesCity;
  });

  const isFiltered = searchQuery !== '' || selectedCause !== 'All' || selectedCity !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCause('All');
    setSelectedCity('All');
  };

  return (
    <div
      className="ngo-directory-page page-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
        backgroundColor: 'var(--bg-offwhite)',
        color: 'var(--text-dark)',
        paddingBottom: '4rem'
      }}
    >
      {/* 1. HERO BANNER */}
      <section
        style={{
          padding: 'clamp(2rem, 4vw, 3.5rem) 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'var(--white)',
                    border: 'var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '0.3rem 0.65rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  <ShieldCheck size={16} color="#059669" strokeWidth={2.5} />
                  Vetted & Document-Verified Directory
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw + 0.5rem, 3.25rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                  color: 'var(--black)'
                }}
              >
                Verified NGO Directory
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.95rem, 1.5vw, 1.12rem)',
                  color: '#3A4E44',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  maxWidth: '620px',
                  margin: 0
                }}
              >
                Connect with legally registered, impactful non-profits verified directly by Impact Bridge
                through statutory registration certificates and rigorous review.
              </p>
            </div>

            {/* Right Callout: Are you an NGO Leader? */}
            <div
              style={{
                backgroundColor: 'var(--accent-yellow)',
                border: 'var(--border-thick)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--white)',
                  border: '1.5px solid #000',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Sparkles size={14} color="#B45309" strokeWidth={2.5} />
                Are you an NGO Leader?
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  marginBottom: '0.5rem',
                  color: 'var(--black)'
                }}
              >
                Register Your Organization
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#26332D',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  marginBottom: '1.25rem'
                }}
              >
                Get listed on Impact Bridge, undergo document verification, and earn the official{' '}
                <strong>Verified by Impact Bridge</strong> badge to expand your donor and volunteer reach.
              </p>

              <Link to="/register-ngo" style={{ textDecoration: 'none', display: 'block' }}>
                <Button variant="dark" size="md" icon={ArrowRight} style={{ width: '100%' }}>
                  Register Your NGO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <section
        style={{
          position: 'relative',
          marginTop: '-1.5rem',
          zIndex: 30,
          marginBottom: '2.5rem'
        }}
      >
        <div className="nb-container">
          <Card
            style={{
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              backgroundColor: 'var(--white)',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: '1rem',
                alignItems: 'flex-end'
              }}
            >
              {/* Search input with leading icon */}
              <div style={{ width: '100%' }}>
                <label htmlFor="ngo-search-input" className="nb-label" style={{ marginBottom: '0.35rem' }}>
                  Search Directory
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search
                    size={18}
                    color="#5A6F64"
                    strokeWidth={2.5}
                    style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
                  />
                  <input
                    id="ngo-search-input"
                    type="text"
                    placeholder="Search by name, cause, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="nb-input"
                    style={{
                      paddingLeft: '2.4rem',
                      paddingRight: searchQuery ? '2.5rem' : '1rem',
                      height: '46px',
                      fontSize: '0.92rem'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#5A6F64'
                      }}
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>

              {/* Cause Dropdown */}
              <div style={{ width: '100%' }}>
                <label htmlFor="ngo-cause-select" className="nb-label" style={{ marginBottom: '0.35rem' }}>
                  Filter by Cause
                </label>
                <select
                  id="ngo-cause-select"
                  value={selectedCause}
                  onChange={(e) => setSelectedCause(e.target.value)}
                  className="nb-select"
                  style={{
                    height: '46px',
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  {CAUSE_OPTIONS.map((cause) => (
                    <option key={cause} value={cause}>
                      {cause === 'All' ? 'All Causes' : cause}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div style={{ width: '100%' }}>
                <label htmlFor="ngo-city-select" className="nb-label" style={{ marginBottom: '0.35rem' }}>
                  Filter by City
                </label>
                <select
                  id="ngo-city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="nb-select"
                  style={{
                    height: '46px',
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city === 'All' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters CTA if filtered */}
              {isFiltered && (
                <div style={{ width: '100%' }}>
                  <Button
                    variant="white"
                    size="sm"
                    icon={RefreshCw}
                    onClick={handleResetFilters}
                    style={{ height: '46px', width: '100%', whiteSpace: 'nowrap' }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* 3. DIRECTORY HEADER & LISTING */}
      <main className="nb-container" style={{ flex: 1, width: '100%' }}>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1rem',
            borderBottom: 'var(--border-medium)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                backgroundColor: 'var(--brand-dark-green)',
                color: 'var(--white)',
                border: '2px solid #000',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem',
                display: 'flex'
              }}
            >
              <Building2 size={20} strokeWidth={2.5} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              Active Impact Partners ({filteredNgos.length})
            </h2>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#3A4E44',
              backgroundColor: '#E2ECE6',
              border: '1.5px solid #000',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '1.5px 1.5px 0px #000'
            }}
          >
            Showing verified organizations only
          </span>
        </div>

        {/* SKELETON LOADING STATE */}
        {loading ? (
          <div className="grid-3" role="status" aria-label="Loading verified NGOs">
            <SkeletonNgoCard />
            <SkeletonNgoCard />
            <SkeletonNgoCard />
            <SkeletonNgoCard />
            <SkeletonNgoCard />
            <SkeletonNgoCard />
          </div>
        ) : error ? (
          /* ERROR STATE */
          <Card
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#FFF1F2',
              maxWidth: '600px',
              margin: '2rem auto'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-light)',
                border: '2px solid #000',
                boxShadow: '3px 3px 0 #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <AlertCircle size={28} color="var(--danger-red)" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Failed to Load Directory
            </h3>
            <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {error}
            </p>
            <Button variant="yellow" size="md" icon={RefreshCw} onClick={loadNgos}>
              Try Again
            </Button>
          </Card>
        ) : filteredNgos.length === 0 ? (
          /* EMPTY STATE */
          <EmptyState
            title={isFiltered ? 'No NGOs Match Your Filters' : 'No Verified NGOs Listed Yet'}
            description={
              isFiltered
                ? 'We could not find any verified non-profits matching your search criteria. Try broadening your terms or resetting filters.'
                : 'There are currently no verified NGOs published in the directory. Are you an NGO representative? Submit your registration for review.'
            }
            onReset={isFiltered ? handleResetFilters : null}
            resetLabel="Reset All Filters"
            icon={<Building2 size={28} color="#000000" strokeWidth={2.5} />}
          />
        ) : (
          /* 4. NGO CARDS GRID */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.75rem',
              alignItems: 'stretch'
            }}
          >
            {filteredNgos.map((ngo) => (
              <Card
                key={ngo.id}
                hover={true}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 0,
                  overflow: 'hidden',
                  border: 'var(--border-thick)',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: 'var(--white)'
                }}
              >
                <div>
                  {/* Top Bar with Badge */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: 'var(--border-medium)',
                      backgroundColor: '#F7FAF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Logo or Initials Fallback */}
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          backgroundColor: 'var(--white)',
                          border: '2px solid #000',
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: '2px 2px 0px #000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          color: 'var(--black)',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {ngo.logo ? (
                          <img
                            src={ngo.logo}
                            alt={ngo.organizationName}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span>{ngo.organizationName?.substring(0, 2).toUpperCase() || 'NB'}</span>
                        )}
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: '#5A6F64',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {ngo.ngoType || 'Non-Profit'}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: '#7A8E83',
                            fontWeight: 600
                          }}
                        >
                          Reg: {ngo.registrationNumber || 'Verified'}
                        </div>
                      </div>
                    </div>

                    {/* Official Verified Badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        backgroundColor: '#D1FAE5',
                        color: '#064E3B',
                        border: '1.5px solid #065F46',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.2rem 0.55rem',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        boxShadow: '1.5px 1.5px 0px #065F46',
                        flexShrink: 0
                      }}
                      title="Legally validated and verified by Impact Bridge administrators"
                    >
                      <ShieldCheck size={14} color="#059669" strokeWidth={2.5} />
                      Verified
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.25rem' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--black)',
                        marginBottom: '0.5rem',
                        lineHeight: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      title={ngo.organizationName}
                    >
                      {ngo.organizationName}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: '#4B5563',
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontWeight: 500,
                        minHeight: '3.95rem'
                      }}
                    >
                      {ngo.description}
                    </p>

                    {/* Location Badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#3A4E44',
                        marginBottom: '1rem'
                      }}
                    >
                      <MapPin size={15} color="#E63946" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      <span>{ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.address || 'Pan-India'}</span>
                    </div>

                    {/* Cause Tag Badges */}
                    {ngo.causes && ngo.causes.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {ngo.causes.slice(0, 3).map((cause, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: '#FFF3BF',
                              border: '1px solid #000',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '0.15rem 0.45rem',
                              color: '#000000',
                              letterSpacing: '0.02em'
                            }}
                          >
                            {cause}
                          </span>
                        ))}
                        {ngo.causes.length > 3 && (
                          <span
                            style={{
                              backgroundColor: '#E5E7EB',
                              border: '1px solid #000',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.45rem',
                              color: '#374151'
                            }}
                          >
                            +{ngo.causes.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Action Bar */}
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderTop: 'var(--border-medium)',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#5A6F64',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Calendar size={13} strokeWidth={2.5} />
                    {ngo.yearsOfOperation ? `${ngo.yearsOfOperation} yrs active` : 'Verified Partner'}
                  </span>

                  <Link to={`/ngos/${ngo.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="yellow" size="sm" icon={ArrowRight}>
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
