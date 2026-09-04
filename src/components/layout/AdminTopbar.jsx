import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import {
  Bell,
  Search,
  Plus,
  User,
  Menu,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';

export default function AdminTopbar({ setMobileOpen }) {
  const { resetToMockData, addToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  // Derive title from pathname
  const viewTitles = {
    '/admin': 'Dashboard Overview',
    '/admin/dashboard': 'Dashboard Overview',
    '/admin/volunteers': 'Volunteer Management',
    '/admin/beneficiaries': 'Beneficiary Management',
    '/admin/donations': 'Donation Ledger & Analytics',
    '/admin/programs': 'Programs & Event Operations',
    '/admin/impact-map': 'Geographic Impact Map',
    '/admin/reports': 'Audited Reports & Analytics',
    '/admin/messages': 'Inquiries & Message Hub',
    '/admin/settings': 'NGO Configuration & Settings'
  };

  const currentTitle = viewTitles[location.pathname] || 'Admin Portal';

  // Mock Notifications
  const notifications = [
    { id: 'notif-1', text: 'New corporate donation of ₹5,00,000 received from TechVanguard CSR.', time: '10m ago', unread: true },
    { id: 'notif-2', text: 'Dr. Sameer Khan logged 12 field hours in Melghat tribal clinic.', time: '1h ago', unread: true },
    { id: 'notif-3', text: 'Brahmaputra Flood Resilience project reached 100% equipment target.', time: '3h ago', unread: false },
    { id: 'notif-4', text: 'New volunteer inquiry from Megha Sundaram (IIT Bombay).', time: 'Yesterday', unread: false }
  ];

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--white)',
        borderBottom: 'var(--border-thick)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 890,
        boxShadow: '0 2px 0 #000000'
      }}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMobileOpen(true)}
          className="nb-btn nb-btn-lightgreen nb-btn-sm lg-hidden"
          style={{ padding: '6px 8px' }}
          aria-label="Open sidebar menu"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
            <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>IMPACT BRIDGE</Link>
            <span>/</span>
            <Link to="/admin/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>ADMIN</Link>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-dark)' }}>
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right Controls: Quick Add, Reset, Notifications, Role Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quick Add Dropdown */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="yellow"
            size="sm"
            icon={Plus}
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
          >
            Quick Add
          </Button>

          {quickCreateOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                backgroundColor: 'var(--white)',
                border: '2px solid #000',
                boxShadow: '4px 4px 0px #000',
                borderRadius: '6px',
                width: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: 'var(--brand-light-green)', borderBottom: '1.5px solid #000' }}>
                CREATE NEW RECORD
              </div>
              {[
                { label: '+ Add Volunteer', path: '/admin/volunteers' },
                { label: '+ Add Beneficiary', path: '/admin/beneficiaries' },
                { label: '+ Create Program', path: '/admin/programs' },
                { label: '+ Record Donation', path: '/admin/donations' }
              ].map((act) => (
                <button
                  key={act.label}
                  onClick={() => {
                    navigate(act.path);
                    setQuickCreateOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#F0F7F2')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  {act.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="nb-btn nb-btn-white nb-btn-sm"
            style={{ padding: '0.45rem', position: 'relative' }}
            aria-label="View notifications"
          >
            <Bell size={18} strokeWidth={2.5} />
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--danger-red)',
                borderRadius: '50%',
                border: '1.5px solid #000'
              }}
            />
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                backgroundColor: 'var(--white)',
                border: '2px solid #000',
                boxShadow: '6px 6px 0px #000',
                borderRadius: '6px',
                width: '320px',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--brand-dark-green)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #000'
                }}
              >
                <span>SYSTEM ALERTS</span>
                <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--accent-yellow)', color: '#000', padding: '1px 6px', borderRadius: '3px' }}>
                  2 NEW
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid #E2ECE6',
                      backgroundColor: n.unread ? '#F4F9F6' : '#FFFFFF',
                      fontSize: '0.82rem',
                      lineHeight: 1.4
                    }}
                  >
                    <p style={{ fontWeight: n.unread ? 800 : 500, color: 'var(--text-dark)' }}>
                      {n.text}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: '#7A8E83', fontWeight: 600 }}>
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <Link to="/admin/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '4px 8px',
              backgroundColor: 'var(--brand-light-green)',
              border: '2px solid #000',
              borderRadius: '4px',
              boxShadow: '2px 2px 0px #000',
              cursor: 'pointer'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
              alt="Admin avatar"
              style={{ width: '28px', height: '28px', borderRadius: '3px', border: '1.5px solid #000', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.78rem' }}>
                Sunita Rao
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-dark-green)' }}>
                SUPER ADMIN
              </span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
