import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import { Input, Select } from '../../components/common/Input';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  LayoutGrid,
  List,
  Heart,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function ProgramsPage() {
  const { programs, setSelectedProgramModal, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = [
    'All',
    'Education',
    'Healthcare',
    'Food & Nutrition',
    'Community Development',
    'Women & Child Empowerment',
    'Emergency Support'
  ];

  const locations = ['All', ...Array.from(new Set(programs.map((p) => p.city)))];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || p.city === selectedLocation;
    const matchesStatus = activeStatusTab === 'All' || p.status === activeStatusTab;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  return (
    <div className="programs-page" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* 1. HEADER HERO */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">FIELD PROGRAMS & INITIATIVES</Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              marginTop: '0.75rem',
              marginBottom: '1rem',
              lineHeight: 1.1
            }}
          >
            Empowering Communities Through Direct Action
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#3A4E44',
              maxWidth: '820px',
              lineHeight: 1.6
            }}
          >
            Discover our portfolio of verified grassroots projects across education, maternal health, nutrition security, and emergency disaster relief.
          </p>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="nb-container">
        <Card
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--white)',
            border: 'var(--border-thick)',
            marginBottom: '2rem'
          }}
        >
          {/* Top Row: Search, Location, View Mode */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Input
              placeholder="Search programs, locations, tags..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 0 }}
            />

            <Select
              label=""
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={locations.map((loc) => ({ value: loc, label: `Location: ${loc}` }))}
              style={{ marginBottom: 0 }}
            />

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`nb-btn ${viewMode === 'grid' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
                title="Grid View"
              >
                <LayoutGrid size={16} strokeWidth={2.5} />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`nb-btn ${viewMode === 'list' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
                title="List View"
              >
                <List size={16} strokeWidth={2.5} />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div style={{ borderTop: '2px solid #E2ECE6', paddingTop: '1rem', marginBottom: '1rem' }}>
            <Tabs
              tabs={[
                { id: 'All', label: 'All Programs', count: programs.length },
                { id: 'Ongoing', label: 'Ongoing', count: programs.filter((p) => p.status === 'Ongoing').length },
                { id: 'Upcoming', label: 'Upcoming', count: programs.filter((p) => p.status === 'Upcoming').length },
                { id: 'Completed', label: 'Completed', count: programs.filter((p) => p.status === 'Completed').length }
              ]}
              activeTab={activeStatusTab}
              onChange={setActiveStatusTab}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    border: '2px solid #000000',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'var(--brand-dark-green)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#26332D',
                    boxShadow: isSelected ? '2.5px 2.5px 0px #000' : '1.5px 1.5px 0px #000',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Card>

        {/* 3. PROGRAM LISTINGS */}
        {filteredPrograms.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No matching programs found</h3>
            <p style={{ color: '#5A6F64', marginBottom: '1.5rem' }}>Try clearing or adjusting your search filters.</p>
            <Button
              variant="yellow"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLocation('All');
                setActiveStatusTab('All');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid-3">
            {filteredPrograms.map((prog) => (
              <Card
                key={prog.id}
                hover={true}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '0',
                  overflow: 'hidden'
                }}
              >
                {/* Image */}
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

                {/* Body */}
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

                  <div>
                    {/* Progress */}
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
                        👥 {formatNumber(prog.actualBeneficiaries)} Beneficiaries
                      </span>
                      <Button
                        variant="yellow"
                        size="sm"
                        onClick={() => setSelectedProgramModal(prog)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View Mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredPrograms.map((prog) => (
              <Card
                key={prog.id}
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
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '0.4rem' }}>
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

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span>👥 {formatNumber(prog.actualBeneficiaries)} Beneficiaries</span>
                    <span>🤝 {prog.volunteersEnrolled} Volunteers</span>
                    <span>💰 {formatCurrency(prog.fundsRaised)} / {formatCurrency(prog.budget)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Button
                    variant="yellow"
                    size="sm"
                    onClick={() => setSelectedProgramModal(prog)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="green"
                    size="sm"
                    onClick={() => navigateTo('volunteer')}
                  >
                    Volunteer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
