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
  CheckCircle2,
  Calendar,
  MapPin,
  Smile
} from 'lucide-react';

export default function Beneficiaries() {
  const {
    beneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: 12,
    gender: 'Female',
    location: 'Dharavi, Mumbai',
    category: 'Education Support',
    supportType: 'Tablet + STEM Scholarship',
    status: 'Active Support',
    householdIncome: '₹6,500/mo'
  });

  const categories = [
    'All',
    'Education Support',
    'Nutrition Support',
    'Healthcare Patient',
    'Artisan Grantee',
    'Emergency Relief'
  ];

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.supportType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      age: 14,
      gender: 'Female',
      location: 'Dharavi, Mumbai',
      category: 'Education Support',
      supportType: 'Full Coding Bootcamp Kit',
      status: 'Active Support',
      householdIncome: '₹7,000/mo'
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (ben) => {
    setSelectedBeneficiary(ben);
    setFormData({
      name: ben.name,
      age: ben.age,
      gender: ben.gender,
      location: ben.location,
      category: ben.category,
      supportType: ben.supportType,
      status: ben.status,
      householdIncome: ben.householdIncome
    });
    setEditModalOpen(true);
  };

  const handleOpenTimeline = (ben) => {
    setSelectedBeneficiary(ben);
    setTimelineModalOpen(true);
  };

  const handleOpenDelete = (ben) => {
    setSelectedBeneficiary(ben);
    setDeleteModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    addBeneficiary(formData);
    setAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name || !selectedBeneficiary) return;
    updateBeneficiary(selectedBeneficiary.id, formData);
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedBeneficiary) {
      deleteBeneficiary(selectedBeneficiary.id);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="admin-beneficiaries" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Beneficiary Registry ({beneficiaries.length} Verified Records)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Geotagged verified recipients receiving scholarships, medical aid, nutrition kits, and micro-grants.
          </p>
        </div>

        <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Register Beneficiary
        </Button>
      </div>

      {/* 2. FILTER TOOLBAR */}
      <Card style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Input
            placeholder="Search by name, community, support..."
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
              { value: 'All', label: 'Status: All Records' },
              { value: 'Active Support', label: 'Active Support' },
              { value: 'Graduated / Self-Sufficient', label: 'Graduated' }
            ]}
            style={{ marginBottom: 0 }}
          />
        </div>
      </Card>

      {/* 3. BENEFICIARIES TABLE */}
      <Card style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--white)' }}>
        <div className="nb-table-container">
          <table className="nb-table">
            <thead>
              <tr>
                <th>Beneficiary</th>
                <th>Location</th>
                <th>Intervention Category</th>
                <th>Support Package</th>
                <th>Income Tier</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeneficiaries.map((ben) => (
                <tr key={ben.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{ben.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>
                        {ben.age} yrs • {ben.gender} • ID: {ben.id}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{ben.location}</span>
                  </td>

                  <td>
                    <Badge variant="yellow" size="sm">{ben.category}</Badge>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-dark-green)' }}>
                      {ben.supportType}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{ben.householdIncome}</span>
                  </td>

                  <td>
                    <Badge variant={ben.status === 'Active Support' ? 'green' : 'white'} size="sm">
                      {ben.status === 'Active Support' ? '● Active' : '✓ Graduated'}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenTimeline(ben)}
                        className="nb-btn nb-btn-lightgreen nb-btn-sm"
                        style={{ padding: '5px' }}
                        title="View Support Timeline"
                      >
                        <Eye size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(ben)}
                        className="nb-btn nb-btn-white nb-btn-sm"
                        style={{ padding: '5px' }}
                        title="Edit Record"
                      >
                        <Edit2 size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(ben)}
                        className="nb-btn nb-btn-danger nb-btn-sm"
                        style={{ padding: '5px' }}
                        title="Delete Record"
                      >
                        <Trash2 size={15} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register Verified Beneficiary"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={Plus} onClick={handleSaveAdd}>Save Record</Button>
          </>
        }
      >
        <form onSubmit={handleSaveAdd}>
          <div className="grid-2">
            <Input
              label="Beneficiary Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
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
                { value: 'Other', label: 'Other' }
              ]}
            />
            <Input
              label="Community Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Select
              label="Intervention Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }))}
            />
            <Input
              label="Household Income Bracket"
              value={formData.householdIncome}
              onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}
            />
          </div>

          <Input
            label="Specific Support Package"
            value={formData.supportType}
            onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
          />
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit: ${selectedBeneficiary?.name}`}
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={CheckCircle2} onClick={handleSaveEdit}>Update Record</Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div className="grid-2">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active Support', label: 'Active Support' },
                { value: 'Graduated / Self-Sufficient', label: 'Graduated / Self-Sufficient' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Community Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Support Package"
              value={formData.supportType}
              onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* TIMELINE DOSSIER MODAL */}
      {selectedBeneficiary && (
        <Modal
          isOpen={timelineModalOpen}
          onClose={() => setTimelineModalOpen(false)}
          title={`Support History Timeline: ${selectedBeneficiary.name}`}
          maxWidth="620px"
          footer={
            <Button variant="yellow" onClick={() => setTimelineModalOpen(false)}>
              Close Timeline
            </Button>
          }
        >
          <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>
                  {selectedBeneficiary.name} ({selectedBeneficiary.age} yrs)
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#5A6F64' }}>
                  📍 {selectedBeneficiary.location} • Support: {selectedBeneficiary.supportType}
                </p>
              </div>
              <Badge variant={selectedBeneficiary.status === 'Active Support' ? 'green' : 'yellow'} size="sm">
                {selectedBeneficiary.status}
              </Badge>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedBeneficiary.timeline?.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--accent-yellow)',
                    border: '1.5px solid #000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1, padding: '0.75rem', backgroundColor: '#FFFFFF', border: '1.5px solid #000', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64', marginBottom: '2px' }}>
                    <span>{step.title}</span>
                    <span>{formatDate(step.date)}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#26332D', fontWeight: 500 }}>{step.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Beneficiary Record"
        message={`Are you sure you want to remove ${selectedBeneficiary?.name}'s record from the registry?`}
      />
    </div>
  );
}
