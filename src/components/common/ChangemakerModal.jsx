import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import { ExternalLink, Award, Sparkles, Building2, Tag } from 'lucide-react';

export default function ChangemakerModal({ changemaker, onClose }) {
  const [imgHasError, setImgHasError] = useState(false);

  if (!changemaker) return null;

  const {
    name,
    designation,
    organization,
    shortBio,
    fullBio,
    achievements = [],
    impactArea,
    imageUrl,
    sourceUrl
  } = changemaker;

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
    : 'IB';

  return (
    <Modal
      isOpen={!!changemaker}
      onClose={onClose}
      title="Knowledge Profile"
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Curated Public Social-Impact Knowledge Panel
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="white" onClick={onClose}>
              Close
            </Button>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="yellow" icon={ExternalLink}>
                  Learn More
                </Button>
              </a>
            )}
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Header Card — Knowledge Panel Style */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            backgroundColor: '#F5FAF7',
            border: '2px solid #000',
            borderRadius: '6px',
            padding: '1.25rem',
            boxShadow: '3px 3px 0 #000',
            flexWrap: 'wrap'
          }}
        >
          {/* Large Profile Image with graceful fallback */}
          <div
            style={{
              width: '130px',
              height: '140px',
              borderRadius: '8px',
              border: '2px solid #000',
              overflow: 'hidden',
              backgroundColor: '#DFECE4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '2px 2px 0 #000'
            }}
          >
            {imageUrl && !imgHasError ? (
              <img
                src={imageUrl}
                alt={name}
                onError={() => setImgHasError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '2.5rem',
                  color: 'var(--brand-dark-green)'
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Identity & Metadata */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            {impactArea && (
              <div style={{ marginBottom: '0.4rem' }}>
                <Badge variant="green" size="sm">
                  {impactArea}
                </Badge>
              </div>
            )}

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.6rem',
                lineHeight: 1.2,
                color: '#1A2922',
                marginBottom: '0.35rem'
              }}
            >
              {name}
            </h2>

            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'var(--brand-dark-green)',
                marginBottom: '0.35rem',
                lineHeight: 1.35
              }}
            >
              {designation}
            </div>

            {organization && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#4B6356'
                }}
              >
                <Building2 size={15} />
                <span>{organization}</span>
              </div>
            )}
          </div>
        </div>

        {/* Short Summary Callout */}
        {shortBio && (
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FFF9E6',
              borderLeft: '4px solid var(--accent-yellow)',
              border: '2px solid #000',
              borderRadius: '4px',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              fontWeight: 600,
              color: '#26332D'
            }}
          >
            {shortBio}
          </div>
        )}

        {/* ABOUT / BIOGRAPHY */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#1A2922',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Sparkles size={18} color="var(--brand-dark-green)" />
            ABOUT
          </h4>
          <p
            style={{
              fontSize: '0.92rem',
              color: '#3A4E44',
              lineHeight: 1.7,
              fontWeight: 500,
              whiteSpace: 'pre-line'
            }}
          >
            {fullBio || shortBio}
          </p>
        </div>

        {/* KEY WORK & ACHIEVEMENTS */}
        {achievements && achievements.length > 0 && (
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: '#1A2922',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Award size={18} color="var(--brand-dark-green)" />
              KEY WORK & ACHIEVEMENTS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #000',
                    borderRadius: '4px',
                    boxShadow: '2px 2px 0 #000'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'var(--accent-yellow)',
                      border: '1px solid #000',
                      borderRadius: '50%',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#2B3D34', lineHeight: 1.5, fontWeight: 600 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPACT AREA & SOURCE */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#EBF4EF',
            border: '2px solid #000',
            borderRadius: '6px',
            padding: '1rem 1.25rem',
            boxShadow: '2px 2px 0 #000',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#556B60', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={13} />
              IMPACT AREA
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-dark-green)' }}>
              {impactArea || 'Social Development'}
            </div>
          </div>

          {sourceUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#556B60', marginBottom: '0.2rem' }}>
                SOURCE
              </div>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="yellow" size="sm" icon={ExternalLink}>
                  Learn More
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Public Disclaimer */}
        <div
          style={{
            fontSize: '0.78rem',
            color: '#768B80',
            fontStyle: 'italic',
            borderTop: '1px solid #D6E4DC',
            paddingTop: '0.75rem'
          }}
        >
          * This knowledge profile is curated from verified public archives for educational and inspirational purposes, honoring pioneers of Indian social development. These figures are independent leaders and not staff or representatives of Impact Bridge.
        </div>
      </div>
    </Modal>
  );
}
