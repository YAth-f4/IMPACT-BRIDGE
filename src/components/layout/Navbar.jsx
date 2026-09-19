import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import Button from '../common/Button';
import { Heart, Menu, X, Shield, User, MapPin, LogIn, LogOut, UserPlus, LayoutDashboard, Building2, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { userRole, currentUser, isAuthenticated, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile menu on Escape
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'volunteer':
        return '/volunteer/dashboard';
      case 'donor':
        return '/donor/dashboard';
      case 'beneficiary':
        return '/beneficiary/dashboard';
      default:
        return '/home';
    }
  };

  const getNavLinks = () => {
    switch (userRole) {
      case 'beneficiary':
        return [
          { path: '/beneficiary/dashboard', label: 'My Hub', icon: '🤝' },
          { path: '/find-help', label: 'Find Help' },
          { path: '/programs', label: 'Programs' },
          { path: '/ngos', label: 'NGOs' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/contact', label: 'Contact' }
        ];
      case 'volunteer':
        return [
          { path: '/volunteer/dashboard', label: 'My Hub', icon: '🌱' },
          { path: '/programs', label: 'Opportunities' },
          { path: '/volunteer', label: 'Join Tasks' },
          { path: '/ngos', label: 'NGOs' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/about', label: 'About' }
        ];
      case 'donor':
        return [
          { path: '/donor/dashboard', label: 'My Hub', icon: '❤️' },
          { path: '/donation', label: 'Donate' },
          { path: '/programs', label: 'Campaigns' },
          { path: '/ngos', label: 'NGOs' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/about', label: 'About' }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: '⚡' },
          { path: '/admin/requests/find-help', label: 'Requests' },
          { path: '/admin/ngo-registrations', label: 'NGO Review' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/programs', label: 'Programs' },
          { path: '/admin/donations', label: 'Donations' },
          { path: '/admin/reports', label: 'Reports' }
        ];
      default: // 'guest' / unauthenticated public user
        return [
          { path: '/home', label: 'Home' },
          { path: '/about', label: 'About' },
          { path: '/programs', label: 'Programs' },
          { path: '/ngos', label: 'NGOs' },
          { path: '/find-help', label: 'Find Help' },
          { path: '/impact-map', label: 'Impact Map', isMap: true },
          { path: '/contact', label: 'Contact' }
        ];
    }
  };

  const navLinks = getNavLinks();
  const myDashboardPath = getDashboardPath();

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

        {/* Desktop Navigation Links (Generated from Authenticated Role) */}
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
          {/* Admin Portal Link (Visible strictly to authenticated Administrators) */}
          {userRole === 'admin' && (
            <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
              <Button
                variant="yellow"
                size="sm"
                icon={Shield}
              >
                Admin Hub
              </Button>
            </Link>
          )}

          {/* Authenticated User Badge & Logout or Public Login/Register */}
          {isAuthenticated && currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Link to={myDashboardPath} style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    backgroundColor: 'var(--brand-light-green)',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: '#000000',
                    boxShadow: '2.5px 2.5px 0px #000000',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                  title={`Signed in as ${currentUser.name} (${currentUser.role.toUpperCase()})`}
                >
                  <User size={13} strokeWidth={2.5} />
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000',
                      borderRadius: '3px',
                      padding: '1px 4px',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      textTransform: 'uppercase'
                    }}
                  >
                    {currentUser.role}
                  </span>
                </span>
              </Link>
              <Button
                variant="white"
                size="sm"
                icon={LogOut}
                onClick={logoutUser}
                title="Sign Out"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="white" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="lightgreen" size="sm" icon={UserPlus}>
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Register NGO CTA Link */}
          <Link to={isAuthenticated ? "/my-ngos" : "/register-ngo"} style={{ textDecoration: 'none' }}>
            <button
              className="nb-btn nb-btn-white nb-btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '0.38rem 0.65rem',
                border: '2px solid #000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#FFFFFF',
                boxShadow: '2px 2px 0px #000'
              }}
              title={isAuthenticated ? "View or submit NGO registrations" : "Register your non-profit organization"}
            >
              <Building2 size={13} strokeWidth={2.5} />
              <span>{isAuthenticated ? 'My NGOs' : 'Register NGO'}</span>
            </button>
          </Link>

          {/* Donate CTA Link */}
          <Link to="/donation" style={{ textDecoration: 'none' }}>
            <Button variant="yellow" size="sm" icon={Heart}>
              Donate
            </Button>
          </Link>
        </div>

        {/* Mobile Header Controls */}
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
            className="nb-btn nb-btn-white nb-btn-sm"
            style={{ padding: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="lg-hidden animate-slide-down"
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            borderTop: '2px solid #000000',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            maxHeight: 'calc(100vh - 65px)',
            overflowY: 'auto'
          }}
        >
          {/* User Status Card (Mobile) */}
          {isAuthenticated && currentUser ? (
            <div
              style={{
                backgroundColor: 'var(--brand-light-green)',
                border: '2px solid #000',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                boxShadow: '3px 3px 0px #000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#26332D' }}>
                  Verified Role: <strong>{currentUser.role}</strong>
                </div>
              </div>
              <Link
                to={myDashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button className="nb-btn nb-btn-yellow nb-btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </button>
              </Link>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000',
                borderRadius: '6px',
                padding: '0.75rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                boxShadow: '3px 3px 0px #000'
              }}
            >
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button className="nb-btn nb-btn-white nb-btn-sm" style={{ width: '100%' }}>
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button className="nb-btn nb-btn-lightgreen nb-btn-sm" style={{ width: '100%' }}>
                  <UserPlus size={14} />
                  <span>Register</span>
                </button>
              </Link>
            </div>
          )}

          {/* Navigation Links List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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

          {/* Mobile NGO Action Link */}
          <Link
            to={isAuthenticated ? "/my-ngos" : "/register-ngo"}
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none' }}
          >
            <button className="nb-btn nb-btn-lightgreen nb-btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Building2 size={14} />
              <span>{isAuthenticated ? 'My Registered NGOs' : 'Register Your NGO'}</span>
            </button>
          </Link>

          {/* Mobile Bottom Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: userRole === 'admin' ? '1fr 1fr' : '1fr', gap: '0.5rem' }}>
            {userRole === 'admin' && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button className="nb-btn nb-btn-yellow nb-btn-sm" style={{ width: '100%' }}>
                  <Shield size={14} strokeWidth={2.5} />
                  <span>Admin Panel</span>
                </button>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="nb-btn nb-btn-white nb-btn-sm"
                style={{ width: '100%' }}
              >
                <LogOut size={14} strokeWidth={2.5} />
                <span>Sign Out</span>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
