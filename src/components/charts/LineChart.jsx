import React, { useState } from 'react';
import Card from '../common/Card';
import { formatNumber } from '../../utils/formatters';

export default function LineChart({
  title,
  subtitle,
  data = [], // [{ label: 'Jan', val1: 45, val2: 25 }]
  series1Name = 'Volunteers',
  series2Name = 'Beneficiaries (x100)',
  series1Color = '#2E7D5B',
  series2Color = '#F4B942',
  height = 240
}) {
  const [activePoint, setActivePoint] = useState(null);

  if (!data.length) return null;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.val1 || 0, d.val2 || 0)),
    10
  );

  const paddingX = 40;
  const paddingY = 30;
  const svgWidth = 500;
  const svgHeight = height;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points1 = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = svgHeight - paddingY - (d.val1 / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const points2 = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = svgHeight - paddingY - (d.val2 / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const path1 = points1.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  const path2 = points2.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  return (
    <Card className="chart-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>
            {title}
          </h4>
          {subtitle && <p style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 600 }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '4px', backgroundColor: series1Color, border: '1px solid #000', display: 'inline-block' }} />
            <span>{series1Name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '4px', backgroundColor: series2Color, border: '1px solid #000', display: 'inline-block' }} />
            <span>{series2Name}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
        >
          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = svgHeight - paddingY - ratio * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#E0EBE4"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="var(--font-heading)"
                  fontWeight="700"
                  fill="#7A8E83"
                >
                  {Math.round(ratio * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Series 1 Line */}
          <path
            d={path1}
            fill="none"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={path1}
            fill="none"
            stroke={series1Color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Series 2 Line */}
          <path
            d={path2}
            fill="none"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={path2}
            fill="none"
            stroke={series2Color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes & Interactive Points */}
          {points1.map((p, idx) => (
            <g
              key={`p1-${idx}`}
              onMouseEnter={() => setActivePoint({ ...p, type: 1 })}
              onMouseLeave={() => setActivePoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={p.x} cy={p.y} r="6" fill="#000000" />
              <circle cx={p.x} cy={p.y} r="4.5" fill={series1Color} />
            </g>
          ))}

          {points2.map((p, idx) => (
            <g
              key={`p2-${idx}`}
              onMouseEnter={() => setActivePoint({ ...p, type: 2 })}
              onMouseLeave={() => setActivePoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={p.x} cy={p.y} r="6" fill="#000000" />
              <circle cx={p.x} cy={p.y} r="4.5" fill={series2Color} />
            </g>
          ))}

          {/* X Axis Labels */}
          {points1.map((p, idx) => (
            <text
              key={`lbl-${idx}`}
              x={p.x}
              y={svgHeight - 8}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-heading)"
              fontWeight="700"
              fill="#26332D"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {activePoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100}%`,
              transform: 'translate(-50%, -120%)',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: '2px 2px 0px #F4B942',
              pointerEvents: 'none',
              zIndex: 20,
              whiteSpace: 'nowrap'
            }}
          >
            {activePoint.label} : {activePoint.type === 1 ? `${series1Name}: ${formatNumber(activePoint.val1)}` : `${series2Name}: ${formatNumber(activePoint.val2)}`}
          </div>
        )}
      </div>
    </Card>
  );
}
