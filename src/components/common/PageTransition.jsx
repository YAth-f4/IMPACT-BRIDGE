import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition — Subtle, high-performance page transition wrapper
 * 
 * Provides:
 * - 220ms ease-out cubic-bezier transition
 * - translateY(6px) -> translateY(0)
 * - opacity 0 -> 1
 * - Keyed by pathname to retrigger cleanly on navigation
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div
      key={displayLocation.pathname}
      className={`page-transition-wrapper ${transitionStage === 'fadeIn' ? 'page-fade-in' : 'page-fade-out'}`}
      style={{
        width: '100%',
        minHeight: '100%'
      }}
    >
      {children}
    </div>
  );
}
