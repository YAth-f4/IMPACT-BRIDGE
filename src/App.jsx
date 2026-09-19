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
import FindHelp from './pages/FindHelp';
import BeneficiaryPortal from './pages/BeneficiaryPortal';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Role-Specific Dashboards
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import BeneficiaryDashboard from './pages/beneficiary/BeneficiaryDashboard';

// NGO Feature Pages
import NgoDirectory from './pages/public/NgoDirectory';
import NgoProfile from './pages/public/NgoProfile';
import RegisterNgo from './pages/public/RegisterNgo';
import MyNgoSubmissions from './pages/ngo/MyNgoSubmissions';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminFindHelp from './pages/admin/AdminFindHelp';
import AdminFundRaise from './pages/admin/AdminFundRaise';
import AdminVolunteerRequests from './pages/admin/AdminVolunteerRequests';
import AdminNgoRegistrations from './pages/admin/AdminNgoRegistrations';
import AdminUsers from './pages/admin/AdminUsers';
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
          <Route path="/find-help" element={<FindHelp />} />
          <Route path="/beneficiary" element={<FindHelp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngos" element={<NgoDirectory />} />
          <Route path="/ngos/:id" element={<NgoProfile />} />
          <Route path="/register-ngo" element={<RegisterNgo />} />
          <Route
            path="/my-ngos"
            element={
              <ProtectedRoute>
                <MyNgoSubmissions />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/404" element={<NotFound />} />

          {/* VOLUNTEER ROLE PROTECTED ROUTES */}
          <Route
            path="/volunteer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          {/* DONOR ROLE PROTECTED ROUTES */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          {/* BENEFICIARY ROLE PROTECTED ROUTES */}
          <Route
            path="/beneficiary/dashboard"
            element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <BeneficiaryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary/requests"
            element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <BeneficiaryDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ADMIN PORTAL ROUTES (STRICTLY ADMIN ONLY) */}
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
          <Route path="requests/find-help" element={<AdminFindHelp />} />
          <Route path="requests/fund-raise" element={<AdminFundRaise />} />
          <Route path="requests/volunteers" element={<AdminVolunteerRequests />} />
          <Route path="ngo-registrations" element={<AdminNgoRegistrations />} />
          <Route path="users" element={<AdminUsers />} />
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
