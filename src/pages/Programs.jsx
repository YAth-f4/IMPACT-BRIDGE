import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import ProgramCard from '../components/common/ProgramCard';
import { Input, Select } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Filter,
  Check
} from 'lucide-react';

export default function Programs() {
  const { programs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categoryDropdownRef = useRef(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCategoryDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      <section className="nb-container" style={{ position: 'relative', zIndex: 30 }}>
        <Card
          hover={false}
          style={{
            padding: 'clamp(1rem, 2.5vw, 1.5rem)',
            backgroundColor: 'var(--white)',
            border: 'var(--border-thick)',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: categoryDropdownOpen ? 60 : 20,
            overflow: 'visible'
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

          {/* Category Filter Dropdown Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              borderTop: '2px solid #E2ECE6',
              paddingTop: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#5A6F64',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Filter size={15} strokeWidth={2.5} /> Filter by Category:
              </span>

              {/* Neo-brutalist Category Selector Dropdown Box */}
              <div ref={categoryDropdownRef} style={{ position: 'relative', zIndex: 70 }}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={categoryDropdownOpen}
                  aria-label="Filter programs by category"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.45rem 1rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    backgroundColor: selectedCategory === 'All' ? '#FFFFFF' : 'var(--brand-dark-green)',
                    color: selectedCategory === 'All' ? 'var(--text-dark)' : '#FFFFFF',
                    border: '2px solid #000000',
                    borderRadius: '4px',
                    boxShadow: '3px 3px 0px #000000',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    userSelect: 'none'
                  }}
                >
                  <span>
                    {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                  </span>
                  <span
                    style={{
                      backgroundColor: selectedCategory === 'All' ? 'var(--accent-yellow)' : '#FFFFFF',
                      color: '#000000',
                      padding: '1px 7px',
                      borderRadius: '3px',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      border: '1px solid #000'
                    }}
                  >
                    {selectedCategory === 'All'
                      ? programs.length
                      : programs.filter((p) => p.category === selectedCategory).length}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={3}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: categoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>

                {/* Dropdown Menu Popover */}
                {categoryDropdownOpen && (
                  <div
                    role="listbox"
                    aria-label="Category options"
                    className="animate-dropdown"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      zIndex: 1000,
                      width: 'max-content',
                      minWidth: '260px',
                      maxWidth: 'calc(100vw - 2.5rem)',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #000000',
                      boxShadow: '5px 5px 0px #000000',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      transformOrigin: 'top left'
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        backgroundColor: '#F0F7F2',
                        borderBottom: '1.5px solid #000',
                        color: '#5A6F64',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      Select Initiative Domain
                    </div>

                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        const count =
                          cat === 'All'
                            ? programs.length
                            : programs.filter((p) => p.category === cat).length;

                        return (
                          <button
                            key={cat}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCategoryDropdownOpen(false);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.6rem 0.9rem',
                              fontFamily: 'var(--font-heading)',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: '0.84rem',
                              backgroundColor: isSelected ? 'var(--accent-yellow)' : 'transparent',
                              color: '#000000',
                              border: 'none',
                              borderBottom: '1px solid #E2ECE6',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'background-color 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = '#F5FAF7';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {isSelected ? (
                                <Check size={16} strokeWidth={3} color="var(--brand-dark-green)" />
                              ) : (
                                <span style={{ width: '16px', display: 'inline-block' }} />
                              )}
                              <span>{cat === 'All' ? 'All Categories' : cat}</span>
                            </div>

                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                backgroundColor: isSelected ? '#FFFFFF' : '#E2ECE6',
                                padding: '1px 6px',
                                borderRadius: '3px',
                                border: '1px solid #000'
                              }}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Clear Filter Link if a category filter is active */}
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--brand-dark-green)',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Clear Category Filter ({selectedCategory}) ×
              </button>
            )}
          </div>
        </Card>

        {/* 3. PROGRAM LISTINGS */}
        {filteredPrograms.length === 0 ? (
          <EmptyState
            title="No matching programs found"
            description="Try clearing your search query or selecting another category filter."
            onReset={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLocation('All');
              setActiveStatusTab('All');
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid-3">
            {filteredPrograms.map((prog) => (
              <ProgramCard key={prog.id} prog={prog} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredPrograms.map((prog) => (
              <ProgramCard key={prog.id} prog={prog} viewMode="list" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
