import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  variant = 'default' // 'default' | 'pills'
}) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              padding: 'clamp(0.45rem, 1.2vw, 0.55rem) clamp(0.75rem, 1.8vw, 1.15rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              border: '2px solid #000000',
              borderRadius: '4px',
              backgroundColor: isActive ? 'var(--brand-dark-green)' : 'var(--white)',
              color: isActive ? 'var(--white)' : 'var(--text-dark)',
              boxShadow: isActive ? '4px 4px 0px #000000' : '2px 2px 0px #000000',
              transform: isActive ? 'translate(-1px, -1px)' : 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.1s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon && <tab.icon size={16} strokeWidth={2.5} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  backgroundColor: isActive ? 'var(--accent-yellow)' : '#E2ECE6',
                  color: '#000000',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '3px',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  border: '1px solid #000'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
