import React, { useState } from 'react';
import Card from '../common/Card';
import { formatNumber } from '../../utils/formatters';

export default function DonutChart({
  title,
  subtitle,
  data = [], // [{ label: 'Education', value: 45, color: '#2E7D5B' }]
  height = 240
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data.length) return null;

  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const size = height - 40;
  const radius = size / 2 - 15;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <Card className="chart-card" style={{ padding: '1.25rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>
          {title}
        </h4>
        {subtitle && <p style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 600 }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
        {/* SVG Donut */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {data.map((item, idx) => {
              const percent = (item.value / total) * 100;
              const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += percent;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color || '#2E7D5B'}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    cursor: 'pointer',
                    transition: 'stroke-width 0.15s ease',
                    filter: isHovered ? 'drop-shadow(2px 2px 0px #000)' : 'none'
                  }}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
              {hoveredIdx !== null ? data[hoveredIdx].label : 'Total'}
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900 }}>
              {hoveredIdx !== null
                ? `${Math.round((data[hoveredIdx].value / total) * 100)}%`
                : formatNumber(total)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
          {data.map((item, idx) => {
            const percent = Math.round((item.value / total) * 100);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: isHovered ? 800 : 600,
                  cursor: 'pointer',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  backgroundColor: isHovered ? '#F0F7F2' : 'transparent',
                  border: isHovered ? '1.5px solid #000' : '1.5px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: item.color || '#2E7D5B',
                      border: '1.5px solid #000',
                      borderRadius: '2px',
                      display: 'inline-block'
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                <span style={{ fontWeight: 800 }}>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
