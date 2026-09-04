import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Input, Select, Textarea } from '../../components/common/Input';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  CalendarCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  LayoutGrid,
  Columns3
} from 'lucide-react';

export default function Programs() {
  const {
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    volunteers,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Education',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    shortDesc: '',
    description: '',
    budget: 1500000,
    fundsRaised: 0,
    targetBeneficiaries: 1000,
    volunteersNeeded: 25,
    status: 'Upcoming',
    lead: 'Dr. Ananya Iyer',
    startDate: '2026-04-01',
    endDate: '2026-10-30',
    objectives: 'Setup 5 solar labs\nEnroll 500 children',
    tags: 'Education, Solar, STEM'
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
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      category: 'Education',
      location: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      shortDesc: '',
      description: '',
      budget: 1500000,
      fundsRaised: 0,
      targetBeneficiaries: 1000,
      volunteersNeeded: 25,
      status: 'Upcoming',
      lead: 'Dr. Ananya Iyer',
      startDate: '2026-04-01',
      endDate: '2026-10-30',
      objectives: 'Setup 5 solar labs\nEnroll 500 children',
      tags: 'Education, Solar, STEM'
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (prog) => {
    setSelectedProgram(prog);
    setFormData({
      title: prog.title,
      category: prog.category,
      location: prog.location,
      city: prog.city,
      shortDesc: prog.shortDesc,
      description: prog.description,
      budget: prog.budget,
      fundsRaised: prog.fundsRaised,
      targetBeneficiaries: prog.targetBeneficiaries,
      volunteersNeeded: prog.volunteersNeeded,
      status: prog.status,
      lead: prog.lead,
      startDate: prog.startDate,
      endDate: prog.endDate,
      objectives: Array.isArray(prog.objectives) ? prog.objectives.join('\n') : prog.objectives || '',
      tags: Array.isArray(prog.tags) ? prog.tags.join(', ') : prog.tags || ''
    });
    setEditModalOpen(true);
  };

  const handleOpenRoster = (prog) => {
    setSelectedProgram(prog);
    setRosterModalOpen(true);
  };

  const handleOpenDelete = (prog) => {
    setSelectedProgram(prog);
    setDeleteModalOpen(true);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addProgram(formData);
    setCreateModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.title || !selectedProgram) return;
    updateProgram(selectedProgram.id, {
      ...formData,
      objectives: formData.objectives.split('\n').filter(Boolean),
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean)
    });
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedProgram) {
      deleteProgram(selectedProgram.id);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="admin-programs" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Program Operations & Project Portfolio ({programs.length} Initiatives)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Manage budgets, field volunteers, timelines, and impact milestone delivery.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`nb-btn ${viewMode === 'grid' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
            >
              <LayoutGrid size={15} strokeWidth={2.5} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`nb-btn ${viewMode === 'kanban' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
            >
              <Columns3 size={15} strokeWidth={2.5} />
              <span>Kanban</span>
            </button>
          </div>

          <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Create New Program
          </Button>
        </div>
      </div>

      {/* 2. FILTER TOOLBAR */}
      <Card style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input
            placeholder="Search programs, locations, leads..."
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
        </div>
      </Card>

      {/* 3. GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid-3">
          {filteredPrograms.map((prog) => (
            <Card key={prog.id} hover={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Badge variant="yellow" size="sm">{prog.category}</Badge>
                  <Badge variant={prog.status === 'Ongoing' ? 'green' : 'white'} size="sm">{prog.status}</Badge>
                </div>

                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                  {prog.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600, marginBottom: '0.75rem' }}>
                  📍 {prog.location} • Lead: {prog.lead}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '2px' }}>
                    <span>{formatCurrency(prog.fundsRaised)}</span>
                    <span>{prog.progress}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#E2ECE6', border: '1.5px solid #000', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${prog.progress}%`, backgroundColor: 'var(--accent-yellow)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem' }}>
                  <span>👥 {formatNumber(prog.actualBeneficiaries)} Beneficiaries</span>
                  <span>🤝 {prog.volunteersEnrolled} Volunteers</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1.5px solid #E2ECE6', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                <Button variant="lightgreen" size="sm" icon={Users} onClick={() => handleOpenRoster(prog)}>
                  Roster
                </Button>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => handleOpenEdit(prog)} className="nb-btn nb-btn-white nb-btn-sm" style={{ padding: '5px' }}>
                    <Edit2 size={14} strokeWidth={2.5} />
                  </button>
                  <button onClick={() => handleOpenDelete(prog)} className="nb-btn nb-btn-danger nb-btn-sm" style={{ padding: '5px' }}>
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 4. KANBAN STATUS BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="hero-grid">
          <style>{`
            @media (max-width: 900px) {
              .hero-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {['Upcoming', 'Ongoing', 'Completed'].map((status) => {
            const columnPrograms = filteredPrograms.filter((p) => p.status === status);
            return (
              <div
                key={status}
                style={{
                  backgroundColor: '#F0F7F2',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0 #000',
                  borderRadius: '6px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem' }}>
                    {status.toUpperCase()}
                  </h4>
                  <Badge variant="white" size="sm">{columnPrograms.length}</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '300px' }}>
                  {columnPrograms.map((p) => (
                    <Card key={p.id} style={{ padding: '1rem', backgroundColor: '#FFFFFF' }}>
                      <Badge variant="yellow" size="sm" style={{ marginBottom: '4px' }}>{p.category}</Badge>
                      <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                        {p.title}
                      </h5>
                      <p style={{ fontSize: '0.75rem', color: '#5A6F64', marginBottom: '8px' }}>📍 {p.city}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                        <span>{formatCurrency(p.fundsRaised)}</span>
                        <span>{p.progress}%</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PROGRAM MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Field Initiative"
        maxWidth="680px"
        footer={
          <>
            <Button variant="white" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={Plus} onClick={handleSaveCreate}>Launch Initiative</Button>
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
              options={categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Ongoing', label: 'Ongoing' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Location & State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Project Lead"
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Budget Required (₹)"
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
            label="Short Description"
            rows={2}
            value={formData.shortDesc}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
          />
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit: ${selectedProgram?.title}`}
        maxWidth="680px"
        footer={
          <>
            <Button variant="white" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={CalendarCheck} onClick={handleSaveEdit}>Update Initiative</Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid-2">
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
            <Input
              label="Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>

      {/* VOLUNTEER ROSTER MODAL */}
      {selectedProgram && (
        <Modal
          isOpen={rosterModalOpen}
          onClose={() => setRosterModalOpen(false)}
          title={`Assigned Volunteers: ${selectedProgram.title}`}
          maxWidth="600px"
          footer={
            <Button variant="yellow" onClick={() => setRosterModalOpen(false)}>
              Save Roster
            </Button>
          }
        >
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#5A6F64' }}>
            Select verified volunteers to deploy for this initiative:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
            {volunteers.map((v) => (
              <label
                key={v.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#F7FAF8',
                  border: '1.5px solid #000',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" defaultChecked={v.city === selectedProgram.city} style={{ width: '16px', height: '16px' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{v.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#5A6F64' }}>📍 {v.city} • {v.skills?.join(', ')}</div>
                  </div>
                </div>
                <Badge variant="white" size="sm">{v.hoursLogged} hrs</Badge>
              </label>
            ))}
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Program Initiative"
        message={`Are you sure you want to remove "${selectedProgram?.title}" from the database?`}
      />
    </div>
  );
}
