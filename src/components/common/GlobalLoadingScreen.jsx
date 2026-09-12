import React, { useState, useEffect } from 'react';
import Mascot from './Mascot';

/**
 * GlobalLoadingScreen — Impact Bridge Signature Loading Experience
 * 
 * Flow:
 * 1. Bridge piers slide and lock together (0-200ms)
 * 2. Bridgie mascot hops onto the bridge (200-400ms)
 * 3. Typographic lockup reveals with progress bar (400-700ms)
 * 4. Graceful fade-out into the app view
 */
export default function GlobalLoadingScreen({
  forceShow = false,
  onComplete,
  duration = 850
}) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(1); // 1: bridge, 2: mascot, 3: text, 4: complete
  const [visible, setVisible] = useState(() => {
    if (forceShow) return true;
    const hasLoaded = sessionStorage.getItem('ib_initial_loaded');
    return !hasLoaded;
  });

  useEffect(() => {
    if (!visible) return;

    const intervalTime = duration / 100;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 30 && stage < 2) setStage(2);
        if (next >= 60 && stage < 3) setStage(3);

        if (next >= 100) {
          clearInterval(interval);
          setStage(4);
          sessionStorage.setItem('ib_initial_loaded', 'true');
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [visible, duration, stage, onComplete]);

  if (!visible) return null;

  return (
    <aside
      className="global-loader-backdrop"
      aria-label="Loading Impact Bridge"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'var(--bg-offwhite)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: stage === 4 ? 0 : 1,
        pointerEvents: stage === 4 ? 'none' : 'all',
        padding: '1.5rem'
      }}
    >
      {/* Neo-Brutalist Outer Box */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: 'var(--border-thick)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-2xl)',
          padding: '2.5rem 2rem',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Stage 1 & 2: Bridge pieces & Mascot */}
        <div style={{ position: 'relative', height: '120px', width: '120px', marginBottom: '1.25rem' }}>
          <div
            style={{
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: stage >= 2 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(12px)',
              opacity: stage >= 1 ? 1 : 0
            }}
          >
            <Mascot variant={stage >= 3 ? 'waving' : 'builder'} size={120} animate={true} />
          </div>
        </div>

        {/* Stage 3: Typographic Lockup */}
        <div
          style={{
            transition: 'all 0.25s ease-out',
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? 'translateY(0)' : 'translateY(8px)',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid #000',
              boxShadow: '2px 2px 0 #000',
              padding: '2px 10px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.5rem'
            }}
          >
            BRIDGING COMMUNITIES
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '1.65rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#26332D'
            }}
          >
            IMPACT <span style={{ color: 'var(--brand-dark-green)' }}>BRIDGE</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#5A6F64',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '4px'
            }}
          >
            Connecting People. Creating Impact.
          </p>
        </div>

        {/* Progress Track (Neo-Brutalist) */}
        <div
          style={{
            width: '100%',
            height: '14px',
            backgroundColor: '#E2ECE6',
            border: '2px solid #000000',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '2px 2px 0 #000',
            position: 'relative'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: 'var(--brand-dark-green)',
              transition: 'width 0.05s linear',
              backgroundImage: 'linear-gradient(45deg, rgba(244, 185, 66, 0.4) 25%, transparent 25%, transparent 50%, rgba(244, 185, 66, 0.4) 50%, rgba(244, 185, 66, 0.4) 75%, transparent 75%, transparent)',
              backgroundSize: '16px 16px'
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '0.5rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#5A6F64'
          }}
        >
          <span>BUILDING CONNECTION</span>
          <span>{progress}%</span>
        </div>
      </div>
    </aside>
  );
}
