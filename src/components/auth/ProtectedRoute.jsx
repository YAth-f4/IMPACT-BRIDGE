import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BridgeLoader from '../common/BridgeLoader';
import Card from '../common/Card';
import Button from '../common/Button';
import { ShieldAlert, Lock, LogIn, UserPlus, Home, LayoutDashboard, LogOut } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser, isAuthenticated, isAuthLoading, logoutUser } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-offwhite)'
        }}
      >
        <BridgeLoader size="lg" label="Verifying secure credentials & permissions..." />
      </div>
    );
  }

  // 1. GUEST FLOW: If not authenticated, show explicit "Sign In Required" UI
  if (!isAuthenticated || !currentUser) {
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          backgroundColor: '#F7FAF8'
        }}
      >
        <Card
          style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            border: 'var(--border-thick)',
            boxShadow: '8px 8px 0px #000000',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#FFF4E5',
              border: '2.5px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '3px 3px 0px #000000'
            }}
          >
            <Lock size={36} color="#B45309" strokeWidth={2.5} />
          </div>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: isAdminRoute ? 'var(--danger-red)' : 'var(--accent-yellow)',
              color: '#000000',
              border: '2px solid #000000',
              borderRadius: '4px',
              padding: '0.2rem 0.65rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              boxShadow: '2px 2px 0px #000'
            }}
          >
            {isAdminRoute ? 'Unauthorized (401)' : 'Sign In Required'}
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#000000',
              marginBottom: '0.75rem'
            }}
          >
            {isAdminRoute ? 'Administrator Authentication Required' : 'Please sign in to continue.'}
          </h2>

          <p
            style={{
              color: '#4B5563',
              fontSize: '0.95rem',
              lineHeight: 1.55,
              marginBottom: '1.75rem'
            }}
          >
            {isAdminRoute
              ? 'This administration dashboard is restricted to authorized platform administrators. Please sign in with your administrator credentials.'
              : 'You are currently browsing as a Guest. This area is reserved for authenticated members of Impact Bridge.'}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              justifyContent: 'center'
            }}
          >
            <Link
              to="/login"
              state={{ from: location.pathname }}
              style={{ textDecoration: 'none' }}
            >
              <Button variant="yellow" size="md" icon={LogIn} style={{ width: '100%' }}>
                Sign In to Continue
              </Button>
            </Link>

            {!isAdminRoute && (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="lightgreen" size="md" icon={UserPlus} style={{ width: '100%' }}>
                  Create an Account
                </Button>
              </Link>
            )}

            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="sm" icon={Home} style={{ width: '100%' }}>
                Return to Public Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // 2. ROLE MISMATCH FLOW: If authenticated user does not possess required role, show 403 Forbidden
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const roleDashboards = {
      admin: { path: '/admin/dashboard', label: 'Admin Dashboard' },
      volunteer: { path: '/volunteer/dashboard', label: 'Volunteer Dashboard' },
      donor: { path: '/donor/dashboard', label: 'Donor Dashboard' },
      beneficiary: { path: '/beneficiary/dashboard', label: 'Beneficiary Hub' }
    };

    const myDashboard = roleDashboards[currentUser.role] || { path: '/home', label: 'Home' };

    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          backgroundColor: '#F7FAF8'
        }}
      >
        <Card
          style={{
            maxWidth: '540px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            border: 'var(--border-thick)',
            boxShadow: '8px 8px 0px #000000',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#FFEAEA',
              border: '2.5px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '3px 3px 0px #000000'
            }}
          >
            <ShieldAlert size={38} color="#D9383A" strokeWidth={2.5} />
          </div>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--danger-red)',
              color: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '4px',
              padding: '0.2rem 0.65rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              boxShadow: '2px 2px 0px #000'
            }}
          >
            403 Forbidden
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#000000',
              marginBottom: '0.75rem'
            }}
          >
            Access Restricted
          </h2>

          <p
            style={{
              color: '#4B5563',
              fontSize: '0.95rem',
              lineHeight: 1.55,
              marginBottom: '1.5rem'
            }}
          >
            You are authenticated as <strong>{currentUser.name}</strong> with the{' '}
            <span
              style={{
                backgroundColor: 'var(--brand-light-green)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1.5px solid #000',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '0.8rem'
              }}
            >
              {currentUser.role}
            </span>{' '}
            role. This section requires <strong>{allowedRoles.join(' or ').toUpperCase()}</strong> privileges.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              justifyContent: 'center'
            }}
          >
            <Link to={myDashboard.path} style={{ textDecoration: 'none' }}>
              <Button variant="yellow" size="md" icon={LayoutDashboard} style={{ width: '100%' }}>
                Go to My {myDashboard.label}
              </Button>
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <Link to="/home" style={{ textDecoration: 'none' }}>
                <Button variant="white" size="sm" icon={Home} style={{ width: '100%' }}>
                  Public Home
                </Button>
              </Link>

              <Button
                variant="white"
                size="sm"
                icon={LogOut}
                onClick={logoutUser}
                style={{ width: '100%' }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return children ? children : null;
}
