import React from 'react';
import Mascot from './Mascot';

/**
 * BrandLogo — Impact Bridge Official Neo-Brutalist Branding
 * 
 * Features:
 * - Cute Bridgie mascot icon
 * - Responsive typographic lockup ("IMPACT BRIDGE")
 * - Tagline: "Connecting People. Creating Impact."
 * - Desktop & compact mobile presentation
 */
export default function BrandLogo({
  size = 'md',
  isDark = false,
  compact = false,
  className = ''
}) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const mascotSize = isSmall ? 36 : isLarge ? 54 : 44;

  return (
    <div
      className={`brand-logo-container flex items-center select-none ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.5rem' : '0.75rem',
        textDecoration: 'none'
      }}
    >
      {/* Neo-Brutalist Mascot Avatar Container */}
      <div
        style={{
          width: `${mascotSize}px`,
          height: `${mascotSize}px`,
          backgroundColor: '#F4B942',
          border: '2.5px solid #000000',
          boxShadow: isSmall ? '2px 2px 0px #000' : '3px 3px 0px #000',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <Mascot variant="logo" size={mascotSize + 6} animate={true} />
      </div>

      {/* Brand Typographic Lockup */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: isSmall ? '1.05rem' : isLarge ? '1.75rem' : '1.35rem',
              letterSpacing: '-0.03em',
              color: isDark ? '#FFFFFF' : '#26332D',
              textTransform: 'uppercase'
            }}
          >
            IMPACT <span style={{ color: isDark ? '#F4B942' : '#2E7D5B' }}>BRIDGE</span>
          </span>
        </div>

        {/* Tagline for standard viewports (hidden when compact or small on mobile) */}
        {!isSmall && !compact && (
          <span
            className="brand-tagline sm-hidden"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: isLarge ? '0.75rem' : '0.65rem',
              color: isDark ? '#A8D5BA' : '#5A6F64',
              letterSpacing: '0.04em',
              marginTop: '3px',
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
