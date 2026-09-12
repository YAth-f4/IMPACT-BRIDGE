import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminTopbar from '../components/layout/AdminTopbar';
import ToastContainer from '../components/common/Toast';
import ScrollToTop from '../utils/ScrollToTop';
import PageTransition from '../components/common/PageTransition';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-offwhite)', overflowX: 'hidden' }}>
      <ScrollToTop />
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', overflowX: 'hidden' }}>
        <AdminTopbar setMobileOpen={setMobileSidebarOpen} />
        <main style={{ flex: 1, padding: 'clamp(0.75rem, 2vw, 1.5rem)', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
