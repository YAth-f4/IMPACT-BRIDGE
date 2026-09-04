import React from 'react';
import ImpactMap from '../../components/map/ImpactMap';
import Badge from '../../components/common/Badge';

export default function ImpactMapPage() {
  return (
    <div className="impact-map-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
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
        </div>
      </section>

      {/* 2. MAP MODULE */}
      <section className="nb-container" style={{ paddingBottom: '2rem' }}>
        <ImpactMap isStandalone={true} />
      </section>
    </div>
  );
}
