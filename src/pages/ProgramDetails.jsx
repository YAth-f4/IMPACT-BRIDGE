import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Heart,
  CheckCircle,
  Share2,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { programs, addToast } = useApp();

  const prog = programs.find((p) => p.id === id);

  if (!prog) {
    return (
      <div className="nb-container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <Card style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>Program Not Found</h2>
          <p style={{ color: '#5A6F64', marginBottom: '1.5rem' }}>
            The requested program initiative with ID <strong>{id}</strong> could not be located.
          </p>
          <Link to="/programs" style={{ textDecoration: 'none' }}>
            <Button variant="yellow" icon={ArrowLeft}>
              Back to Programs
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Program link copied to clipboard!', 'info');
  };

  return (
    <div className="program-details-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      {/* 1. TOP BREADCRUMB & BACK ACTION */}
      <section style={{ backgroundColor: '#EBF4EF', borderBottom: 'var(--border-thick)', padding: '1.5rem 0' }}>
        <div className="nb-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800 }}>
              <Link to="/programs" style={{ color: 'var(--brand-dark-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={16} strokeWidth={2.5} /> All Programs
              </Link>
              <span>/</span>
              <span style={{ color: '#5A6F64' }}>{prog.id}</span>
            </div>

            <Button variant="white" size="sm" icon={Share2} onClick={handleShare}>
              Share Program
            </Button>
          </div>
        </div>
      </section>

      {/* 2. MAIN PROGRAM DETAILS */}
      <section className="nb-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '2.5rem' }} className="hero-grid">
          <style>{`
            @media (max-width: 960px) {
              .hero-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* Left Column: Media, Story, Objectives */}
          <div>
            {/* Banner Image */}
            <div
              style={{
                width: '100%',
                height: '340px',
                border: 'var(--border-thick)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
                marginBottom: '1.5rem',
                position: 'relative'
              }}
            >
              <img
                src={prog.image}
                alt={prog.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                <Badge variant="yellow" size="md">{prog.category}</Badge>
                <Badge variant={prog.status === 'Ongoing' ? 'green' : 'white'} size="md">{prog.status}</Badge>
              </div>
            </div>

            {/* Title & Meta */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                lineHeight: 1.15,
                marginBottom: '1rem'
              }}
            >
              {prog.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#5A6F64'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={18} color="var(--brand-dark-green)" /> {prog.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={18} color="var(--brand-dark-green)" /> {prog.startDate} to {prog.endDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={18} color="var(--brand-dark-green)" /> Lead: {prog.lead}
              </span>
            </div>

            {/* Narrative Description */}
            <Card style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                About This Initiative
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                {prog.description}
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#5A6F64' }}>
                {prog.shortDesc}
              </p>
            </Card>

            {/* Core Objectives Checklist */}
            {prog.objectives?.length > 0 && (
              <Card variant="lightgreen" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem' }}>
                  🎯 Core Objectives & Verified Milestones
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {prog.objectives.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
                      <CheckCircle size={20} color="var(--brand-dark-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {prog.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {prog.tags.map((tag, i) => (
                  <Badge key={i} variant="white" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Funding Progress & Sticky Action Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Funding Progress Card */}
            <Card style={{ padding: '1.75rem', border: 'var(--border-thick)' }}>
              <Badge variant="green" size="sm" style={{ marginBottom: '0.75rem' }}>
                FUNDRAISING PROGRESS
              </Badge>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2rem', color: 'var(--brand-dark-green)', marginBottom: '0.25rem' }}>
                {formatCurrency(prog.fundsRaised)}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5A6F64', marginBottom: '1rem' }}>
                pledged of {formatCurrency(prog.budget)} goal ({prog.progress}%)
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: '14px',
                  backgroundColor: '#E2ECE6',
                  border: '2px solid #000',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${prog.progress}%`,
                    backgroundColor: 'var(--accent-yellow)',
                    borderRight: '2px solid #000'
                  }}
                />
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/donation" style={{ textDecoration: 'none' }}>
                  <Button variant="yellow" size="lg" fullWidth icon={Heart}>
                    Sponsor This Program (80G Tax-Exempt)
                  </Button>
                </Link>
                <Link to="/volunteer" style={{ textDecoration: 'none' }}>
                  <Button variant="green" size="md" fullWidth icon={Users}>
                    Join as Ground Volunteer
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 3 Impact Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <Card variant="yellow" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Direct Beneficiaries Helped
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginTop: '2px' }}>
                  {formatNumber(prog.actualBeneficiaries)} / {formatNumber(prog.targetBeneficiaries)}
                </div>
              </Card>

              <Card variant="lightgreen" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Volunteers Enrolled
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginTop: '2px' }}>
                  {prog.volunteersEnrolled} of {prog.volunteersNeeded} slots filled
                </div>
              </Card>

              <Card style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Verified Field Impact Score
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand-dark-green)', marginTop: '2px' }}>
                  98.2% (Audited)
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
