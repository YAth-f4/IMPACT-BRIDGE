import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ToastContainer from '../components/common/Toast';
import ScrollToTop from '../utils/ScrollToTop';
import PageTransition from '../components/common/PageTransition';
import GlobalLoadingScreen from '../components/common/GlobalLoadingScreen';

export default function PublicLayout() {
  return (
    <div className="public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <GlobalLoadingScreen />
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1, width: '100%', minHeight: '60vh', overflowX: 'hidden' }}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
