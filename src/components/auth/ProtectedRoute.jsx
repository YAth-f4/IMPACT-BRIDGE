import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BridgeLoader from '../common/BridgeLoader';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser, isAuthenticated, isAuthLoading, addToast } = useApp();
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
        <BridgeLoader size="lg" label="Verifying secure credentials..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: 'Please sign in to access this protected area.'
        }}
        replace
      />
    );
  }

  // If role is restricted and user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to permitted role dashboard
    const roleRedirects = {
      volunteer: '/volunteer',
      beneficiary: '/beneficiary',
      donor: '/donation',
      guest: '/home',
      admin: '/admin/dashboard'
    };

    const target = roleRedirects[currentUser.role] || '/home';
    return <Navigate to={target} state={{ unauthorized: true }} replace />;
  }

  return children ? children : null;
}
