import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend, // e.g. { value: '+14%', isPositive: true, label: 'vs last month' }
  variant = 'default', // 'default' | 'yellow' | 'lightgreen' | 'green'
  badgeText,
  onClick,
  className = ''
}) {
  return (
    <Card
      variant={variant}
      hover={true}
      onClick={onClick}
      className={`stat-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.35rem',
        minHeight: '140px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: variant === 'green' ? 'rgba(255,255,255,0.85)' : '#5A6F64'
            }}
          >
            {title}
          </span>
          {badgeText && (
            <span
              style={{
                marginLeft: '0.5rem',
                backgroundColor: 'var(--accent-yellow)',
                color: 'var(--black)',
                padding: '0.15rem 0.4rem',
                fontSize: '0.65rem',
                fontWeight: 900,
                border: '1px solid #000',
                borderRadius: '3px'
              }}
            >
              {badgeText}
            </span>
          )}
        </div>

        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: variant === 'green' ? '#FFFFFF' : 'var(--accent-yellow)',
              color: 'var(--black)',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={22} strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '1.85rem',
            lineHeight: 1.1,
            color: variant === 'green' ? '#FFFFFF' : 'var(--text-dark)'
          }}
        >
          {value}
        </h2>

        {(subtitle || trend) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            {trend && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.15rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '3px',
                  border: '1px solid #000',
                  backgroundColor: trend.isPositive ? '#A8D5BA' : '#FFCCD5',
                  color: trend.isPositive ? '#164E35' : '#8B0000',
                  fontSize: '0.75rem'
                }}
              >
                {trend.isPositive ? (
                  <ArrowUpRight size={13} strokeWidth={3} />
                ) : (
                  <ArrowDownRight size={13} strokeWidth={3} />
                )}
                {trend.value}
              </span>
            )}
            <span
              style={{
                color: variant === 'green' ? 'rgba(255,255,255,0.75)' : '#6C7E74',
                fontWeight: 600
              }}
            >
              {trend?.label || subtitle}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
