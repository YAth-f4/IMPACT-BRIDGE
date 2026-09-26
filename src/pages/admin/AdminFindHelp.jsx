import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import {
  HandHeart,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Eye,
  Clock,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  MessageSquare,
  X,
  Check
} from 'lucide-react';

export default function AdminFindHelp() {
  const { fetchAdminFindHelp, updateAdminFindHelpStatus, addToast } = useApp();

  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Request & Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [targetAction, setTargetAction] = useState(null); // 'APPROVED' | 'REJECTED' | 'NEEDS_INFO'
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    const result = await fetchAdminFindHelp(params.toString());
    setRequests(result.requests || []);
    setTotalCount(result.total || 0);
    setLoading(false);
  }, [fetchAdminFindHelp, statusFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleOpenActionModal = (req, action) => {
    setSelectedRequest(req);
    setTargetAction(action);
    setAdminNote(
      action === 'APPROVED'
        ? 'Request verified with regional coordinator. Aid allocation authorized.'
        : action === 'NEEDS_INFO'
        ? 'Please provide additional medical documentation or ration card details.'
        : 'Unable to process due to outside operating zone.'
    );
    setActionModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !targetAction) return;

    setIsUpdating(true);
    const res = await updateAdminFindHelpStatus(selectedRequest.id, targetAction, adminNote);
    setIsUpdating(false);

    if (res.success) {
      setActionModalOpen(false);
      setDetailsModalOpen(false);
      loadRequests();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="green" size="sm">✓ APPROVED</Badge>;
      case 'PENDING':
        return <Badge variant="yellow" size="sm">⏳ PENDING</Badge>;
      case 'NEEDS_INFO':
        return <Badge variant="yellow" size="sm">⚠️ NEEDS INFO</Badge>;
      case 'REJECTED':
        return <Badge variant="red" size="sm">✕ REJECTED</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🤝</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 900, margin: 0 }}>
              Find Help Requests Management
            </h1>
          </div>
          <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            Review, verify, and approve incoming aid and relief applications from citizens.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="white" size="sm" icon={RefreshCw} onClick={loadRequests}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Search by ID, name, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.55rem 0.55rem 2rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#FFFFFF', fontWeight: 700 }}
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="PENDING">Pending Review Only</option>
              <option value="APPROVED">Approved Requests</option>
              <option value="NEEDS_INFO">Needs Information</option>
              <option value="REJECTED">Rejected Requests</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#FFFFFF', fontWeight: 700 }}
            >
              <option value="ALL">All Categories</option>
              <option value="Food & Nutrition">Food & Nutrition</option>
              <option value="Healthcare & Medicine">Healthcare & Medicine</option>
              <option value="Education Support">Education Support</option>
              <option value="Emergency Shelter">Emergency Shelter</option>
              <option value="Livelihood & Skills">Livelihood & Skills</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests Table */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDF4F0', borderBottom: '2.5px solid #000' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Request ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Requester</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>City</th>
                <th style={{ padding: '0.75rem 1rem' }}>Urgency</th>
                <th style={{ padding: '0.75rem 1rem' }}>Submitted</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonTableRow columns={8} />
                  <SkeletonTableRow columns={8} />
                  <SkeletonTableRow columns={8} />
                  <SkeletonTableRow columns={8} />
                </>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                    No requests matched the current criteria.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{r.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700 }}>{r.requesterName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#5A6F64' }}>{r.phone}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{r.category}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{r.city}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: r.urgency === 'Emergency' ? 'var(--danger-red)' : '#000'
                        }}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5A6F64', fontSize: '0.8rem' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getStatusBadge(r.status)}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Button
                          variant="white"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedRequest(r);
                            setDetailsModalOpen(true);
                          }}
                        >
                          View
                        </Button>
                        {r.status !== 'APPROVED' && (
                          <Button
                            variant="yellow"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => handleOpenActionModal(r, 'APPROVED')}
                          >
                            Approve
                          </Button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleOpenActionModal(r, 'REJECTED')}
                            className="nb-btn nb-btn-white nb-btn-sm"
                            style={{ color: 'var(--danger-red)', borderColor: 'var(--danger-red)', padding: '0.35rem 0.65rem' }}
                            title="Reject request"
                          >
                            <XCircle size={14} />
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

      {/* Details Modal */}
      {detailsModalOpen && selectedRequest && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Find Help Request: ${selectedRequest.id}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #000', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem' }}>{selectedRequest.requesterName}</h3>
                <div style={{ fontSize: '0.82rem', color: '#5A6F64' }}>
                  📞 {selectedRequest.phone} {selectedRequest.email && `• ✉️ ${selectedRequest.email}`}
                </div>
              </div>
              <div>{getStatusBadge(selectedRequest.status)}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div><strong>Category:</strong> {selectedRequest.category}</div>
              <div><strong>Location:</strong> {selectedRequest.city}</div>
              <div><strong>Urgency:</strong> {selectedRequest.urgency}</div>
              <div><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#F8FAF9', border: '1.5px solid #000', borderRadius: '4px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Description of Need:</div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{selectedRequest.description}</p>
            </div>

            {selectedRequest.adminNotes && (
              <div style={{ padding: '0.75rem', backgroundColor: '#FFFBEB', border: '1.5px solid #000', borderRadius: '4px', fontSize: '0.85rem' }}>
                <strong>Current Admin Remark:</strong> {selectedRequest.adminNotes}
              </div>
            )}

            {/* Audit Trail */}
            {selectedRequest.auditLog && selectedRequest.auditLog.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Audit & Approval History:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '130px', overflowY: 'auto' }}>
                  {selectedRequest.auditLog.map((log, idx) => (
                    <div key={idx} style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '3px' }}>
                      <strong>{log.action}</strong> by {log.performedBy} ({new Date(log.timestamp).toLocaleDateString()}) — {log.note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1.5px solid #000', paddingTop: '0.75rem' }}>
              <Button
                variant="white"
                size="sm"
                onClick={() => handleOpenActionModal(selectedRequest, 'NEEDS_INFO')}
              >
                Request Info
              </Button>
              <Button
                variant="white"
                size="sm"
                onClick={() => handleOpenActionModal(selectedRequest, 'REJECTED')}
                style={{ color: 'var(--danger-red)' }}
              >
                Reject
              </Button>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => handleOpenActionModal(selectedRequest, 'APPROVED')}
              >
                Approve Request
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation & Remark Modal */}
      {actionModalOpen && selectedRequest && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Confirm Action: Set ${selectedRequest.id} to ${targetAction}`}
          maxWidth="480px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              You are about to change the status of this request to <strong>{targetAction}</strong>. This update will be recorded in the audit history.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Administrative Note / Instructions for Citizen
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="white" size="sm" icon={X} onClick={() => setActionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={targetAction === 'APPROVED' ? 'yellow' : 'white'}
                size="sm"
                icon={Check}
                onClick={handleConfirmAction}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : `Confirm ${targetAction}`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
