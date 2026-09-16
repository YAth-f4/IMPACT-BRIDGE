import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import ChangemakerProfile from './pages/ChangemakerProfile';
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';
import Volunteer from './pages/Volunteer';
import Donation from './pages/Donation';
import ImpactMap from './pages/ImpactMap';
import Contact from './pages/Contact';
import BeneficiaryPortal from './pages/BeneficiaryPortal';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminBeneficiaries from './pages/admin/Beneficiaries';
import AdminDonations from './pages/admin/Donations';
import AdminPrograms from './pages/admin/Programs';
import AdminImpactMap from './pages/admin/ImpactMap';
import AdminReports from './pages/admin/Reports';
import AdminMessages from './pages/admin/Messages';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/changemakers/:slug" element={<ChangemakerProfile />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/impact-map" element={<ImpactMap />} />
          <Route path="/beneficiary" element={<BeneficiaryPortal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/404" element={<NotFound />} />
        </Route>

        {/* ADMIN PORTAL ROUTES (PROTECTED) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="beneficiaries" element={<AdminBeneficiaries />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="impact-map" element={<AdminImpactMap />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* CATCH-ALL 404 ROUTE */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
