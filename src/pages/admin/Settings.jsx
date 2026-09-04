import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import { Input, Select, Textarea } from '../../components/common/Input';
import {
  Settings as SettingsIcon,
  Building2,
  User,
  Bell,
  Database,
  ShieldCheck,
  RefreshCw,
  Download,
  Save
} from 'lucide-react';

export default function Settings() {
  const { ngoProfile, setNgoProfile, resetToMockData, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('organization');
  const [profileForm, setProfileForm] = useState({ ...ngoProfile });

  const [notifications, setNotifications] = useState({
    newDonation: true,
    volunteerSignup: true,
    floodAlert: true,
    monthlyDigest: false
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setNgoProfile(profileForm);
    addToast('NGO Organization profile updated successfully!', 'success');
  };

  const handleExportBackup = () => {
    const backupData = {
      profile: ngoProfile,
      timestamp: new Date().toISOString()
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `impact_bridge_full_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Full JSON system backup generated & downloaded!', 'success');
  };

  return (
    <div className="admin-settings" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            System Settings & Legal Configuration
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Manage statutory tax registrations, administrative permissions, and backup states.
          </p>
        </div>
      </div>

      {/* 2. TABS NAVIGATOR */}
      <Tabs
        tabs={[
          { id: 'organization', label: '1. NGO Legal Entity', icon: Building2 },
          { id: 'staff', label: '2. Admin Team & Roles', icon: User },
          { id: 'notifications', label: '3. Alert Preferences', icon: Bell },
          { id: 'data', label: '4. Data & Backups', icon: Database }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: ORGANIZATION LEGAL PROFILE */}
      {activeTab === 'organization' && (
        <Card style={{ padding: '2rem', border: 'var(--border-thick)', backgroundColor: 'var(--white)' }}>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #E2ECE6', paddingBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                  Statutory Registrations & Trust Info
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#5A6F64' }}>
                  These values are printed on all generated 80G tax exemption receipts.
                </p>
              </div>
              <Button type="submit" variant="yellow" icon={Save}>
                Save Changes
              </Button>
            </div>

            <div className="grid-2">
              <Input
                label="NGO Legal Trust Name"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
              <Input
                label="Official Tagline"
                value={profileForm.tagline}
                onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              />
            </div>

            <div className="grid-3">
              <Input
                label="Trust Registration #"
                value={profileForm.registrationNumber}
                onChange={(e) => setProfileForm({ ...profileForm, registrationNumber: e.target.value })}
              />
              <Input
                label="NITI Aayog Darpan ID"
                value={profileForm.darpanId}
                onChange={(e) => setProfileForm({ ...profileForm, darpanId: e.target.value })}
              />
              <Input
                label="PAN Card Number"
                value={profileForm.panNumber}
                onChange={(e) => setProfileForm({ ...profileForm, panNumber: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <Input
                label="80G Registration Order Number"
                value={profileForm.tax80GNumber}
                onChange={(e) => setProfileForm({ ...profileForm, tax80GNumber: e.target.value })}
              />
              <Input
                label="FCRA Ministry Registration Number"
                value={profileForm.fcraRegistration}
                onChange={(e) => setProfileForm({ ...profileForm, fcraRegistration: e.target.value })}
              />
            </div>

            <Input
              label="Registered HQ Physical Address"
              value={profileForm.hqAddress}
              onChange={(e) => setProfileForm({ ...profileForm, hqAddress: e.target.value })}
            />

            <div className="grid-2">
              <Input
                label="Official Contact Email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
              <Input
                label="Direct Helpline Phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: STAFF & ROLES */}
      {activeTab === 'staff' && (
        <Card style={{ padding: '2rem', border: 'var(--border-thick)', backgroundColor: 'var(--white)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem' }}>
            Administrative Access & Trustee Permissions
          </h4>

          <div className="nb-table-container">
            <table className="nb-table">
              <thead>
                <tr>
                  <th>Admin User</th>
                  <th>Designation</th>
                  <th>Permission Level</th>
                  <th>Status</th>
                  <th>2FA Security</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sunita Rao', email: 'sunita.rao@impactbridge.org', role: 'Executive Director', access: 'Super Admin (Full Access)', status: 'Active' },
                  { name: 'Prof. Devendra Joshi', email: 'devendra.j@impactbridge.org', role: 'Trustee / Strategy', access: 'Auditor & Approver', status: 'Active' },
                  { name: 'Dr. Ananya Iyer', email: 'ananya.iyer@impactbridge.org', role: 'Director of Education', access: 'Programs & Volunteers', status: 'Active' },
                  { name: 'Vikramjit Singh', email: 'vikram.singh@impactbridge.org', role: 'Relief Logistics Lead', access: 'Field Ops & Radar', status: 'Active' }
                ].map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 800 }}>{u.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#5A6F64' }}>{u.email}</div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.role}</td>
                    <td><Badge variant="yellow" size="sm">{u.access}</Badge></td>
                    <td><Badge variant="green" size="sm">{u.status}</Badge></td>
                    <td><Badge variant="white" size="sm">✓ Hardware Key Active</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <Card style={{ padding: '2rem', border: 'var(--border-thick)', backgroundColor: 'var(--white)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            Notification Triggers & Dispatch Rules
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            {[
              { id: 'newDonation', label: 'Instant alert on new online donation (> ₹5,000)', desc: 'Sends immediate Telegram and Email notification to treasury lead.' },
              { id: 'volunteerSignup', label: 'New volunteer registration in active district', desc: 'Notifies the respective regional volunteer coordinator.' },
              { id: 'floodAlert', label: 'Emergency disaster response trigger', desc: 'Broadcasts high-priority alert on admin topbar and sends field SMS.' },
              { id: 'monthlyDigest', label: 'Monthly consolidated impact report PDF', desc: 'Automatically dispatches audited PDF report to Trustees.' }
            ].map((pref) => (
              <label
                key={pref.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#F7FAF8',
                  border: '1.5px solid #000',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={notifications[pref.id]}
                  onChange={(e) => {
                    setNotifications({ ...notifications, [pref.id]: e.target.checked });
                    addToast('Preference updated!', 'info');
                  }}
                  style={{ width: '18px', height: '18px', marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{pref.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#5A6F64', marginTop: '2px' }}>{pref.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: DATA & BACKUP */}
      {activeTab === 'data' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="hero-grid">
          <style>{`
            @media (max-width: 800px) {
              .hero-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          <Card style={{ padding: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Full System Backup
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#5A6F64', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Export a complete JSON archive of all active programs, volunteer rosters, donations ledger, and configuration.
            </p>
            <Button variant="yellow" icon={Download} onClick={handleExportBackup}>
              Export JSON Backup File
            </Button>
          </Card>

          <Card variant="lightgreen" style={{ padding: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Reset Mock Data
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#26332D', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Restore all mock programs, beneficiaries, volunteers, and donations to the original demo baseline.
            </p>
            <Button variant="green" icon={RefreshCw} onClick={resetToMockData}>
              Restore Default Datasets
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
