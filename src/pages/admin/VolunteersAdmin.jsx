import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Input, Select, Textarea } from '../../components/common/Input';
import { formatNumber, formatDate } from '../../utils/formatters';
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
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Power
} from 'lucide-react';

export default function VolunteersAdmin() {
  const {
    volunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    toggleVolunteerStatus,
    programs,
    addToast
  } = useApp();

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('hours'); // 'hours' | 'name' | 'date'

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewProfileModal, setViewProfileModal] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    skills: '',
    interests: '',
    availability: 'Weekends (8 hrs/week)',
    status: 'Active',
    hoursLogged: 0,
    emergencyContact: '',
    notes: ''
  });

  const cities = ['All', ...Array.from(new Set(volunteers.map((v) => v.city)))];

  const filteredVolunteers = volunteers
    .filter((vol) => {
      const matchesSearch =
        vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vol.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCity = cityFilter === 'All' || vol.city === cityFilter;
      const matchesStatus = statusFilter === 'All' || vol.status === statusFilter;

      return matchesSearch && matchesCity && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'hours') return (b.hoursLogged || 0) - (a.hoursLogged || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0);
    });

  const handleOpenCreate = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      skills: 'Teaching, STEM Mentoring',
      interests: 'Education',
      availability: 'Weekends (8 hrs/week)',
      status: 'Active',
      hoursLogged: 0,
      emergencyContact: '',
      notes: ''
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (vol) => {
    setFormData({
      id: vol.id,
      name: vol.name,
      email: vol.email,
      phone: vol.phone,
      city: vol.city,
      skills: Array.isArray(vol.skills) ? vol.skills.join(', ') : vol.skills,
      interests: Array.isArray(vol.interests) ? vol.interests.join(', ') : vol.interests,
      availability: vol.availability,
      status: vol.status,
      hoursLogged: vol.hoursLogged,
      emergencyContact: vol.emergencyContact || '',
      notes: vol.notes || ''
    });
    setEditModalOpen(true);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Name and Email are required', 'error');
      return;
    }
    addVolunteer({
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean)
    });
    setCreateModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateVolunteer(formData.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
      availability: formData.availability,
      status: formData.status,
      hoursLogged: Number(formData.hoursLogged),
      emergencyContact: formData.emergencyContact,
      notes: formData.notes
    });
    setEditModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Email,Phone,City,Status,HoursLogged,Skills']
        .concat(
          volunteers.map(
            (v) =>
              `"${v.id}","${v.name}","${v.email}","${v.phone}","${v.city}","${v.status}","${v.hoursLogged}","${(v.skills || []).join(';')}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `impact_bridge_volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Volunteer roster exported to CSV successfully!', 'success');
  };

  return (
    <div className="volunteers-admin" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER & ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Volunteer Management ({volunteers.length})
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Manage volunteer profiles, track field hours, and assign ground tasks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="white" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <Card style={{ padding: '1.25rem', backgroundColor: 'var(--white)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <Input
            placeholder="Search by name, email, or skill..."
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
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active Status' },
              { value: 'On-Leave', label: 'On-Leave Status' }
            ]}
            style={{ marginBottom: 0 }}
          />

          <Select
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'hours', label: 'Sort by: Hours Logged' },
              { value: 'name', label: 'Sort by: Name (A-Z)' },
              { value: 'date', label: 'Sort by: Join Date' }
            ]}
            style={{ marginBottom: 0 }}
          />
        </div>
      </Card>

      {/* 3. VOLUNTEERS TABLE */}
      <div className="nb-table-container">
        <table className="nb-table">
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>City / Location</th>
              <th>Skills & Roles</th>
              <th>Hours Logged</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No volunteers found matching your query.
                </td>
              </tr>
            ) : (
              filteredVolunteers.map((vol) => (
                <tr key={vol.id}>
                  {/* Name & Avatar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={vol.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={vol.name}
                        style={{ width: '36px', height: '36px', borderRadius: '4px', border: '1.5px solid #000', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                          {vol.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#5A6F64' }}>
                          {vol.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* City */}
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>📍 {vol.city}</span>
                  </td>

                  {/* Skills */}
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '240px' }}>
                      {(vol.skills || []).slice(0, 2).map((s, idx) => (
                        <Badge key={idx} variant="white" size="sm">
                          {s}
                        </Badge>
                      ))}
                      {(vol.skills || []).length > 2 && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64' }}>
                          +{vol.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Hours */}
                  <td>
                    <div style={{ fontWeight: 900, fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--brand-dark-green)' }}>
                      {formatNumber(vol.hoursLogged)} hrs
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <button
                      onClick={() => toggleVolunteerStatus(vol.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      title="Click to toggle status"
                    >
                      <Badge variant={vol.status === 'Active' ? 'green' : 'red'} size="sm">
                        {vol.status}
                      </Badge>
                    </button>
                  </td>

                  {/* Joined Date */}
                  <td style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5A6F64' }}>
                    {formatDate(vol.joinedDate)}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setViewProfileModal(vol)}
                        className="nb-btn nb-btn-lightgreen nb-btn-sm"
                        style={{ padding: '4px 6px' }}
                        title="View Profile"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(vol)}
                        className="nb-btn nb-btn-yellow nb-btn-sm"
                        style={{ padding: '4px 6px' }}
                        title="Edit Record"
                      >
                        <Edit2 size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(vol.id)}
                        className="nb-btn nb-btn-danger nb-btn-sm"
                        style={{ padding: '4px 6px' }}
                        title="Delete Volunteer"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. ADD VOLUNTEER MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Volunteer"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSaveCreate}>Save Volunteer</Button>
          </>
        }
      >
        <form onSubmit={handleSaveCreate}>
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

          <Input
            label="Emergency Contact"
            placeholder="Name & Contact"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          />

          <Textarea
            label="Volunteer Notes & Field Experience"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* 5. EDIT VOLUNTEER MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Volunteer: ${formData.name}`}
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSaveEdit}>Update Record</Button>
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
              required
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
              label="Hours Logged"
              type="number"
              value={formData.hoursLogged}
              onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })}
            />
          </div>

          <Input
            label="Emergency Contact"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          />

          <Textarea
            label="Supervisor Notes"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* 6. VIEW PROFILE DRAWER MODAL */}
      {viewProfileModal && (
        <Modal
          isOpen={!!viewProfileModal}
          onClose={() => setViewProfileModal(null)}
          title={`Volunteer Profile: ${viewProfileModal.name}`}
          maxWidth="640px"
          footer={
            <Button variant="yellow" onClick={() => setViewProfileModal(null)}>
              Close Profile
            </Button>
          }
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #E2ECE6', paddingBottom: '1.25rem' }}>
            <img
              src={viewProfileModal.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={viewProfileModal.name}
              style={{ width: '70px', height: '70px', borderRadius: '6px', border: '2.5px solid #000', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>{viewProfileModal.name}</h3>
                <Badge variant={viewProfileModal.status === 'Active' ? 'green' : 'red'} size="sm">{viewProfileModal.status}</Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#5A6F64', fontWeight: 600 }}>
                ID: {viewProfileModal.id} • Joined: {formatDate(viewProfileModal.joinedDate)}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64' }}>HOURS LOGGED</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: 'var(--brand-dark-green)' }}>
                {viewProfileModal.hoursLogged} hrs
              </p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFF3BF', border: '1.5px solid #000', borderRadius: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64' }}>CITY / REGION</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900 }}>
                {viewProfileModal.city}
              </p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', border: '1.5px solid #000', borderRadius: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5A6F64' }}>BADGES</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900 }}>
                {(viewProfileModal.badges || []).length} Badges
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
              Contact Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
              <div>✉️ Email: {viewProfileModal.email}</div>
              <div>📞 Phone: {viewProfileModal.phone}</div>
              <div>🚨 Emergency Contact: {viewProfileModal.emergencyContact || 'None on file'}</div>
            </div>
          </div>

          {/* Skills & Badges */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
              Skills & Expertise
            </h4>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(viewProfileModal.skills || []).map((s, idx) => (
                <Badge key={idx} variant="white" size="sm">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Supervisor Notes */}
          {viewProfileModal.notes && (
            <div>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.4rem' }}>
                Field Notes
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#3A4E44', backgroundColor: '#FAFCFA', padding: '0.65rem', border: '1.5px solid #E2ECE6', borderRadius: '4px' }}>
                {viewProfileModal.notes}
              </p>
            </div>
          )}
        </Modal>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteVolunteer(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Volunteer Record"
        message="Are you sure you want to remove this volunteer from the NGO database? Their logged hours will be unlinked."
      />
    </div>
  );
}
