import React from 'react';
import { Link } from 'react-router-dom';
import ImpactMapModule from '../components/map/ImpactMap';
import Badge from '../components/common/Badge';
import { Building2, PlusCircle, ArrowRight } from 'lucide-react';

export default function ImpactMap() {
  return (
    <div className="impact-map-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">GEOGRAPHIC IMPACT RADAR</Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              marginTop: '0.75rem',
              marginBottom: '1rem',
              lineHeight: 1.1
            }}
          >
            Real-Time Pan-India Field Operations
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
            Explore all verified NGO regional headquarters, mobile telemetry routes, disaster response staging posts, and community impact clusters across India.
          </p>

          {/* Register Your NGO Callout Banner */}
          <div
            style={{
              marginTop: '2rem',
              backgroundColor: '#FFFFFF',
              border: 'var(--border-thick)',
              boxShadow: '6px 6px 0px #000000',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    backgroundColor: 'var(--accent-yellow)',
                    border: '2px solid #000',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.5rem'
                  }}
                >
                  NGO Discovery Hub
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                  Are you a Registered NGO in India?
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#4B5563', fontWeight: 500 }}>
                Get listed on Impact Bridge, undergo document verification, and earn the official <strong>Verified by Impact Bridge</strong> badge.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/ngos"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '0.5rem 1rem',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  boxShadow: '3px 3px 0px #000000',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Building2 size={16} strokeWidth={2.5} />
                <span>Browse Verified Directory</span>
              </Link>
              <Link
                to="/register-ngo"
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'var(--accent-yellow)',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '0.5rem 1.25rem',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  boxShadow: '3px 3px 0px #000000',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <PlusCircle size={16} strokeWidth={2.5} />
                <span>Register Your NGO</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAP MODULE */}
      <section className="nb-container">
        <ImpactMapModule isStandalone={true} />
      </section>
    </div>
  );
}
