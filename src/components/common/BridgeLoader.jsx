import React from 'react';
import Mascot from './Mascot';

/**
 * BridgeLoader — Signature IMPACT BRIDGE Unified Loading Component
 * 
 * Concept:
 * Left pier (shore A) → Bridge Connection Beam (spanning with pulse) → Right pier (shore B)
 * with Bridgie mascot subtly guiding the connection.
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default 'md')
 * - label: text label below or beside loader
 * - inline: compact horizontal presentation for buttons
 * - showMascot: whether to show Bridgie icon (default true for md/lg)
 */
export default function BridgeLoader({
  size = 'md',
  label = 'Connecting...',
  inline = false,
  showMascot = true,
  className = '',
  style = {}
}) {
  if (inline) {
    return (
      <span
        className={`bridge-loader-inline ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          verticalAlign: 'middle',
          ...style
        }}
        role="status"
        aria-live="polite"
      >
        {/* Compact Mini Bridge Icon */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            width: '28px',
            height: '14px',
            position: 'relative'
          }}
        >
          {/* Left pier */}
          <span
            style={{
              width: '6px',
              height: '14px',
              backgroundColor: '#000000',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          {/* Connecting arch / beam */}
          <span
            style={{
              flex: 1,
              height: '4px',
              backgroundColor: 'var(--accent-yellow)',
              borderTop: '1.5px solid #000',
              borderBottom: '1.5px solid #000',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span
              className="animate-bridge-beam"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                backgroundColor: '#000000'
              }}
            />
          </span>
          {/* Right pier */}
          <span
            style={{
              width: '6px',
              height: '14px',
              backgroundColor: '#000000',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
        </span>

        {label && <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{label}</span>}
      </span>
    );
  }

  const isLarge = size === 'lg';
  const pierWidth = isLarge ? '14px' : '10px';
  const pierHeight = isLarge ? '34px' : '26px';
  const bridgeWidth = isLarge ? '90px' : '64px';
  const mascotDimension = isLarge ? 48 : 36;

  return (
    <div
      className={`bridge-loader-block ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: isLarge ? '2rem' : '1.25rem',
        ...style
      }}
      role="status"
      aria-live="polite"
    >
      {/* Mascot & Bridge Visual */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {showMascot && (
          <div
            style={{
              width: `${mascotDimension}px`,
              height: `${mascotDimension}px`,
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'logoEntrance 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <Mascot variant="builder" size={mascotDimension - 8} />
          </div>
        )}

        {/* Bridge Piers & Span */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            width: `calc(${bridgeWidth} + 24px)`,
            height: pierHeight,
            position: 'relative'
          }}
        >
          {/* Left Shore Pillar */}
          <div
            style={{
              width: pierWidth,
              height: pierHeight,
              backgroundColor: 'var(--brand-dark-green)',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '3px 3px 0 0'
            }}
          />

          {/* Central Connecting Beam / Span */}
          <div
            style={{
              flex: 1,
              height: '8px',
              marginBottom: '6px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '0 2px 0 #000',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '2px'
            }}
          >
            <div
              className="animate-bridge-beam"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                backgroundColor: 'var(--accent-yellow)',
                borderRight: '2px solid #000'
              }}
            />
          </div>

          {/* Right Shore Pillar */}
          <div
            style={{
              width: pierWidth,
              height: pierHeight,
              backgroundColor: 'var(--brand-dark-green)',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '3px 3px 0 0'
            }}
          />
        </div>
      </div>

      {label && (
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: isLarge ? '1.05rem' : '0.88rem',
            color: 'var(--text-dark)',
            letterSpacing: '0.01em',
            textAlign: 'center'
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
