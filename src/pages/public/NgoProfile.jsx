import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BridgeLoader from '../../components/common/BridgeLoader';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  Target,
  Sparkles,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

export default function NgoProfile() {
  const { id } = useParams();
  const { fetchPublicNgoById } = useApp();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNgo();
  }, [id]);

  const loadNgo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPublicNgoById(id);
      if (res && res.success && res.ngo) {
        setNgo(res.ngo);
      } else {
        setError(res?.error || 'NGO profile not found or not approved for public directory.');
      }
    } catch (err) {
      console.error('Failed to load NGO profile:', err);
      setError('A connection error occurred while loading this organization profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-offwhite)',
          padding: '3rem 1rem'
        }}
      >
        <BridgeLoader size="lg" label="Loading NGO verified profile..." />
      </div>
    );
  }

  if (error || !ngo) {
    return (
      <div
        style={{
          minHeight: '75vh',
          backgroundColor: 'var(--bg-offwhite)',
          padding: '4rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card
          style={{
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            padding: '3rem 2rem',
            border: 'var(--border-thick)',
            boxShadow: 'var(--shadow-xl)',
            backgroundColor: 'var(--white)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger-light)',
              border: '2px solid #000',
              boxShadow: '3px 3px 0 #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <AlertCircle size={32} color="var(--danger-red)" strokeWidth={2.5} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 900,
              marginBottom: '0.75rem'
            }}
          >
            Organization Unavailable
          </h2>
          <p
            style={{
              color: '#5A6F64',
              fontSize: '0.95rem',
              lineHeight: 1.55,
              marginBottom: '1.75rem'
            }}
          >
            {error || 'This organization profile could not be retrieved. It may be pending admin verification.'}
          </p>
          <Link to="/ngos" style={{ textDecoration: 'none' }}>
            <Button variant="yellow" size="md" icon={ArrowLeft}>
              Back to Verified Directory
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="ngo-profile-page"
      style={{
        backgroundColor: 'var(--bg-offwhite)',
        minHeight: '80vh',
        color: 'var(--text-dark)',
        paddingBottom: '4rem'
      }}
    >
      {/* 1. TOP BREADCRUMB NAVIGATION */}
      <div style={{ padding: '1.25rem 0', borderBottom: '1.5px solid #E2ECE6' }}>
        <div className="nb-container">
          <Link
            to="/ngos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: 'var(--brand-dark-green)',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Verified NGOs
          </Link>
        </div>
      </div>

      {/* 2. HERO ORGANIZATION HEADER */}
      <section style={{ padding: '2rem 0', backgroundColor: '#FFFFFF', borderBottom: 'var(--border-thick)' }}>
        <div className="nb-container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Logo / Monogram */}
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: 'var(--accent-yellow)',
                  border: 'var(--border-thick)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '2.5rem',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {ngo.logo ? (
                  <img
                    src={ngo.logo}
                    alt={ngo.organizationName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{ngo.organizationName?.substring(0, 2).toUpperCase() || 'IB'}</span>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#D1FAE5',
                      color: '#064E3B',
                      border: '1.5px solid #065F46',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.6rem',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      boxShadow: '1.5px 1.5px 0px #065F46'
                    }}
                  >
                    <ShieldCheck size={14} color="#059669" strokeWidth={2.5} />
                    Verified by Impact Bridge
                  </span>

                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: '#E5E7EB',
                      border: '1.5px solid #000',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.5rem'
                    }}
                  >
                    {ngo.ngoType || 'Non-Profit'}
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                    fontWeight: 900,
                    marginBottom: '0.5rem',
                    lineHeight: 1.2
                  }}
                >
                  {ngo.organizationName}
                </h1>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '1.25rem',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#4B5563'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} color="#E63946" strokeWidth={2.5} />
                    {ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.address || 'India'}
                  </span>
                  {ngo.yearsOfOperation && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={15} color="#3B82F6" strokeWidth={2.5} />
                      {ngo.yearsOfOperation} Years Active
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    Reg: {ngo.registrationNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                to={`/donation?ngo=${encodeURIComponent(ngo.organizationName)}`}
                style={{ textDecoration: 'none' }}
              >
                <Button variant="yellow" size="md" icon={HeartHandshake}>
                  Support Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DETAILS GRID */}
      <div className="nb-container" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          {/* Main Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: '2 1 500px' }}>
            {/* About / Mission */}
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: 'var(--shadow-md)',
                padding: '2rem',
                backgroundColor: 'var(--white)'
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  borderBottom: 'var(--border-medium)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FileText size={20} color="var(--brand-dark-green)" strokeWidth={2.5} />
                About the Organization
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#26332D',
                  fontWeight: 500,
                  whiteSpace: 'pre-line'
                }}
              >
                {ngo.description}
              </p>
            </Card>

            {/* Causes Supported */}
            {ngo.causes && ngo.causes.length > 0 && (
              <Card
                style={{
                  border: 'var(--border-thick)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '2rem',
                  backgroundColor: 'var(--white)'
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    borderBottom: 'var(--border-medium)',
                    paddingBottom: '0.75rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Target size={20} color="#E63946" strokeWidth={2.5} />
                  Mission Focus & Causes
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {ngo.causes.map((cause, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'var(--accent-yellow)',
                        border: 'var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        textTransform: 'uppercase',
                        padding: '0.35rem 0.75rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {cause}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Key Programs */}
            {ngo.programs && ngo.programs.length > 0 && (
              <Card
                style={{
                  border: 'var(--border-thick)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '2rem',
                  backgroundColor: 'var(--white)'
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    borderBottom: 'var(--border-medium)',
                    paddingBottom: '0.75rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Sparkles size={20} color="#4F46E5" strokeWidth={2.5} />
                  Key Programs & Initiatives
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {ngo.programs.map((prog, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        border: 'var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#F8FAF9',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--black)',
                          color: 'var(--white)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#26332D' }}>
                        {prog}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', flex: '1 1 300px' }}>
            {/* Impact Bridge Verification Card */}
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: 'var(--shadow-md)',
                padding: '1.75rem',
                backgroundColor: '#ECFDF5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <ShieldCheck size={32} color="#059669" strokeWidth={2.5} />
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      margin: 0
                    }}
                  >
                    Impact Bridge Verified
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 600 }}>
                    Authenticity and legal standing vetted
                  </span>
                </div>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  borderTop: '1.5px solid #A7F3D0',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#064E3B'
                }}
              >
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#059669" strokeWidth={2.5} />
                  Statutory Registration Certificate on record
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#059669" strokeWidth={2.5} />
                  Authorized Representative Identity Confirmed
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#059669" strokeWidth={2.5} />
                  Impact Bridge Platform Compliance Cleared
                </li>
              </ul>
            </Card>

            {/* Official Contact Info */}
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: 'var(--shadow-md)',
                padding: '1.75rem',
                backgroundColor: 'var(--white)'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  borderBottom: 'var(--border-medium)',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                Official Contact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                {ngo.contactEmail && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <Mail size={16} color="#5A6F64" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                        Email
                      </span>
                      <a href={`mailto:${ngo.contactEmail}`} style={{ fontWeight: 700, color: 'var(--brand-dark-green)', wordBreak: 'break-all' }}>
                        {ngo.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {ngo.phone && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <Phone size={16} color="#5A6F64" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                        Phone
                      </span>
                      <a href={`tel:${ngo.phone}`} style={{ fontWeight: 700, color: 'var(--brand-dark-green)' }}>
                        {ngo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {ngo.website && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <Globe size={16} color="#5A6F64" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                        Website
                      </span>
                      <a
                        href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: 700, color: 'var(--brand-dark-green)', display: 'inline-flex', alignItems: 'center', gap: '4px', wordBreak: 'break-all' }}
                      >
                        {ngo.website}
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <MapPin size={16} color="#5A6F64" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                      Registered Address
                    </span>
                    <div style={{ fontWeight: 600, color: '#374151', lineHeight: 1.45 }}>
                      {ngo.address ? `${ngo.address}, ` : ''}
                      {ngo.city ? `${ngo.city}, ` : ''}
                      {ngo.state ? `${ngo.state} ` : ''}
                      {ngo.pincode ? `- ${ngo.pincode}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Leadership Box */}
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: 'var(--shadow-md)',
                padding: '1.75rem',
                backgroundColor: 'var(--white)'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  borderBottom: 'var(--border-medium)',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                Leadership
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                {ngo.founder && (
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                      Founder / Executive Head
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{ngo.founder}</strong>
                  </div>
                )}

                {ngo.authorizedRepresentative && (
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                      Authorized Representative
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{ngo.authorizedRepresentative}</strong>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
