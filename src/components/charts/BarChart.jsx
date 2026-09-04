import React, { useState } from 'react';
import Card from '../common/Card';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function BarChart({
  title,
  subtitle,
  data = [], // [{ label: 'Jan', value: 120000, secondaryValue: 80000 }]
  isCurrency = true,
  height = 240,
  barColor = '#2E7D5B',
  secondaryColor = '#F4B942',
  hasSecondary = false,
  secondaryLabel = '',
  primaryLabel = 'Amount'
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data.length) return null;

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.value || 0, hasSecondary ? d.secondaryValue || 0 : 0)),
    1
  );

  return (
    <Card className="chart-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>
            {title}
          </h4>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 600 }}>{subtitle}</p>
          )}
        </div>

        {hasSecondary && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: barColor, border: '1.5px solid #000', display: 'inline-block' }} />
              <span>{primaryLabel}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: secondaryColor, border: '1.5px solid #000', display: 'inline-block' }} />
              <span>{secondaryLabel}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: '12px', position: 'relative', paddingTop: '30px' }}>
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * 100;
          const secHeightPercent = hasSecondary ? ((item.secondaryValue || 0) / maxValue) * 100 : 0;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: '2px 2px 0px #F4B942',
                    pointerEvents: 'none'
                  }}
                >
                  <div>{item.label}</div>
                  <div>
                    {primaryLabel}: {isCurrency ? formatCurrency(item.value) : formatNumber(item.value)}
                  </div>
                  {hasSecondary && (
                    <div>
                      {secondaryLabel}: {isCurrency ? formatCurrency(item.secondaryValue) : formatNumber(item.secondaryValue)}
                    </div>
                  )}
                </div>
              )}

              {/* Bars Group */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center' }}>
                {/* Primary Bar */}
                <div
                  style={{
                    width: hasSecondary ? '45%' : '75%',
                    height: `${Math.max(heightPercent, 4)}%`,
                    backgroundColor: isHovered ? '#3D9B72' : barColor,
                    border: '2px solid #000000',
                    boxShadow: isHovered ? '2px 2px 0px #000' : 'none',
                    borderRadius: '2px 2px 0 0',
                    transition: 'all 0.15s ease'
                  }}
                />

                {/* Secondary Bar if present */}
                {hasSecondary && (
                  <div
                    style={{
                      width: '45%',
                      height: `${Math.max(secHeightPercent, 4)}%`,
                      backgroundColor: isHovered ? '#F7C75F' : secondaryColor,
                      border: '2px solid #000000',
                      boxShadow: isHovered ? '2px 2px 0px #000' : 'none',
                      borderRadius: '2px 2px 0 0',
                      transition: 'all 0.15s ease'
                    }}
                  />
                )}
              </div>

              {/* Axis Label */}
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.75rem',
                  fontWeight: isHovered ? 800 : 700,
                  marginTop: '8px',
                  color: isHovered ? 'var(--black)' : '#5A6F64'
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
