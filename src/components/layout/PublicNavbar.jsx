import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Heart, Menu, X, Shield, User, MapPin, Sparkles } from 'lucide-react';

export default function PublicNavbar() {
  const { currentView, navigateTo, userRole, switchRole, setAuthModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Programs & Events' },
    { id: 'impact-map', label: 'Impact Map', isHighlighted: true },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'donate', label: 'Donate' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'var(--brand-dark-green)',
        borderBottom: 'var(--border-thick)',
        boxShadow: '0 4px 0 #000000'
      }}
    >
      <div
        className="nb-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => navigateTo('home')}
          style={{ cursor: 'pointer' }}
        >
          <BrandLogo size="md" isDark={true} />
        </div>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem'
          }}
          className="lg-flex"
        >
          <style>{`
            @media (min-width: 1024px) {
              .lg-flex { display: flex !important; }
              .lg-hidden { display: none !important; }
            }
          `}</style>

          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                style={{
                  background: isActive ? 'var(--accent-yellow)' : 'transparent',
                  color: isActive ? 'var(--black)' : '#FFFFFF',
                  border: isActive ? '2px solid #000000' : '2px solid transparent',
                  borderRadius: '4px',
                  boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
                  padding: '0.45rem 0.85rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.1s ease'
                }}
              >
                {link.id === 'impact-map' && <MapPin size={15} strokeWidth={2.5} />}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Role Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="nb-btn nb-btn-lightgreen nb-btn-sm"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              title="Switch demo user role"
            >
              <User size={14} strokeWidth={2.5} />
              <span>Role: <strong>{userRole.toUpperCase()}</strong></span>
            </button>

            {roleDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  backgroundColor: 'var(--white)',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  borderRadius: '6px',
                  width: '180px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#E2ECE6', borderBottom: '1.5px solid #000' }}>
                  SWITCH DEMO ROLE
                </div>
                {['guest', 'admin', 'volunteer', 'donor'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: userRole === r ? 800 : 600,
                      backgroundColor: userRole === r ? 'var(--brand-light-green)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{r.toUpperCase()}</span>
                    {userRole === r && <span style={{ color: 'var(--brand-dark-green)', fontWeight: 900 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Portal Jump button */}
          <Button
            variant="yellow"
            size="sm"
            icon={Shield}
            onClick={() => {
              if (userRole !== 'admin') switchRole('admin');
              navigateTo('admin-dashboard');
            }}
          >
            Admin Panel
          </Button>

          {/* Quick Donate CTA */}
          <Button
            variant="white"
            size="sm"
            icon={Heart}
            onClick={() => navigateTo('donate')}
          >
            Donate
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nb-btn nb-btn-yellow nb-btn-sm lg-hidden"
            style={{ padding: '6px 8px' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="lg-hidden"
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            borderTop: '2px solid #000000',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}
        >
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  navigateTo(link.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.65rem 1rem',
                  backgroundColor: isActive ? 'var(--accent-yellow)' : '#246348',
                  color: isActive ? 'var(--black)' : '#FFFFFF',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  boxShadow: isActive ? '3px 3px 0px #000' : 'none',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                {link.id === 'impact-map' && <MapPin size={16} strokeWidth={2.5} />}
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
