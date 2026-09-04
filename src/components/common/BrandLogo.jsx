import React from 'react';

export default function BrandLogo({ size = 'md', isDark = false, className = '' }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      {/* Neo-Brutalist Bridge Graphic Icon */}
      <div
        style={{
          width: isSmall ? '32px' : isLarge ? '48px' : '38px',
          height: isSmall ? '32px' : isLarge ? '48px' : '38px',
          backgroundColor: '#F4B942',
          border: '2.5px solid #000000',
          boxShadow: isSmall ? '2px 2px 0px #000' : '3px 3px 0px #000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '80%', height: '80%' }}
        >
          {/* Bridge Arch Connecting 2 Sides */}
          <path
            d="M 6 28 Q 20 10 34 28"
            stroke="#2E7D5B"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Vertical Cables */}
          <line x1="12" y1="28" x2="12" y2="20" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="28" x2="20" y2="14" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="28" x2="28" y2="20" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          {/* Base Road Deck */}
          <line x1="4" y1="28" x2="36" y2="28" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
          {/* Two Solid Foundation Pillars */}
          <rect x="5" y="28" width="5" height="8" fill="#000000" />
          <rect x="30" y="28" width="5" height="8" fill="#000000" />
        </svg>
      </div>

      {/* Brand Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: isSmall ? '1.1rem' : isLarge ? '1.75rem' : '1.35rem',
            letterSpacing: '-0.03em',
            color: isDark ? '#FFFFFF' : '#26332D',
            textTransform: 'uppercase'
          }}
        >
          IMPACT <span style={{ color: isDark ? '#F4B942' : '#2E7D5B' }}>BRIDGE</span>
        </span>
        {!isSmall && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: isLarge ? '0.75rem' : '0.65rem',
              color: isDark ? '#A8D5BA' : '#5A6F64',
              letterSpacing: '0.04em',
              marginTop: '2px',
              textTransform: 'uppercase'
            }}
          >
            Connecting People. Creating Impact.
          </span>
        )}
      </div>
    </div>
  );
}
