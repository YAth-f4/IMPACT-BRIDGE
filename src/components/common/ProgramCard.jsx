import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { MapPin, Users, ArrowRight } from 'lucide-react';

export default function ProgramCard({ prog, viewMode = 'grid' }) {
  if (!prog) return null;

  if (viewMode === 'list') {
    return (
      <Card
        hover={true}
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr auto',
          gap: '1.5rem',
          padding: '1.25rem',
          alignItems: 'center'
        }}
        className="list-card-grid"
      >
        <style>{`
          @media (max-width: 768px) {
            .list-card-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        <div style={{ height: '140px', width: '100%', border: '2px solid #000', borderRadius: '4px', overflow: 'hidden' }}>
          <img src={prog.image} alt={prog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <Badge variant="yellow" size="sm">{prog.category}</Badge>
            <Badge variant="green" size="sm">{prog.status}</Badge>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#5A6F64', marginLeft: '0.5rem' }}>
              📍 {prog.location}
            </span>
          </div>

          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>
            {prog.title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#3A4E44', lineHeight: 1.4, marginBottom: '0.75rem' }}>
            {prog.shortDesc}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', fontWeight: 700, flexWrap: 'wrap' }}>
            <span>👥 {formatNumber(prog.actualBeneficiaries)} Beneficiaries</span>
            <span>🤝 {prog.volunteersEnrolled} Volunteers</span>
            <span>💰 {formatCurrency(prog.fundsRaised)} / {formatCurrency(prog.budget)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to={`/programs/${prog.id}`}>
            <Button variant="yellow" size="sm" fullWidth>
              View Details
            </Button>
          </Link>
          <Link to="/volunteer">
            <Button variant="green" size="sm" fullWidth>
              Volunteer
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card
      hover={true}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0',
        overflow: 'hidden'
      }}
    >
      {/* Program Thumbnail */}
      <div style={{ position: 'relative', height: '190px', width: '100%', borderBottom: '2px solid #000' }}>
        <img
          src={prog.image}
          alt={prog.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
          <Badge variant="yellow" size="sm">{prog.category}</Badge>
          <Badge variant={prog.status === 'Ongoing' ? 'green' : prog.status === 'Completed' ? 'white' : 'blue'} size="sm">
            {prog.status}
          </Badge>
        </div>
      </div>

      {/* Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#5A6F64', fontWeight: 700, marginBottom: '0.4rem' }}>
            <MapPin size={14} color="var(--brand-dark-green)" /> {prog.location}
          </div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.6rem', lineHeight: 1.3 }}>
            {prog.title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#3A4E44', lineHeight: 1.5, marginBottom: '1rem', fontWeight: 500 }}>
            {prog.shortDesc}
          </p>
        </div>

        {/* Progress & Actions */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              <span>Raised: {formatCurrency(prog.fundsRaised)}</span>
              <span>{prog.progress}%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#E2ECE6', border: '1.5px solid #000', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${prog.progress}%`, backgroundColor: 'var(--accent-yellow)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>
              👥 {formatNumber(prog.actualBeneficiaries)} Helped
            </span>
            <Link to={`/programs/${prog.id}`}>
              <Button variant="yellow" size="sm" iconRight={ArrowRight}>
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
