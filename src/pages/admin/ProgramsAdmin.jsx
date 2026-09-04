import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Input, Select, Textarea } from '../../components/common/Input';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import {
  CalendarCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  HeartHandshake,
  MapPin,
  Calendar,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';

export default function ProgramsAdmin() {
  const {
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    volunteers,
    setSelectedProgramModal,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignVolModalProg, setAssignVolModalProg] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Education',
    location: 'Mumbai, MH',
    city: 'Mumbai',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'Ongoing',
    budget: 1500000,
    fundsRaised: 1000000,
    targetBeneficiaries: 1000,
    volunteersNeeded: 25,
    lead: 'Dr. Ananya Iyer',
    shortDesc: '',
    description: '',
    objectives: '',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
  });

  const categories = [
    'All',
    'Education',
    'Healthcare',
    'Food & Nutrition',
    'Community Development',
    'Women & Child Empowerment',
    'Emergency Support'
  ];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      id: '',
      title: '',
      category: 'Education',
      location: 'Dharavi, Mumbai',
      city: 'Mumbai',
      startDate: '2025-05-01',
      endDate: '2026-04-30',
      status: 'Ongoing',
      budget: 1800000,
      fundsRaised: 1200000,
      targetBeneficiaries: 800,
      volunteersNeeded: 20,
      lead: 'Prof. Devendra Joshi',
      shortDesc: 'Equipping underprivileged municipal school students with smart labs.',
      description: 'Comprehensive 12-month STEM and digital learning intervention.',
      objectives: 'Establish 5 solar hubs\nTrain 30 mentors\nReach 800 students',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (prog) => {
    setFormData({
      id: prog.id,
      title: prog.title,
      category: prog.category,
      location: prog.location,
      city: prog.city || 'Mumbai',
      startDate: prog.startDate,
      endDate: prog.endDate,
      status: prog.status,
      budget: prog.budget,
      fundsRaised: prog.fundsRaised,
      targetBeneficiaries: prog.targetBeneficiaries,
      volunteersNeeded: prog.volunteersNeeded,
      lead: prog.lead,
      shortDesc: prog.shortDesc,
      description: prog.description,
      objectives: Array.isArray(prog.objectives) ? prog.objectives.join('\n') : prog.objectives,
      image: prog.image
    });
    setEditModalOpen(true);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formData.title) {
      addToast('Program Title is required', 'error');
      return;
    }
    addProgram(formData);
    setCreateModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateProgram(formData.id, formData);
    setEditModalOpen(false);
  };

  const kanbanStatuses = ['Upcoming', 'Ongoing', 'Completed'];

  return (
    <div className="programs-admin" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Program & Event Operations ({programs.length})
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Manage program lifecycles, volunteer rosters, budgets, and beneficiary capacities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode('grid')}
            className={`nb-btn ${viewMode === 'grid' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
          >
            <LayoutGrid size={16} strokeWidth={2.5} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`nb-btn ${viewMode === 'kanban' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
          >
            <Layers size={16} strokeWidth={2.5} />
            <span>Kanban</span>
          </button>
          <Button variant="green" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Create Program
          </Button>
        </div>
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
            placeholder="Search programs or location..."
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
              { value: 'Ongoing', label: 'Ongoing Programs' },
              { value: 'Upcoming', label: 'Upcoming Programs' },
              { value: 'Completed', label: 'Completed Programs' }
            ]}
            style={{ marginBottom: 0 }}
          />
        </div>
      </Card>

      {/* 3. GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid-3">
          {filteredPrograms.map((prog) => (
            <Card
              key={prog.id}
              hover={true}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', height: '160px', width: '100%', borderBottom: '2px solid #000' }}>
                <img src={prog.image} alt={prog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                  <Badge variant="yellow" size="sm">{prog.category}</Badge>
                  <Badge variant={prog.status === 'Ongoing' ? 'green' : 'white'} size="sm">{prog.status}</Badge>
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5A6F64', marginBottom: '0.3rem' }}>
                    📍 {prog.location} • {prog.startDate}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {prog.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#3A4E44', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {prog.shortDesc}
                  </p>

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    <div>👥 Beneficiaries: {formatNumber(prog.actualBeneficiaries)} / {formatNumber(prog.targetBeneficiaries)}</div>
                    <div>🤝 Volunteers: {prog.volunteersEnrolled} / {prog.volunteersNeeded}</div>
                    <div>💰 Funds: {formatCurrency(prog.fundsRaised)} / {formatCurrency(prog.budget)} ({prog.progress}%)</div>
                  </div>
                </div>

                <div style={{ borderTop: '1.5px solid #E2ECE6', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => setSelectedProgramModal(prog)}
                      className="nb-btn nb-btn-white nb-btn-sm"
                      style={{ padding: '4px 6px' }}
                      title="Inspect Details"
                    >
                      <Eye size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(prog)}
                      className="nb-btn nb-btn-yellow nb-btn-sm"
                      style={{ padding: '4px 6px' }}
                      title="Edit Program"
                    >
                      <Edit2 size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(prog.id)}
                      className="nb-btn nb-btn-danger nb-btn-sm"
                      style={{ padding: '4px 6px' }}
                      title="Delete Program"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>

                  <Button
                    variant="green"
                    size="sm"
                    onClick={() => setAssignVolModalProg(prog)}
                  >
                    Assign Roster
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 4. KANBAN STATUS BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {kanbanStatuses.map((status) => {
            const list = filteredPrograms.filter((p) => p.status === status);
            return (
              <div
                key={status}
                style={{
                  backgroundColor: '#EBF4EF',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  minHeight: '400px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.95rem' }}>
                    {status.toUpperCase()}
                  </span>
                  <Badge variant="yellow" size="sm">{list.length}</Badge>
                </div>

                {list.map((prog) => (
                  <Card key={prog.id} hover={true} style={{ padding: '1rem' }}>
                    <Badge variant="green" size="sm" style={{ marginBottom: '0.4rem' }}>{prog.category}</Badge>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                      {prog.title}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#5A6F64', fontWeight: 600, marginBottom: '0.5rem' }}>
                      📍 {prog.location}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                      <span>{prog.progress}% Funded</span>
                      <button
                        onClick={() => setSelectedProgramModal(prog)}
                        style={{ background: 'none', border: 'none', color: 'var(--brand-dark-green)', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Inspect →
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. CREATE PROGRAM MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New NGO Program"
        maxWidth="650px"
        footer={
          <>
            <Button variant="white" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSaveCreate}>Publish Program</Button>
          </>
        }
      >
        <form onSubmit={handleSaveCreate}>
          <Input
            label="Program Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid-2">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Education', label: 'Education' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Food & Nutrition', label: 'Food & Nutrition' },
                { value: 'Community Development', label: 'Community Development' },
                { value: 'Women & Child Empowerment', label: 'Women Empowerment' },
                { value: 'Emergency Support', label: 'Emergency Support' }
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Ongoing', label: 'Ongoing' },
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Location & Hub"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Program Lead"
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Budget (INR ₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
            <Input
              label="Target Beneficiaries"
              type="number"
              value={formData.targetBeneficiaries}
              onChange={(e) => setFormData({ ...formData, targetBeneficiaries: Number(e.target.value) })}
            />
          </div>

          <Textarea
            label="Short Summary"
            rows={2}
            value={formData.shortDesc}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
          />
        </form>
      </Modal>

      {/* 6. EDIT PROGRAM MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Program: ${formData.title}`}
        maxWidth="650px"
        footer={
          <>
            <Button variant="white" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSaveEdit}>Update Program</Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <Input
            label="Program Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid-2">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Education', label: 'Education' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Food & Nutrition', label: 'Food & Nutrition' },
                { value: 'Community Development', label: 'Community Development' },
                { value: 'Women & Child Empowerment', label: 'Women Empowerment' },
                { value: 'Emergency Support', label: 'Emergency Support' }
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Ongoing', label: 'Ongoing' },
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
            <Input
              label="Funds Raised (₹)"
              type="number"
              value={formData.fundsRaised}
              onChange={(e) => setFormData({ ...formData, fundsRaised: Number(e.target.value) })}
            />
          </div>

          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </form>
      </Modal>

      {/* 7. ASSIGN VOLUNTEERS MODAL */}
      {assignVolModalProg && (
        <Modal
          isOpen={!!assignVolModalProg}
          onClose={() => setAssignVolModalProg(null)}
          title={`Assign Volunteers: ${assignVolModalProg.title}`}
          maxWidth="560px"
          footer={
            <Button
              variant="yellow"
              onClick={() => {
                addToast('Volunteer roster assignments updated!', 'success');
                setAssignVolModalProg(null);
              }}
            >
              Save Assignments
            </Button>
          }
        >
          <p style={{ fontSize: '0.85rem', color: '#5A6F64', marginBottom: '1rem', fontWeight: 600 }}>
            Select available field volunteers to enroll into this program roster:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto' }}>
            {volunteers.map((v) => (
              <label
                key={v.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#F0F7F2',
                  border: '1.5px solid #000',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" defaultChecked={v.city === assignVolModalProg.city} style={{ width: '16px', height: '16px' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{v.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#5A6F64' }}>📍 {v.city} • {v.hoursLogged} hrs</div>
                  </div>
                </div>
                <Badge variant="white" size="sm">{(v.skills || [])[0] || 'Volunteer'}</Badge>
              </label>
            ))}
          </div>
        </Modal>
      )}

      {/* 8. DELETE CONFIRM */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteProgram(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Program"
        message="Are you sure you want to permanently delete this program and its records?"
      />
    </div>
  );
}
