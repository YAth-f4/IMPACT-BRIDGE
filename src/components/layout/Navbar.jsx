import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import Button from '../common/Button';
import Mascot from '../common/Mascot';
import { Heart, Menu, X, Shield, User, MapPin, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const { userRole, switchRole, currentUser, isAuthenticated, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close role dropdown on click outside or Escape
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setRoleDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (!e.target.closest('#role-dropdown-container')) {
        setRoleDropdownOpen(false);
      }
    };
    if (roleDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [roleDropdownOpen]);

  const getNavLinks = () => {
    switch (userRole) {
      case 'beneficiary':
        return [
          { path: '/beneficiary', label: 'Beneficiary Hub', icon: '🤝' },
          { path: '/home', label: 'Home' },
          { path: '/programs', label: 'Programs' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/contact', label: 'Contact' }
        ];
      case 'volunteer':
        return [
          { path: '/volunteer', label: 'Volunteer Tasks', icon: '📋' },
          { path: '/home', label: 'Home' },
          { path: '/programs', label: 'Programs' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/contact', label: 'Contact' }
        ];
      case 'donor':
        return [
          { path: '/donation', label: 'Donate & 80G', icon: '❤️' },
          { path: '/home', label: 'Home' },
          { path: '/programs', label: 'Programs' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/about', label: 'About Us' }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Admin Dashboard', icon: '⚡' },
          { path: '/programs', label: 'Programs' },
          { path: '/volunteer', label: 'Volunteers' },
          { path: '/beneficiary', label: 'Beneficiaries' },
          { path: '/impact-map', label: 'Impact Map', isMap: true }
        ];
      default: // 'guest' / public
        return [
          { path: '/home', label: 'Home' },
          { path: '/about', label: 'About' },
          { path: '/programs', label: 'Programs' },
          { path: '/volunteer', label: 'Volunteer' },
          { path: '/donation', label: 'Donation' },
          { path: '/beneficiary', label: 'Find Help' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/contact', label: 'Contact' }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'var(--brand-dark-green)',
        borderBottom: 'var(--border-thick)',
        boxShadow: '0 4px 0 #000000',
        width: '100%'
      }}
    >
      <div
        className="nb-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.65rem',
          paddingBottom: '0.65rem'
        }}
      >
        {/* Brand Logo Link to /home */}
        <Link to="/home" style={{ textDecoration: 'none' }} aria-label="Impact Bridge Home">
          <BrandLogo size="md" isDark={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          className="lg-flex"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                background: isActive ? 'var(--accent-yellow)' : 'transparent',
                color: isActive ? 'var(--black)' : '#FFFFFF',
                border: isActive ? '2px solid #000000' : '2px solid transparent',
                borderRadius: '4px',
                boxShadow: isActive ? '2.5px 2.5px 0px #000000' : 'none',
                padding: '0.45rem 0.8rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.1s ease',
                textDecoration: 'none'
              })}
            >
              {link.isMap && <MapPin size={15} strokeWidth={2.5} />}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions & Controls */}
        <div className="lg-flex" style={{ display: 'none', alignItems: 'center', gap: '0.65rem' }}>
          {/* Quick Role Switcher Pill */}
          <div id="role-dropdown-container" style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="nb-btn nb-btn-lightgreen nb-btn-sm"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
              title="Switch demo user role"
              aria-label="Switch Demo User Role"
              aria-expanded={roleDropdownOpen}
            >
              <User size={13} strokeWidth={2.5} />
              <span>Role: <strong>{userRole.toUpperCase()}</strong></span>
            </button>

            {roleDropdownOpen && (
              <div
                className="animate-dropdown"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  backgroundColor: 'var(--white)',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  borderRadius: '6px',
                  width: '190px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#E2ECE6', borderBottom: '1.5px solid #000' }}>
                  SWITCH DEMO ROLE (5 ROLES)
                </div>
                {[
                  { id: 'guest', label: 'Public User', icon: '🌐', path: '/home' },
                  { id: 'beneficiary', label: 'Beneficiary', icon: '🤝', path: '/beneficiary' },
                  { id: 'volunteer', label: 'Volunteer', icon: '📋', path: '/volunteer' },
                  { id: 'donor', label: 'Donor', icon: '❤️', path: '/donation' },
                  { id: 'admin', label: 'Administrator', icon: '🛡️', path: '/admin/dashboard' }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setRoleDropdownOpen(false);
                      navigate(r.path);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: userRole === r.id ? 800 : 600,
                      backgroundColor: userRole === r.id ? 'var(--brand-light-green)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <span>{r.icon} {r.label}</span>
                    {userRole === r.id && <span style={{ color: 'var(--brand-dark-green)', fontWeight: 900 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Panel Link */}
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <Button
              variant="yellow"
              size="sm"
              icon={Shield}
              onClick={() => {
                if (userRole !== 'admin') switchRole('admin');
              }}
            >
              Admin
            </Button>
          </Link>

          {/* Authenticated Profile or Login Button */}
          {isAuthenticated && currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  backgroundColor: 'var(--brand-light-green)',
                  border: '2px solid #000',
                  borderRadius: '4px',
                  padding: '0.35rem 0.55rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#000000',
                  boxShadow: '2px 2px 0px #000000',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={`Signed in as ${currentUser.name} (${currentUser.role})`}
              >
                👤 {currentUser.name.split(' ')[0]}
              </span>
              <Button
                variant="white"
                size="sm"
                icon={LogOut}
                onClick={logoutUser}
                title="Sign Out"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="sm" icon={LogIn}>
                Login
              </Button>
            </Link>
          )}

          {/* Donate CTA Link */}
          <Link to="/donation" style={{ textDecoration: 'none' }}>
            <Button variant="yellow" size="sm" icon={Heart}>
              Donate
            </Button>
          </Link>
        </div>

        {/* Mobile Header Controls (Only Donate + Menu Hamburger to prevent overflow) */}
        <div className="lg-hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/donation" style={{ textDecoration: 'none' }}>
            <button
              className="nb-btn nb-btn-yellow nb-btn-sm"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
              aria-label="Donate Now"
            >
              <Heart size={14} strokeWidth={2.5} fill="#000" />
              <span>Donate</span>
            </button>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nb-btn nb-btn-lightgreen nb-btn-sm"
            style={{ padding: '6px 9px' }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 940,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Mobile Drawer Menu Panel */}
      {mobileMenuOpen && (
        <div
          className="lg-hidden"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--brand-dark-green)',
            borderBottom: 'var(--border-thick)',
            boxShadow: '0 8px 0 #000000',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            zIndex: 950,
            maxHeight: 'calc(100vh - 70px)',
            overflowY: 'auto'
          }}
        >
          {/* Mascot Greeting inside Mobile Drawer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#246348',
              border: '2px solid #000',
              borderRadius: '6px',
              padding: '0.65rem 0.85rem'
            }}
          >
            <Mascot variant="waving" size={38} animate={true} />
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'var(--font-heading)' }}>
                Welcome to Impact Bridge
              </div>
              <div style={{ color: 'var(--brand-light-green)', fontSize: '0.72rem', fontWeight: 600 }}>
                Connecting People. Creating Impact.
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  width: '100%',
                  padding: '0.65rem 1rem',
                  backgroundColor: isActive ? 'var(--accent-yellow)' : '#246348',
                  color: isActive ? 'var(--black)' : '#FFFFFF',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  boxShadow: isActive ? '3px 3px 0px #000' : 'none',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none'
                })}
              >
                {link.isMap && <MapPin size={16} strokeWidth={2.5} />}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Role Switcher */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000',
              borderRadius: '6px',
              padding: '0.75rem',
              boxShadow: '3px 3px 0px #000'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
              Switch Demo Role: (Active: <strong>{userRole.toUpperCase()}</strong>)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {[
                { id: 'guest', label: 'Public', path: '/home' },
                { id: 'beneficiary', label: 'Beneficiary', path: '/beneficiary' },
                { id: 'volunteer', label: 'Volunteer', path: '/volunteer' },
                { id: 'donor', label: 'Donor', path: '/donation' },
                { id: 'admin', label: 'Admin', path: '/admin/dashboard' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    switchRole(r.id);
                    setMobileMenuOpen(false);
                    navigate(r.path);
                  }}
                  style={{
                    padding: '0.45rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    border: '1.5px solid #000',
                    borderRadius: '4px',
                    backgroundColor: userRole === r.id ? 'var(--brand-dark-green)' : '#F7FAF8',
                    color: userRole === r.id ? '#FFFFFF' : '#000000',
                    cursor: 'pointer'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Bottom Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <Link
              to="/admin/dashboard"
              onClick={() => {
                setMobileMenuOpen(false);
                if (userRole !== 'admin') switchRole('admin');
              }}
              style={{ textDecoration: 'none' }}
            >
              <button className="nb-btn nb-btn-yellow nb-btn-sm" style={{ width: '100%' }}>
                <Shield size={14} strokeWidth={2.5} />
                <span>Admin</span>
              </button>
            </Link>

            {isAuthenticated && currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="nb-btn nb-btn-white nb-btn-sm"
                style={{ width: '100%' }}
              >
                <LogOut size={14} strokeWidth={2.5} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button className="nb-btn nb-btn-white nb-btn-sm" style={{ width: '100%' }}>
                  <LogIn size={14} strokeWidth={2.5} />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
