import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import { Input, Select, Textarea } from '../../components/common/Input';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  RefreshCw,
  X
} from 'lucide-react';

export default function Volunteers() {
  const {
    volunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    toggleVolunteerStatus,
    addToast,
    fetchAdminVolunteers,
    updateAdminVolunteerStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'applications'
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [appModalOpen, setAppModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Selected Volunteer States
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    skills: '',
    interests: '',
    availability: 'Weekends (6 hrs/week)',
    emergencyContact: '',
    status: 'Active',
    hoursLogged: 0
  });

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await fetchAdminVolunteers();
      if (res && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const res = await updateAdminVolunteerStatus(appId, newStatus);
      if (res && res.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        if (newStatus === 'APPROVED') {
          const app = applications.find((a) => a.id === appId);
          if (app) {
            addVolunteer({
              name: app.name,
              email: app.email,
              phone: app.phone,
              city: app.city,
              skills: Array.isArray(app.skills) ? app.skills : [app.skills],
              interests: Array.isArray(app.interests) ? app.interests : [app.interests],
              availability: app.availability || 'Weekends',
              emergencyContact: app.emergencyContact || '',
              status: 'Active',
              hoursLogged: 0
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cities = ['All', ...Array.from(new Set(volunteers.map((v) => v.city)))];

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.skills && v.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCity = cityFilter === 'All' || v.city === cityFilter;
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      skills: 'Teaching, STEM',
      interests: 'Education',
      availability: 'Weekends (6 hrs/week)',
      emergencyContact: '+91 98200 00000',
      status: 'Active',
      hoursLogged: 0
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (vol) => {
    setSelectedVolunteer(vol);
    setFormData({
      name: vol.name,
      email: vol.email,
      phone: vol.phone,
      city: vol.city,
      skills: Array.isArray(vol.skills) ? vol.skills.join(', ') : vol.skills || '',
      interests: Array.isArray(vol.interests) ? vol.interests.join(', ') : vol.interests || '',
      availability: vol.availability || 'Weekends',
      emergencyContact: vol.emergencyContact || '',
      status: vol.status,
      hoursLogged: vol.hoursLogged || 0
    });
    setEditModalOpen(true);
  };

  const handleOpenProfile = (vol) => {
    setSelectedVolunteer(vol);
    setProfileModalOpen(true);
  };

  const handleOpenDelete = (vol) => {
    setSelectedVolunteer(vol);
    setDeleteModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addVolunteer({
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()),
      interests: formData.interests.split(',').map((s) => s.trim()),
      hoursLogged: Number(formData.hoursLogged)
    });
    setAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedVolunteer) return;

    updateVolunteer(selectedVolunteer.id, {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()),
      interests: formData.interests.split(',').map((s) => s.trim()),
      hoursLogged: Number(formData.hoursLogged)
    });
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedVolunteer) {
      deleteVolunteer(selectedVolunteer.id);
      setDeleteModalOpen(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Phone,City,Status,Hours,Joined Date\n'];
    const rows = filteredVolunteers.map(
      (v) => `"${v.id}","${v.name}","${v.email}","${v.phone}","${v.city}","${v.status}",${v.hoursLogged},"${v.joinedDate}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast('Volunteer roster exported to CSV file!', 'info');
  };

  return (
    <div className="admin-volunteers" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER & ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Volunteer Operations Hub ({volunteers.length} Active • {applications.filter((a) => a.status === 'PENDING').length} Pending Review)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Manage active field volunteer deployments and screen incoming community applications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="white" size="sm" icon={RefreshCw} onClick={loadApplications}>
            Refresh
          </Button>
          <Button variant="white" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('roster')}
          className={`nb-btn ${activeTab === 'roster' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
        >
          <Users size={16} strokeWidth={2.5} />
          <span>Active Roster ({volunteers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`nb-btn ${activeTab === 'applications' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
        >
          <Clock size={16} strokeWidth={2.5} />
          <span>Review Applications ({applications.length})</span>
          {applications.filter((a) => a.status === 'PENDING').length > 0 && (
            <Badge variant="green" size="sm" style={{ marginLeft: '4px' }}>
              {applications.filter((a) => a.status === 'PENDING').length}
            </Badge>
          )}
        </button>
      </div>

      {activeTab === 'roster' ? (
        <>
          {/* 2. FILTER TOOLBAR */}
          <Card style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                placeholder="Search by name, skill, email..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 0 }}
              />

              <Select
                label=""
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                options={cities.map((c) => ({ value: c, label: `City: ${c}` }))}
                style={{ marginBottom: 0 }}
              />

              <Select
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'Status: All Statuses' },
                  { value: 'Active', label: 'Status: Active Only' },
                  { value: 'On-Leave', label: 'Status: On-Leave' }
                ]}
                style={{ marginBottom: 0 }}
              />
            </div>
          </Card>

          {/* 3. DATA TABLE */}
          <Card style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--white)' }}>
            <div className="nb-table-container">
              <table className="nb-table">
                <thead>
                  <tr>
                    <th>Volunteer</th>
                    <th>Location</th>
                    <th>Skills</th>
                    <th>Hours Logged</th>
                    <th>Status</th>
                    <th>Joined Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5A6F64' }}>
                        No volunteer records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredVolunteers.map((vol) => (
                      <tr key={vol.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={vol.avatar}
                              alt={vol.name}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                              }}
                              style={{ width: '36px', height: '36px', borderRadius: '4px', border: '1.5px solid #000', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{vol.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>{vol.email}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{vol.city}</span>
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
                            {vol.skills?.slice(0, 2).map((s, idx) => (
                              <Badge key={idx} variant="white" size="sm">{s}</Badge>
                            ))}
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 900, color: 'var(--brand-dark-green)', fontSize: '0.95rem' }}>
                            {vol.hoursLogged} hrs
                          </span>
                        </td>

                        <td>
                          <button
                            onClick={() => toggleVolunteerStatus(vol.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            title="Click to toggle status"
                          >
                            <Badge variant={vol.status === 'Active' ? 'green' : 'yellow'} size="sm">
                              {vol.status === 'Active' ? '● Active' : '○ On-Leave'}
                            </Badge>
                          </button>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>
                            {formatDate(vol.joinedDate)}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleOpenProfile(vol)}
                              className="nb-btn nb-btn-lightgreen nb-btn-sm"
                              style={{ padding: '5px' }}
                              title="View Volunteer Dossier"
                              aria-label={`View dossier for ${vol.name}`}
                            >
                              <Eye size={15} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(vol)}
                              className="nb-btn nb-btn-white nb-btn-sm"
                              style={{ padding: '5px' }}
                              title="Edit Volunteer"
                              aria-label={`Edit ${vol.name}`}
                            >
                              <Edit2 size={15} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(vol)}
                              className="nb-btn nb-btn-danger nb-btn-sm"
                              style={{ padding: '5px' }}
                              title="Delete Volunteer"
                              aria-label={`Delete ${vol.name}`}
                            >
                              <Trash2 size={15} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        /* APPLICATIONS TABLE */
        <Card style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--white)' }}>
          <div className="nb-table-container">
            <table className="nb-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>City</th>
                  <th>Skills / Interests</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Review Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingApps ? (
                  <>
                    <SkeletonTableRow columns={7} />
                    <SkeletonTableRow columns={7} />
                    <SkeletonTableRow columns={7} />
                    <SkeletonTableRow columns={7} />
                  </>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5A6F64' }}>
                      No volunteer applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{app.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>{app.email} • {app.phone}</div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{app.city}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '220px' }}>
                          {Array.isArray(app.skills) ? app.skills.map((s, idx) => (
                            <Badge key={idx} variant="white" size="sm">{s}</Badge>
                          )) : (
                            <Badge variant="white" size="sm">{app.skills}</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{app.availability}</span>
                      </td>
                      <td>
                        <Badge
                          variant={app.status === 'APPROVED' ? 'green' : app.status === 'REJECTED' ? 'red' : 'yellow'}
                          size="sm"
                        >
                          {app.status || 'PENDING'}
                        </Badge>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: '#5A6F64' }}>{formatDate(app.createdAt)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => { setSelectedApp(app); setAppModalOpen(true); }}
                            className="nb-btn nb-btn-lightgreen nb-btn-sm"
                            style={{ padding: '5px' }}
                            title="Inspect Dossier"
                          >
                            <Eye size={15} strokeWidth={2.5} />
                          </button>
                          {app.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'APPROVED')}
                              className="nb-btn nb-btn-green nb-btn-sm"
                              style={{ padding: '5px' }}
                              title="Approve Volunteer"
                              aria-label={`Approve application for ${app.name}`}
                            >
                              <CheckCircle size={15} strokeWidth={2.5} />
                            </button>
                          )}
                          {app.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'REJECTED')}
                              className="nb-btn nb-btn-danger nb-btn-sm"
                              style={{ padding: '5px' }}
                              title="Reject Application"
                              aria-label={`Reject application for ${app.name}`}
                            >
                              <XCircle size={15} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ADD VOLUNTEER MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Volunteer"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" icon={X} onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={Plus} onClick={handleSaveAdd}>Save Volunteer</Button>
          </>
        }
      >
        <form onSubmit={handleSaveAdd}>
          <div className="grid-2">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Select
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              options={[
                { value: 'Mumbai', label: 'Mumbai' },
                { value: 'New Delhi', label: 'New Delhi' },
                { value: 'Bengaluru', label: 'Bengaluru' },
                { value: 'Amravati', label: 'Amravati' },
                { value: 'Varanasi', label: 'Varanasi' },
                { value: 'Jaipur', label: 'Jaipur' },
                { value: 'Guwahati', label: 'Guwahati' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Skills (Comma separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
            <Input
              label="Initial Hours Logged"
              type="number"
              value={formData.hoursLogged}
              onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* EDIT VOLUNTEER MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit: ${selectedVolunteer?.name}`}
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" icon={X} onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={CheckCircle} onClick={handleSaveEdit}>Update Profile</Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div className="grid-2">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'On-Leave', label: 'On-Leave' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
            <Input
              label="Total Hours"
              type="number"
              value={formData.hoursLogged}
              onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* PROFILE DOSSIER DRAWER / MODAL */}
      {selectedVolunteer && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Volunteer Dossier: ${selectedVolunteer.name}`}
          maxWidth="640px"
          footer={
            <Button variant="yellow" onClick={() => setProfileModalOpen(false)}>
              Close Dossier
            </Button>
          }
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <img
              src={selectedVolunteer.avatar}
              alt={selectedVolunteer.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
              style={{ width: '70px', height: '70px', borderRadius: '6px', border: '2px solid #000', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <Badge variant={selectedVolunteer.status === 'Active' ? 'green' : 'yellow'} size="sm">
                  {selectedVolunteer.status}
                </Badge>
                <Badge variant="white" size="sm">ID: {selectedVolunteer.id}</Badge>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem' }}>
                {selectedVolunteer.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
                📍 {selectedVolunteer.city} • {selectedVolunteer.email} • {selectedVolunteer.phone}
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <Card variant="lightgreen" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                Certified Field Hours
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.8rem', color: 'var(--brand-dark-green)', marginTop: '2px' }}>
                {selectedVolunteer.hoursLogged} hrs
              </div>
            </Card>

            <Card variant="yellow" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                Assigned Programs
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.8rem', marginTop: '2px' }}>
                {selectedVolunteer.assignedPrograms?.length || 1} Active
              </div>
            </Card>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
              Specialized Skills
            </h4>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {selectedVolunteer.skills?.map((s, idx) => (
                <Badge key={idx} variant="white" size="sm">{s}</Badge>
              ))}
            </div>
          </div>

          {selectedVolunteer.badges?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
                Badges & Certifications
              </h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedVolunteer.badges.map((b, idx) => (
                  <Badge key={idx} variant="yellow" size="sm">⭐ {b}</Badge>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* APPLICATION DOSSIER MODAL */}
      {selectedApp && (
        <Modal
          isOpen={appModalOpen}
          onClose={() => setAppModalOpen(false)}
          title={`Volunteer Application: ${selectedApp.name}`}
          maxWidth="600px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button variant="white" onClick={() => setAppModalOpen(false)}>Close</Button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedApp.status !== 'REJECTED' && (
                  <Button
                    variant="danger"
                    icon={XCircle}
                    onClick={() => {
                      handleUpdateAppStatus(selectedApp.id, 'REJECTED');
                      setAppModalOpen(false);
                    }}
                  >
                    Reject
                  </Button>
                )}
                {selectedApp.status !== 'APPROVED' && (
                  <Button
                    variant="yellow"
                    icon={CheckCircle}
                    onClick={() => {
                      handleUpdateAppStatus(selectedApp.id, 'APPROVED');
                      setAppModalOpen(false);
                    }}
                  >
                    Approve Application
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #000', paddingBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>{selectedApp.name}</h4>
                <p style={{ margin: '2px 0 0', color: '#5A6F64', fontSize: '0.82rem' }}>
                  {selectedApp.email} • {selectedApp.phone}
                </p>
              </div>
              <Badge variant={selectedApp.status === 'APPROVED' ? 'green' : selectedApp.status === 'REJECTED' ? 'red' : 'yellow'}>
                {selectedApp.status || 'PENDING'}
              </Badge>
            </div>

            <div className="grid-2">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>CITY / LOCATION</span>
                <div style={{ fontWeight: 700 }}>{selectedApp.city || 'Not specified'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>AVAILABILITY</span>
                <div style={{ fontWeight: 700 }}>{selectedApp.availability || 'Weekends'}</div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>DECLARED SKILLS</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                {Array.isArray(selectedApp.skills) ? selectedApp.skills.map((s, idx) => (
                  <Badge key={idx} variant="yellow" size="sm">{s}</Badge>
                )) : <Badge variant="yellow" size="sm">{selectedApp.skills}</Badge>}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>EMERGENCY CONTACT</span>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{selectedApp.emergencyContact || 'None provided'}</div>
            </div>

            {selectedApp.adminNotes && (
              <div style={{ backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>ADMIN REVIEW NOTES</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{selectedApp.adminNotes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Volunteer Record"
        message={`Are you sure you want to delete ${selectedVolunteer?.name} from the active NGO database? This action cannot be undone.`}
        confirmText="Yes, Delete Record"
      />
    </div>
  );
}
