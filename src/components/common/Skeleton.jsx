import React from 'react';

/**
 * Neo-Brutalist Skeleton UI Components
 * Designed with distinct borders, subtle shadows, and a gentle shimmer animation.
 * Fully responsive and honors prefers-reduced-motion.
 */

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {}
}) {
  return (
    <div
      className={`nb-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonStatCard() {
  return (
    <div
      className="nb-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.35rem',
        minHeight: '140px',
        backgroundColor: '#FFFFFF'
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="45%" height="14px" />
        <Skeleton width="40px" height="40px" borderRadius="4px" />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Skeleton width="60%" height="32px" style={{ marginBottom: '8px' }} />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>
  );
}

export function SkeletonCard({ lines = 3, height = '200px' }) {
  return (
    <div
      className="nb-card"
      style={{
        padding: '1.5rem',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        minHeight: height
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Skeleton width="46px" height="46px" borderRadius="6px" />
        <div style={{ flex: 1 }}>
          <Skeleton width="70%" height="18px" style={{ marginBottom: '6px' }} />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${90 - i * 15}%`} height="14px" />
      ))}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <Skeleton width="80px" height="32px" borderRadius="4px" />
        <Skeleton width="100px" height="32px" borderRadius="4px" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} style={{ padding: '1rem' }}>
          <Skeleton width={idx === 0 ? '75%' : idx === columns - 1 ? '50px' : '60%'} height="16px" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonNgoCard() {
  return (
    <div
      className="nb-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
        overflow: 'hidden',
        border: 'var(--border-thick)',
        boxShadow: 'var(--shadow-md)',
        backgroundColor: '#FFFFFF',
        minHeight: '340px'
      }}
      aria-hidden="true"
    >
      <div style={{ padding: '1rem 1.25rem', borderBottom: '2px solid #000', backgroundColor: '#F7FAF8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Skeleton width="46px" height="46px" borderRadius="4px" />
          <div>
            <Skeleton width="90px" height="12px" style={{ marginBottom: '4px' }} />
            <Skeleton width="60px" height="10px" />
          </div>
        </div>
        <Skeleton width="75px" height="24px" borderRadius="4px" />
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <Skeleton width="80%" height="22px" />
        <Skeleton width="100%" height="14px" />
        <Skeleton width="95%" height="14px" />
        <Skeleton width="60%" height="14px" />
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Skeleton width="70px" height="20px" borderRadius="4px" />
          <Skeleton width="85px" height="20px" borderRadius="4px" />
        </div>
      </div>
      <div style={{ padding: '1rem 1.25rem', borderTop: '2px solid #E2ECE6', backgroundColor: '#FAFCFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="80px" height="14px" />
        <Skeleton width="100px" height="34px" borderRadius="4px" />
      </div>
    </div>
  );
}

export default Skeleton;
