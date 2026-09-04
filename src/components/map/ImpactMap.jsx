import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Input, Select } from '../common/Input';
import StatCard from '../common/StatCard';
import {
  MapPin,
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users,
  HeartHandshake,
  Building2,
  Calendar,
  X,
  Phone,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function ImpactMap({ isStandalone = true }) {
  const { locations, programs, navigateTo, setSelectedProgramModal, addToast } = useApp();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeLocation, setActiveLocation] = useState(null);
  const [mapMode, setMapMode] = useState('interactive'); // 'interactive' (SVG/Canvas tactical) | 'satellite'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Compute distinct cities
  const cities = ['All', ...Array.from(new Set(locations.map((l) => l.city)))];

  // Filtered Locations
  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.programName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || loc.city === selectedCity;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && loc.status.includes('Active')) ||
      (selectedStatus === 'Completed' && loc.status.includes('Completed'));

    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  // Category Icon & Color Mapping
  const getCategoryMeta = (category) => {
    switch (category) {
      case 'NGO Center':
        return { color: '#2E7D5B', bg: '#A8D5BA', icon: Building2, label: 'NGO Center' };
      case 'Program':
        return { color: '#F4B942', bg: '#FFF3BF', icon: HeartHandshake, label: 'Active Program' };
      case 'Beneficiary Area':
        return { color: '#3A86FF', bg: '#CBE4FF', icon: Users, label: 'Beneficiary Area' };
      case 'Event':
        return { color: '#E63946', bg: '#FFCCD5', icon: Calendar, label: 'Community Event' };
      default:
        return { color: '#2E7D5B', bg: '#A8D5BA', icon: MapPin, label: 'Location' };
    }
  };

  // Convert GPS Coordinates to Relative SVG Canvas Coordinates (Bounded to India Geography box: Lat 8N-36N, Lon 68E-96E)
  const getCanvasCoords = (coordinates) => {
    const [lat, lng] = coordinates || [20, 78];
    const minLat = 7.5;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 97.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  return (
    <div className="impact-map-container" style={{ width: '100%' }}>
      {/* Top Summary KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Geo-Locations"
          value={formatNumber(locations.length)}
          subtitle="Hubs, Centers & Field Outposts"
          icon={MapPin}
          variant="lightgreen"
        />
        <StatCard
          title="Active Programs"
          value={formatNumber(programs.filter(p => p.status === 'Ongoing').length)}
          subtitle="Monitored in Real-Time"
          icon={Building2}
          variant="yellow"
        />
        <StatCard
          title="Communities Reached"
          value="45,200+"
          subtitle="Across 8 Indian States"
          icon={Users}
          variant="default"
          badgeText="Verified"
        />
        <StatCard
          title="Volunteers Deployed"
          value={formatNumber(locations.reduce((acc, l) => acc + (l.volunteers || 0), 0))}
          subtitle="Active on the Ground"
          icon={HeartHandshake}
          variant="green"
        />
      </div>

      {/* Control Filter Bar */}
      <Card
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--white)',
          border: 'var(--border-thick)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Top Row: Search + City + Status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Input
                placeholder="Search center, program, or city..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* City Filter */}
            <Select
              label=""
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              options={cities.map((c) => ({ value: c, label: `City: ${c}` }))}
              style={{ marginBottom: 0 }}
            />

            {/* Status Filter */}
            <Select
              label=""
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Active', label: 'Active Hubs' },
                { value: 'Completed', label: 'Completed Sites' }
              ]}
              style={{ marginBottom: 0 }}
            />
          </div>

          {/* Bottom Row: Category Filter Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap',
              borderTop: '2px solid #E2ECE6',
              paddingTop: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                Filter Category:
              </span>
              {['All', 'NGO Center', 'Program', 'Beneficiary Area', 'Event'].map((cat) => {
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
                      cursor: 'pointer',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Zoom & Reset Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="nb-btn nb-btn-white nb-btn-sm"
                title="Zoom in map"
              >
                <ZoomIn size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                className="nb-btn nb-btn-white nb-btn-sm"
                title="Zoom out map"
              >
                <ZoomOut size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setSelectedCategory('All');
                  setSelectedCity('All');
                  setSearchQuery('');
                }}
                className="nb-btn nb-btn-lightgreen nb-btn-sm"
              >
                Reset Map
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Interactive Map Canvas Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isStandalone ? '620px' : '480px',
          backgroundColor: '#D6E9DE',
          border: 'var(--border-thick)',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Tactical Grid / Landmass Graphic Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(#2E7D5B 1px, transparent 1px),
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px, 60px 60px, 60px 60px',
            opacity: 0.6
          }}
        />

        {/* Decorative Compass & Legend Widget */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'var(--white)',
            border: '2px solid #000',
            boxShadow: '3px 3px 0px #000',
            borderRadius: '6px',
            padding: '8px 12px',
            zIndex: 10,
            fontSize: '0.78rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-dark-green)' }}>
            <Layers size={16} strokeWidth={2.5} />
            <span>GEO-IMPACT SATELLITE RADAR</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5A6F64', marginTop: '2px' }}>
            Showing {filteredLocations.length} active hubs across India
          </div>
        </div>

        {/* Tactical Category Legend Pill on Map */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'var(--white)',
            border: '2px solid #000',
            boxShadow: '3px 3px 0px #000',
            borderRadius: '6px',
            padding: '8px 12px',
            zIndex: 10,
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { label: 'NGO Center', color: '#2E7D5B' },
            { label: 'Program', color: '#F4B942' },
            { label: 'Beneficiary Area', color: '#3A86FF' },
            { label: 'Event', color: '#E63946' }
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800 }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: item.color, border: '1.5px solid #000', borderRadius: '50%' }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Transformable Canvas Group */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Stylized India Geography Outline Silhouette (SVG) */}
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.25,
              pointerEvents: 'none'
            }}
          >
            {/* Abstract India Boundary Polygon */}
            <polygon
              points="300,100 450,140 600,200 650,280 850,300 950,380 880,480 750,450 650,550 580,720 500,880 420,750 350,600 220,480 180,320 280,220"
              fill="#2E7D5B"
              stroke="#000000"
              strokeWidth="6"
              strokeDasharray="12 6"
            />
          </svg>

          {/* Render Pin Markers */}
          {filteredLocations.map((loc) => {
            const coords = getCanvasCoords(loc.coordinates);
            const meta = getCategoryMeta(loc.category);
            const isSelected = activeLocation?.id === loc.id;
            const Icon = meta.icon;

            return (
              <div
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                style={{
                  position: 'absolute',
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: 'translate(-50%, -100%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 80 : 20,
                  transition: 'transform 0.15s ease'
                }}
              >
                {/* Neo-Brutalist Marker Pin Button */}
                <div
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-yellow)' : meta.color,
                    color: isSelected ? '#000000' : '#FFFFFF',
                    border: '2.5px solid #000000',
                    boxShadow: isSelected ? '4px 4px 0px #000' : '2.5px 2.5px 0px #000',
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  title={`${loc.name} (${loc.city})`}
                >
                  <div style={{ transform: 'rotate(45deg)' }}>
                    <Icon size={18} strokeWidth={2.8} />
                  </div>
                </div>

                {/* City Tag Label */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1.5px solid #000',
                    borderRadius: '3px',
                    padding: '1px 5px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    marginTop: '4px',
                    boxShadow: '1.5px 1.5px 0px #000',
                    textAlign: 'center'
                  }}
                >
                  {loc.city}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Marker Info Popup on Map */}
        {activeLocation && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              maxWidth: '360px',
              width: 'calc(100% - 40px)',
              backgroundColor: 'var(--white)',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: '8px',
              zIndex: 90,
              padding: '1.25rem',
              animation: 'scaleUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header with Close */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <Badge variant="yellow" size="sm">
                  {activeLocation.category}
                </Badge>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginTop: '0.35rem' }}>
                  {activeLocation.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 600 }}>
                  📍 {activeLocation.address}
                </p>
              </div>

              <button
                onClick={() => setActiveLocation(null)}
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #000',
                  borderRadius: '4px',
                  padding: '4px',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px #000'
                }}
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Program Name & Lead */}
            <div
              style={{
                backgroundColor: 'var(--brand-light-green)',
                border: '1.5px solid #000',
                borderRadius: '4px',
                padding: '0.65rem 0.85rem',
                marginBottom: '0.85rem',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>
                PROJECT: {activeLocation.programName}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#26332D', marginTop: '2px' }}>
                Lead: {activeLocation.lead} • {activeLocation.phone}
              </div>
            </div>

            {/* Beneficiaries & Volunteers Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Beneficiaries</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900 }}>
                  {formatNumber(activeLocation.beneficiaries)}
                </p>
              </div>
              <div style={{ padding: '0.5rem', backgroundColor: '#FFF3BF', border: '1.5px solid #000', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Volunteers</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900 }}>
                  {formatNumber(activeLocation.volunteers)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/donation" style={{ flex: 1, textDecoration: 'none' }}>
                <Button
                  variant="yellow"
                  size="sm"
                  fullWidth
                  icon={Heart}
                >
                  Sponsor Hub
                </Button>
              </Link>
              <Link to="/volunteer" style={{ flex: 1, textDecoration: 'none' }}>
                <Button
                  variant="green"
                  size="sm"
                  fullWidth
                  icon={Users}
                >
                  Volunteer
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hub Cards Explorer List */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            All Ground Centers & Service Areas ({filteredLocations.length})
          </h3>
        </div>

        <div className="grid-3">
          {filteredLocations.map((loc) => {
            const meta = getCategoryMeta(loc.category);
            const Icon = meta.icon;

            return (
              <Card
                key={loc.id}
                hover={true}
                onClick={() => {
                  setActiveLocation(loc);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Badge variant={loc.category === 'NGO Center' ? 'green' : loc.category === 'Program' ? 'yellow' : 'blue'} size="sm">
                      {loc.category}
                    </Badge>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5A6F64' }}>
                      {loc.state}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                    {loc.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#5A6F64', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    📍 {loc.address}
                  </p>

                  <div
                    style={{
                      padding: '0.45rem 0.65rem',
                      backgroundColor: '#F0F7F2',
                      border: '1.5px solid #000',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--brand-dark-green)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {loc.programName}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1.5px solid #E2ECE6',
                    paddingTop: '0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  <span>👥 {formatNumber(loc.beneficiaries)} Supported</span>
                  <span style={{ color: 'var(--brand-dark-green)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Inspect <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
