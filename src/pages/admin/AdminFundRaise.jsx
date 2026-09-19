import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  Heart,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function AdminFundRaise() {
  const { fetchAdminFundRaise, updateAdminFundRaiseStatus, addToast } = useApp();

  const [campaigns, setCampaigns] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [targetAction, setTargetAction] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    const result = await fetchAdminFundRaise(params.toString());
    setCampaigns(result.requests || []);
    setTotalCount(result.total || 0);
    setLoading(false);
  }, [fetchAdminFundRaise, statusFilter, searchQuery]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleOpenAction = (camp, action) => {
    setSelectedCampaign(camp);
    setTargetAction(action);
    setAdminNote(
      action === 'APPROVED'
        ? 'Verified project feasibility and certified for 80G public listing.'
        : 'Requires additional verified contractor quotations.'
    );
    setActionModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedCampaign || !targetAction) return;

    setIsUpdating(true);
    const res = await updateAdminFundRaiseStatus(selectedCampaign.id, targetAction, adminNote);
    setIsUpdating(false);

    if (res.success) {
      setActionModalOpen(false);
      setDetailsModalOpen(false);
      loadCampaigns();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="green" size="sm">✓ APPROVED & LIVE</Badge>;
      case 'PENDING':
        return <Badge variant="yellow" size="sm">⏳ PENDING APPROVAL</Badge>;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>❤️</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 900, margin: 0 }}>
              Fund Raise Request Approvals
            </h1>
          </div>
          <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            Verify and approve proposed community fundraising initiatives before they are published publicly.
          </p>
        </div>

        <Button variant="white" size="sm" icon={RefreshCw} onClick={loadCampaigns}>
          Refresh
        </Button>
      </div>

      {/* Filter Card */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search campaigns by title, organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.55rem', border: '2px solid #000', borderRadius: '4px' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.55rem', border: '2px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF', fontWeight: 700 }}
          >
            <option value="ALL">All Statuses ({totalCount})</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved & Live</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDF4F0', borderBottom: '2.5px solid #000' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Campaign ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Title & Organizer</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Target (INR)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Submitted</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center' }}>Loading campaigns...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                    No campaigns matched the current filter.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{c.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700 }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#5A6F64' }}>
                        By {c.organizerName} ({c.email})
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{c.category}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>
                      ₹{Number(c.targetAmount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5A6F64', fontSize: '0.8rem' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getStatusBadge(c.status)}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Button
                          variant="white"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedCampaign(c);
                            setDetailsModalOpen(true);
                          }}
                        >
                          Details
                        </Button>
                        {c.status !== 'APPROVED' && (
                          <Button
                            variant="yellow"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => handleOpenAction(c, 'APPROVED')}
                          >
                            Approve
                          </Button>
                        )}
                        {c.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleOpenAction(c, 'REJECTED')}
                            className="nb-btn nb-btn-white nb-btn-sm"
                            style={{ color: 'var(--danger-red)', borderColor: 'var(--danger-red)', padding: '0.35rem 0.65rem' }}
                            title="Reject campaign"
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
      {detailsModalOpen && selectedCampaign && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Campaign Proposal: ${selectedCampaign.title}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #000', paddingBottom: '0.5rem' }}>
              <div>
                <strong>Organizer:</strong> {selectedCampaign.organizerName} ({selectedCampaign.email})
                <div>📍 {selectedCampaign.location}</div>
              </div>
              <div>{getStatusBadge(selectedCampaign.status)}</div>
            </div>

            <div style={{ fontSize: '0.9rem' }}>
              <strong>Funding Goal:</strong> ₹{Number(selectedCampaign.targetAmount).toLocaleString('en-IN')}
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#F8FAF9', border: '1.5px solid #000', borderRadius: '4px' }}>
              <strong>Description:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', lineHeight: 1.45 }}>{selectedCampaign.description}</p>
            </div>

            {selectedCampaign.beneficiaryStory && (
              <div style={{ padding: '0.85rem', backgroundColor: '#EDF7F2', border: '1.5px solid #000', borderRadius: '4px' }}>
                <strong>Impact Story:</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', lineHeight: 1.45 }}>{selectedCampaign.beneficiaryStory}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1.5px solid #000', paddingTop: '0.75rem' }}>
              <Button variant="white" size="sm" onClick={() => handleOpenAction(selectedCampaign, 'REJECTED')} style={{ color: 'var(--danger-red)' }}>
                Reject
              </Button>
              <Button variant="yellow" size="sm" onClick={() => handleOpenAction(selectedCampaign, 'APPROVED')}>
                Approve & Publish Campaign
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Modal */}
      {actionModalOpen && selectedCampaign && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Set Campaign to ${targetAction}`}
          maxWidth="460px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Update campaign status to <strong>{targetAction}</strong>.
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="Admin remarks..."
              style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="white" size="sm" onClick={() => setActionModalOpen(false)}>Cancel</Button>
              <Button variant="yellow" size="sm" onClick={handleConfirmAction} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
