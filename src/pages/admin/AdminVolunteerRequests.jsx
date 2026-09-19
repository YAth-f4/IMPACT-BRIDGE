import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Award,
  Clock
} from 'lucide-react';

export default function AdminVolunteerRequests() {
  const { fetchAdminVolunteers, updateAdminVolunteerStatus } = useApp();

  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [targetAction, setTargetAction] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadApps = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    const result = await fetchAdminVolunteers(params.toString());
    setApplications(result.applications || []);
    setTotalCount(result.total || 0);
    setLoading(false);
  }, [fetchAdminVolunteers, statusFilter, searchQuery]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleOpenAction = (app, action) => {
    setSelectedApp(app);
    setTargetAction(action);
    setAdminNote(
      action === 'APPROVED'
        ? 'Background orientation completed. Certified for field operations.'
        : 'Currently no openings matching current availability.'
    );
    setActionModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApp || !targetAction) return;

    setIsUpdating(true);
    const res = await updateAdminVolunteerStatus(selectedApp.id, targetAction, adminNote);
    setIsUpdating(false);

    if (res.success) {
      setActionModalOpen(false);
      setDetailsModalOpen(false);
      loadApps();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="green" size="sm">✓ APPROVED</Badge>;
      case 'PENDING':
        return <Badge variant="yellow" size="sm">⏳ PENDING</Badge>;
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
            <span style={{ fontSize: '1.5rem' }}>🌱</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 900, margin: 0 }}>
              Volunteer Applications Management
            </h1>
          </div>
          <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            Review, verify, and approve applications from volunteers wishing to join programs.
          </p>
        </div>

        <Button variant="white" size="sm" icon={RefreshCw} onClick={loadApps}>
          Refresh
        </Button>
      </div>

      {/* Filter Card */}
      <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search volunteers by name, city, skill..."
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
            <option value="APPROVED">Approved Volunteers</option>
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
                <th style={{ padding: '0.75rem 1rem' }}>Application ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Volunteer Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>City</th>
                <th style={{ padding: '0.75rem 1rem' }}>Skills & Interests</th>
                <th style={{ padding: '0.75rem 1rem' }}>Availability</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center' }}>Loading volunteer applications...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                    No volunteer applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{app.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700 }}>{app.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#5A6F64' }}>{app.email} • {app.phone}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{app.city}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.8rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {(app.skills || []).slice(0, 2).map((s, i) => (
                          <span key={i} style={{ backgroundColor: '#EDF4F0', border: '1px solid #000', borderRadius: '3px', padding: '1px 5px', fontSize: '0.72rem' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem' }}>{app.availability}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getStatusBadge(app.status)}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Button
                          variant="white"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedApp(app);
                            setDetailsModalOpen(true);
                          }}
                        >
                          View
                        </Button>
                        {app.status !== 'APPROVED' && (
                          <Button
                            variant="yellow"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => handleOpenAction(app, 'APPROVED')}
                          >
                            Approve
                          </Button>
                        )}
                        {app.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleOpenAction(app, 'REJECTED')}
                            className="nb-btn nb-btn-white nb-btn-sm"
                            style={{ color: 'var(--danger-red)', borderColor: 'var(--danger-red)', padding: '0.35rem 0.65rem' }}
                            title="Reject application"
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
      {detailsModalOpen && selectedApp && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Volunteer Application: ${selectedApp.name}`}
          maxWidth="600px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #000', paddingBottom: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 800 }}>{selectedApp.name}</h3>
                <div style={{ fontSize: '0.82rem', color: '#5A6F64' }}>
                  {selectedApp.email} • {selectedApp.phone}
                </div>
              </div>
              <div>{getStatusBadge(selectedApp.status)}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div><strong>City:</strong> {selectedApp.city}</div>
              <div><strong>Availability:</strong> {selectedApp.availability}</div>
              <div><strong>Emergency Contact:</strong> {selectedApp.emergencyContact || 'N/A'}</div>
              <div><strong>Hours Logged:</strong> {selectedApp.hoursLogged || 0} hrs</div>
            </div>

            <div>
              <strong>Skills:</strong>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {(selectedApp.skills || []).map((s, i) => (
                  <span key={i} style={{ backgroundColor: '#E2ECE6', border: '1.5px solid #000', borderRadius: '4px', padding: '2px 8px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {selectedApp.adminNotes && (
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAF9', border: '1.5px solid #000', borderRadius: '4px', fontSize: '0.85rem' }}>
                <strong>Remarks:</strong> {selectedApp.adminNotes}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1.5px solid #000', paddingTop: '0.75rem' }}>
              <Button variant="white" size="sm" onClick={() => handleOpenAction(selectedApp, 'REJECTED')} style={{ color: 'var(--danger-red)' }}>
                Reject
              </Button>
              <Button variant="yellow" size="sm" onClick={() => handleOpenAction(selectedApp, 'APPROVED')}>
                Approve Volunteer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Modal */}
      {actionModalOpen && selectedApp && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Set Application to ${targetAction}`}
          maxWidth="460px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Confirm application status change for <strong>{selectedApp.name}</strong> to <strong>{targetAction}</strong>.
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
