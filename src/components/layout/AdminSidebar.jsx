import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  CreditCard,
  CalendarCheck,
  MapPin,
  BarChart3,
  Mail,
  Settings,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminSidebar({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) {
  const { messages } = useApp();

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/volunteers', label: 'Volunteers', icon: Users },
    { path: '/admin/beneficiaries', label: 'Beneficiaries', icon: HeartHandshake },
    { path: '/admin/donations', label: 'Donations', icon: CreditCard },
    { path: '/admin/programs', label: 'Programs', icon: CalendarCheck },
    { path: '/admin/impact-map', label: 'Impact Map', icon: MapPin },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { path: '/admin/messages', label: 'Messages', icon: Mail, count: unreadMessagesCount },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 950
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: isCollapsed ? '80px' : '260px',
          backgroundColor: 'var(--brand-dark-green)',
          borderRight: 'var(--border-thick)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.2s ease, transform 0.2s ease',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 960,
          flexShrink: 0
        }}
        className={`admin-sidebar ${mobileOpen ? 'admin-sidebar-mobile-open' : ''}`}
      >
        <style>{`
          @media (max-width: 1024px) {
            .admin-sidebar {
              position: fixed !important;
              left: -280px;
              top: 0;
              bottom: 0;
              width: 260px !important;
            }
            .admin-sidebar-mobile-open {
              left: 0 !important;
              transform: translateX(0);
            }
          }
        `}</style>

        {/* Top: Logo & Collapse Toggle */}
        <div>
          <div
            style={{
              padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem',
              borderBottom: '2px solid #1E553D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              gap: '0.5rem'
            }}
          >
            {!isCollapsed ? (
              <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                <BrandLogo size="sm" isDark={true} />
              </Link>
            ) : (
              <Link
                to="/admin/dashboard"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--accent-yellow)',
                  border: '2px solid #000',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  color: '#000'
                }}
              >
                IB
              </Link>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'var(--brand-light-green)',
                border: '1.5px solid #000',
                borderRadius: '4px',
                padding: '4px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="lg-flex"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} strokeWidth={2.5} /> : <ChevronLeft size={16} strokeWidth={2.5} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav
            style={{
              padding: '1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 180px)'
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (mobileOpen) setMobileOpen(false);
                  }}
                  title={isCollapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    width: '100%',
                    padding: isCollapsed ? '0.75rem 0' : '0.65rem 0.9rem',
                    backgroundColor: isActive ? 'var(--accent-yellow)' : 'transparent',
                    color: isActive ? 'var(--black)' : '#FFFFFF',
                    border: isActive ? '2px solid #000000' : '2px solid transparent',
                    borderRadius: '4px',
                    boxShadow: isActive ? '3px 3px 0px #000000' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    gap: '0.75rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    transition: 'all 0.1s ease',
                    boxSizing: 'border-box'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} strokeWidth={2.5} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.count > 0 && (
                    <span
                      style={{
                        backgroundColor: 'var(--danger-red)',
                        color: '#FFFFFF',
                        border: '1px solid #000',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 900
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Public Website */}
        <div
          style={{
            padding: isCollapsed ? '0.75rem 0.4rem' : '1rem',
            borderTop: '2px solid #1E553D',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <Link
            to="/home"
            style={{
              width: '100%',
              padding: '0.55rem',
              backgroundColor: 'var(--brand-light-green)',
              color: 'var(--black)',
              border: '2px solid #000000',
              borderRadius: '4px',
              boxShadow: '2px 2px 0px #000000',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
            title="Switch to Public Website"
          >
            <Globe size={16} strokeWidth={2.5} />
            {!isCollapsed && <span>Public Website</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
