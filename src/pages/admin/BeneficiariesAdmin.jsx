import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Input, Select, Textarea } from '../../components/common/Input';
import { formatDate } from '../../utils/formatters';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Filter,
  CheckCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function BeneficiariesAdmin() {
  const {
    beneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    programs,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    gender: 'Female',
    location: '',
    city: 'Mumbai',
    category: 'Education',
    supportType: '',
    assignedProgram: 'PRG-101',
    status: 'Active Support',
    familyIncome: '',
    impactSummary: ''
  });

  const categories = [
    'All',
    'Education',
    'Food & Nutrition',
    'Healthcare',
    'Women & Child Empowerment',
    'Community Development'
  ];

  const filteredBeneficiaries = beneficiaries.filter((ben) => {
    const matchesSearch =
      ben.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ben.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ben.supportType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || ben.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || ben.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      id: '',
      name: '',
      age: '14 yrs',
      gender: 'Female',
      location: 'Dharavi, Mumbai',
      city: 'Mumbai',
      category: 'Education',
      supportType: 'Full STEM Scholarship & Tablet',
      assignedProgram: 'PRG-101',
      status: 'Active Support',
      familyIncome: '₹8,000 / month',
      impactSummary: 'Enrolled in daily guided digital labs.'
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (ben) => {
    setFormData({
      id: ben.id,
      name: ben.name,
      age: ben.age,
      gender: ben.gender,
      location: ben.location,
      city: ben.city || 'Mumbai',
      category: ben.category,
      supportType: ben.supportType,
      assignedProgram: ben.assignedProgram,
      status: ben.status,
      familyIncome: ben.familyIncome || '',
      impactSummary: ben.impactSummary || ''
    });
    setEditModalOpen(true);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Beneficiary Name is required', 'error');
      return;
    }
    addBeneficiary(formData);
    setCreateModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateBeneficiary(formData.id, formData);
    setEditModalOpen(false);
  };

  return (
    <div className="beneficiaries-admin" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Beneficiary Management ({beneficiaries.length} Verified Records)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Audit ground assistance records, verification status, and graduation trajectories.
          </p>
        </div>

        <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Add Beneficiary
        </Button>
      </div>

      {/* 2. SEARCH & FILTERS */}
      <Card style={{ padding: '1.25rem', backgroundColor: 'var(--white)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <Input
            placeholder="Search by name, location, or aid type..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Select
            label=""
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map((c) => ({ value: c, label: `Category: ${c}` }))}
            style={{ marginBottom: 0 }}
          />

          <Select
            label=""
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active Support', label: 'Active Support' },
              { value: 'Graduated / Self-Sufficient', label: 'Graduated / Self-Sufficient' },
              { value: 'Completed Support', label: 'Completed Support' }
            ]}
            style={{ marginBottom: 0 }}
          />
        </div>
      </Card>

      {/* 3. BENEFICIARIES TABLE */}
      <div className="nb-table-container">
        <table className="nb-table">
          <thead>
            <tr>
              <th>Beneficiary Name / Family</th>
              <th>Demographics</th>
              <th>Category</th>
              <th>Assistance Received</th>
              <th>Location</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No beneficiary records found matching filters.
                </td>
              </tr>
            ) : (
              filteredBeneficiaries.map((ben) => (
                <tr key={ben.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                        {ben.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#5A6F64' }}>
                        ID: {ben.id} {ben.verified && '• Verified Field Record'}
                      </div>
                    </div>
                  </td>

                  <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {ben.age} • {ben.gender}
                  </td>

                  <td>
                    <Badge variant={ben.category === 'Education' ? 'yellow' : ben.category === 'Healthcare' ? 'green' : 'blue'} size="sm">
                      {ben.category}
                    </Badge>
                  </td>

                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {ben.supportType}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    📍 {ben.location}
                  </td>

                  <td>
                    <Badge variant={ben.status.includes('Active') ? 'green' : 'white'} size="sm">
                      {ben.status}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setViewDetailsModal(ben)}
                        className="nb-btn nb-btn-lightgreen nb-btn-sm"
                        style={{ padding: '4px 6px' }}
                        title="View Support History Timeline"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(ben)}
                        className="nb-btn nb-btn-yellow nb-btn-sm"
                        style={{ padding: '4px 6px' }}
                        title="Edit Record"
                      >
                        <Edit2 size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(ben.id)}
                        className="nb-btn nb-btn-danger nb-btn-sm"
                        style={{ padding: '4px 6px' }}
                        title="Delete Record"
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

      {/* 4. ADD BENEFICIARY MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Enroll New Beneficiary"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSaveCreate}>Save Record</Button>
          </>
        }
      >
        <form onSubmit={handleSaveCreate}>
          <div className="grid-2">
            <Input
              label="Beneficiary / Family Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Age / Family Unit"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
                { value: 'All', label: 'Family / All' }
              ]}
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Education', label: 'Education' },
                { value: 'Food & Nutrition', label: 'Food & Nutrition' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Women & Child Empowerment', label: 'Women Empowerment' },
                { value: 'Community Development', label: 'Community Development' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Ground Settlement / Address"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Household Income / Status"
              value={formData.familyIncome}
              onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })}
            />
          </div>

          <Input
            label="Assistance & Support Package"
            required
            value={formData.supportType}
            onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
          />

          <Textarea
            label="Impact Summary & Verification Notes"
            rows={2}
            value={formData.impactSummary}
            onChange={(e) => setFormData({ ...formData, impactSummary: e.target.value })}
          />
        </form>
      </Modal>

      {/* 5. EDIT BENEFICIARY MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Beneficiary: ${formData.name}`}
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
              label="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active Support', label: 'Active Support' },
                { value: 'Graduated / Self-Sufficient', label: 'Graduated / Self-Sufficient' },
                { value: 'Completed Support', label: 'Completed Support' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Household Income"
              value={formData.familyIncome}
              onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })}
            />
          </div>

          <Input
            label="Assistance Received"
            value={formData.supportType}
            onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
          />

          <Textarea
            label="Impact Summary"
            rows={2}
            value={formData.impactSummary}
            onChange={(e) => setFormData({ ...formData, impactSummary: e.target.value })}
          />
        </form>
      </Modal>

      {/* 6. DETAILS & HISTORY TIMELINE MODAL */}
      {viewDetailsModal && (
        <Modal
          isOpen={!!viewDetailsModal}
          onClose={() => setViewDetailsModal(null)}
          title={`Beneficiary Dossier: ${viewDetailsModal.name}`}
          maxWidth="640px"
          footer={
            <Button variant="yellow" onClick={() => setViewDetailsModal(null)}>
              Close Dossier
            </Button>
          }
        >
          <div style={{ padding: '0.85rem', backgroundColor: '#F0F7F2', border: '2px solid #000', borderRadius: '4px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>{viewDetailsModal.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 600 }}>
                  📍 {viewDetailsModal.location} • Demographics: {viewDetailsModal.age} ({viewDetailsModal.gender})
                </div>
              </div>
              <Badge variant="green">{viewDetailsModal.status}</Badge>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.35rem' }}>
              Assistance Package
            </h4>
            <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              {viewDetailsModal.supportType}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#5A6F64', marginTop: '2px' }}>
              Household Income Baseline: {viewDetailsModal.familyIncome || 'Unrecorded'}
            </p>
          </div>

          {/* Support History Timeline */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.75rem' }}>
              Support History & Field Milestones
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(viewDetailsModal.timeline || [
                { date: viewDetailsModal.registeredDate, title: 'Enrolled in Support Program', note: viewDetailsModal.supportType }
              ]).map((t, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)', flexShrink: 0 }}>
                    {formatDate(t.date)}
                  </div>
                  <div style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: '#FAFCFA', border: '1.5px solid #000', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{t.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#5A6F64' }}>{t.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* 7. DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteBeneficiary(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Beneficiary Record"
        message="Are you sure you want to delete this beneficiary record? All linked support milestones will be archived."
      />
    </div>
  );
}
