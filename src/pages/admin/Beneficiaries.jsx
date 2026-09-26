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
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  MapPin,
  Smile,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  FileText,
  X
} from 'lucide-react';

export default function Beneficiaries() {
  const {
    beneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    addToast,
    fetchAdminFindHelp,
    updateAdminFindHelpStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('registry'); // 'registry' | 'requests'
  const [helpRequests, setHelpRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

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

  const loadHelpRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetchAdminFindHelp();
      if (res && (res.helpRequests || res.requests)) {
        setHelpRequests(res.helpRequests || res.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadHelpRequests();
  }, []);

  const handleUpdateRequestStatus = async (id, newStatus, note = '') => {
    setSubmittingAction(true);
    try {
      const res = await updateAdminFindHelpStatus(id, newStatus, note);
      if (res && res.success) {
        setHelpRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, adminNotes: note || r.adminNotes } : r))
        );
        if (selectedRequest?.id === id) {
          setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus, adminNotes: note || prev.adminNotes } : null));
        }
        setRequestModalOpen(false);
        setReviewNote('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

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

  const filteredRequests = helpRequests.filter((r) => {
    const requester = r.requesterName || r.name || '';
    const phone = r.phone || '';
    const desc = r.description || '';
    const matchesSearch =
      requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="admin-beneficiaries" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Beneficiary & Direct Assistance Operations ({beneficiaries.length} Verified • {helpRequests.filter((r) => r.status === 'PENDING').length} Pending Help Requests)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Oversee geotagged verified aid recipients and triage incoming community help submissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="white" size="sm" icon={RefreshCw} onClick={loadHelpRequests}>
            Refresh
          </Button>
          <Button variant="yellow" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Register Beneficiary
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('registry')}
          className={`nb-btn ${activeTab === 'registry' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
        >
          <HeartHandshake size={16} strokeWidth={2.5} />
          <span>Verified Registry ({beneficiaries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`nb-btn ${activeTab === 'requests' ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
        >
          <HelpCircle size={16} strokeWidth={2.5} />
          <span>Direct Help Requests ({helpRequests.length})</span>
          {helpRequests.filter((r) => r.status === 'PENDING').length > 0 && (
            <Badge variant="green" size="sm" style={{ marginLeft: '4px' }}>
              {helpRequests.filter((r) => r.status === 'PENDING').length}
            </Badge>
          )}
        </button>
      </div>

      {activeTab === 'registry' ? (
        <>
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
                            aria-label={`View support timeline for ${ben.name}`}
                          >
                            <Eye size={15} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(ben)}
                            className="nb-btn nb-btn-white nb-btn-sm"
                            style={{ padding: '5px' }}
                            title="Edit Record"
                            aria-label={`Edit beneficiary ${ben.name}`}
                          >
                            <Edit2 size={15} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(ben)}
                            className="nb-btn nb-btn-danger nb-btn-sm"
                            style={{ padding: '5px' }}
                            title="Delete Record"
                            aria-label={`Delete beneficiary ${ben.name}`}
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
        </>
      ) : (
        /* DIRECT HELP REQUESTS TAB */
        <>
          <Card style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                placeholder="Search requests, names, phones..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 0 }}
              />

              <Select
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'PENDING', label: 'Pending Review' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'NEEDS_INFO', label: 'Needs Information' },
                  { value: 'REJECTED', label: 'Rejected' }
                ]}
                style={{ marginBottom: 0 }}
              />
            </div>
          </Card>

          <Card style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--white)' }}>
            <div className="nb-table-container">
              <table className="nb-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>City / State</th>
                    <th>Category</th>
                    <th>Urgency</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th style={{ textAlign: 'right' }}>Review Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRequests ? (
                    <>
                      <SkeletonTableRow columns={8} />
                      <SkeletonTableRow columns={8} />
                      <SkeletonTableRow columns={8} />
                      <SkeletonTableRow columns={8} />
                    </>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5A6F64' }}>
                        No direct help requests found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{req.requesterName || req.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>
                              {req.phone} {req.email ? `• ${req.email}` : ''}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{req.city || 'National'}</span>
                        </td>

                        <td>
                          <Badge variant="yellow" size="sm">{req.category}</Badge>
                        </td>

                        <td>
                          <Badge variant={String(req.urgency).toUpperCase() === 'HIGH' ? 'red' : 'white'} size="sm">
                            {req.urgency || 'Normal'}
                          </Badge>
                        </td>

                        <td>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#26332D', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {req.description}
                          </p>
                        </td>

                        <td>
                          <Badge
                            variant={
                              req.status === 'APPROVED'
                                ? 'green'
                                : req.status === 'REJECTED'
                                ? 'red'
                                : req.status === 'NEEDS_INFO'
                                ? 'yellow'
                                : 'white'
                            }
                            size="sm"
                          >
                            {req.status || 'PENDING'}
                          </Badge>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.78rem', color: '#5A6F64' }}>{formatDate(req.createdAt)}</span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => { setSelectedRequest(req); setRequestModalOpen(true); }}
                              className="nb-btn nb-btn-lightgreen nb-btn-sm"
                              style={{ padding: '5px' }}
                              title="Inspect Help Request Dossier"
                              aria-label={`Inspect request from ${req.requesterName || req.name}`}
                            >
                              <Eye size={15} strokeWidth={2.5} />
                            </button>
                            {req.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateRequestStatus(req.id, 'APPROVED')}
                                className="nb-btn nb-btn-green nb-btn-sm"
                                style={{ padding: '5px' }}
                                title="Approve Request"
                                aria-label={`Approve request from ${req.requesterName || req.name}`}
                              >
                                <CheckCircle size={15} strokeWidth={2.5} />
                              </button>
                            )}
                            {req.status !== 'NEEDS_INFO' && (
                              <button
                                onClick={() => handleUpdateRequestStatus(req.id, 'NEEDS_INFO')}
                                className="nb-btn nb-btn-yellow nb-btn-sm"
                                style={{ padding: '5px' }}
                                title="Request Additional Info"
                                aria-label={`Request info for ${req.requesterName || req.name}`}
                              >
                                <AlertCircle size={15} strokeWidth={2.5} />
                              </button>
                            )}
                            {req.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleUpdateRequestStatus(req.id, 'REJECTED')}
                                className="nb-btn nb-btn-danger nb-btn-sm"
                                style={{ padding: '5px' }}
                                title="Reject Request"
                                aria-label={`Reject request from ${req.requesterName || req.name}`}
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
        </>
      )}

      {/* ADD MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register Verified Beneficiary"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" icon={X} onClick={() => setAddModalOpen(false)}>Cancel</Button>
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
            <Button variant="white" icon={X} onClick={() => setEditModalOpen(false)}>Cancel</Button>
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

      {/* HELP REQUEST DOSSIER MODAL */}
      {selectedRequest && (
        <Modal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          title={`Direct Help Request: ${selectedRequest.requesterName || selectedRequest.name}`}
          maxWidth="640px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Button variant="white" onClick={() => setRequestModalOpen(false)}>Close</Button>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedRequest.status !== 'REJECTED' && (
                  <Button
                    variant="danger"
                    icon={XCircle}
                    disabled={submittingAction}
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'REJECTED', reviewNote)}
                  >
                    Reject
                  </Button>
                )}
                {selectedRequest.status !== 'NEEDS_INFO' && (
                  <Button
                    variant="white"
                    icon={AlertCircle}
                    disabled={submittingAction}
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'NEEDS_INFO', reviewNote)}
                  >
                    Request Info
                  </Button>
                )}
                {selectedRequest.status !== 'APPROVED' && (
                  <Button
                    variant="yellow"
                    icon={CheckCircle}
                    disabled={submittingAction}
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'APPROVED', reviewNote)}
                  >
                    Approve Request
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #000', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>
                  {selectedRequest.requesterName || selectedRequest.name}
                </h4>
                <p style={{ margin: '2px 0 0', color: '#5A6F64', fontSize: '0.82rem' }}>
                  📞 {selectedRequest.phone} {selectedRequest.email ? `• ✉ ${selectedRequest.email}` : ''}
                </p>
              </div>
              <Badge
                variant={
                  selectedRequest.status === 'APPROVED'
                    ? 'green'
                    : selectedRequest.status === 'REJECTED'
                    ? 'red'
                    : selectedRequest.status === 'NEEDS_INFO'
                    ? 'yellow'
                    : 'white'
                }
              >
                {selectedRequest.status || 'PENDING'}
              </Badge>
            </div>

            <div className="grid-2">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>CATEGORY</span>
                <div style={{ fontWeight: 700 }}>{selectedRequest.category}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>LOCATION</span>
                <div style={{ fontWeight: 700 }}>{selectedRequest.city || 'Not specified'}</div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>URGENCY LEVEL</span>
              <div>
                <Badge variant={String(selectedRequest.urgency).toUpperCase() === 'HIGH' ? 'red' : 'white'} size="sm">
                  {selectedRequest.urgency || 'Normal'}
                </Badge>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>DESCRIPTION OF NEED</span>
              <div style={{ backgroundColor: '#F7FAF8', border: '1.5px solid #000', borderRadius: '4px', padding: '0.75rem', marginTop: '4px', fontSize: '0.88rem', lineHeight: 1.5 }}>
                {selectedRequest.description}
              </div>
            </div>

            {selectedRequest.adminNotes && (
              <div style={{ backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>EXISTING ADMIN NOTE</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{selectedRequest.adminNotes}</p>
              </div>
            )}

            <div>
              <Textarea
                label="Admin Decision Note / Instructions to Applicant"
                rows={3}
                placeholder="e.g. Approved for digital tablet dispatch or please provide income certificate copy..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>
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
