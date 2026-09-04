import React from 'react';
import { useApp } from '../../context/AppContext';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Heart,
  CheckCircle,
  Share2,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function ProgramDetailsModal() {
  const { selectedProgramModal, setSelectedProgramModal, navigateTo, addToast } = useApp();

  if (!selectedProgramModal) return null;

  const prog = selectedProgramModal;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Program link copied to clipboard!', 'info');
  };

  return (
    <Modal
      isOpen={!!selectedProgramModal}
      onClose={() => setSelectedProgramModal(null)}
      title={prog.title}
      maxWidth="720px"
      footer={
        <>
          <Button variant="white" onClick={() => setSelectedProgramModal(null)}>
            Close
          </Button>
          <Button
            variant="green"
            icon={Users}
            onClick={() => {
              setSelectedProgramModal(null);
              navigateTo('volunteer');
            }}
          >
            Volunteer for This
          </Button>
          <Button
            variant="yellow"
            icon={Heart}
            onClick={() => {
              setSelectedProgramModal(null);
              navigateTo('donate');
            }}
          >
            Sponsor Program
          </Button>
        </>
      }
    >
      {/* Program Banner Image */}
      {prog.image && (
        <div
          style={{
            width: '100%',
            height: '240px',
            border: '2px solid #000',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            position: 'relative'
          }}
        >
          <img
            src={prog.image}
            alt={prog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
            <Badge variant="yellow">{prog.category}</Badge>
            <Badge variant="green">{prog.status}</Badge>
          </div>
        </div>
      )}

      {/* Meta Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#5A6F64'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={16} color="var(--brand-dark-green)" /> {prog.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={16} color="var(--brand-dark-green)" /> {prog.startDate} to {prog.endDate}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={16} color="var(--brand-dark-green)" /> Lead: {prog.lead}
        </span>
      </div>

      {/* Funding Progress Bar */}
      <div
        style={{
          backgroundColor: '#F0F7F2',
          border: '2px solid #000',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 800 }}>
          <span>Funds Raised: {formatCurrency(prog.fundsRaised)}</span>
          <span>Goal: {formatCurrency(prog.budget)} ({prog.progress}%)</span>
        </div>
        <div
          style={{
            height: '14px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #000',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${prog.progress}%`,
              backgroundColor: 'var(--accent-yellow)',
              borderRight: '2px solid #000',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* 2 Stats Highlight Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Beneficiaries</span>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900 }}>
            {formatNumber(prog.actualBeneficiaries)} / {formatNumber(prog.targetBeneficiaries)}
          </p>
        </div>
        <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Volunteers Enrolled</span>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900 }}>
            {prog.volunteersEnrolled} / {prog.volunteersNeeded}
          </p>
        </div>
        <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Impact Score</span>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--brand-dark-green)' }}>
            96%
          </p>
        </div>
      </div>

      {/* Full Description */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.4rem' }}>
          About This Initiative
        </h4>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-dark)' }}>
          {prog.description}
        </p>
      </div>

      {/* Key Objectives */}
      {prog.objectives?.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>
            Core Objectives & Milestones
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {prog.objectives.map((obj, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                <CheckCircle size={16} color="var(--brand-dark-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {prog.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {prog.tags.map((tag, i) => (
            <Badge key={i} variant="white" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </Modal>
  );
}
