import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BridgeLoader from '../../components/common/BridgeLoader';
import { SkeletonCard } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  FileText, 
  ExternalLink, 
  Eye, 
  RefreshCw,
  X,
  ArrowLeft
} from 'lucide-react';

export default function AdminNgoRegistrations() {
  const { fetchAdminNgos, updateAdminNgoStatus } = useApp();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [actionType, setActionType] = useState(null); // 'APPROVE' | 'REJECT' | 'NEEDS_INFO'
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadNgos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminNgos(statusFilter);
      if (res && res.success) {
        setNgos(res.ngos || []);
      }
    } catch (err) {
      console.error('Failed to load admin NGOs:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAdminNgos, statusFilter]);

  useEffect(() => {
    loadNgos();
  }, [loadNgos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedNgo) {
        setSelectedNgo(null);
        setActionType(null);
      }
    };
    if (selectedNgo) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNgo]);

  const handleOpenReview = (ngo, action) => {
    setSelectedNgo(ngo);
    setActionType(action);
    setReviewNotes('');
    setMessage('');
  };

  const handleExecuteStatusUpdate = async (e) => {
    e.preventDefault();
    if ((actionType === 'REJECT' || actionType === 'NEEDS_INFO') && !reviewNotes.trim()) {
      alert('Review notes are required for Reject and Needs Info actions.');
      return;
    }

    setSubmitting(true);
    try {
      const targetStatus = actionType === 'APPROVE' ? 'APPROVED' : actionType === 'REJECT' ? 'REJECTED' : actionType;
      const res = await updateAdminNgoStatus(selectedNgo.id, targetStatus, reviewNotes);
      if (res && res.success) {
        setMessage(`NGO status successfully updated to ${targetStatus}!`);
        setTimeout(() => {
          setSelectedNgo(null);
          setActionType(null);
          loadNgos();
        }, 1200);
      } else {
        alert(res?.message || res?.error || 'Failed to update status.');
      }
    } catch (err) {
      alert(err.message || 'Error updating status.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNgos = ngos.filter((ngo) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      ngo.organizationName?.toLowerCase().includes(q) ||
      ngo.registrationNumber?.toLowerCase().includes(q) ||
      ngo.city?.toLowerCase().includes(q) ||
      ngo.contactEmail?.toLowerCase().includes(q)
    );
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#D1FAE5',
              color: '#064E3B',
              border: '1.5px solid #065F46',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.5rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.72rem',
              fontWeight: 900,
              textTransform: 'uppercase'
            }}
          >
            <CheckCircle2 size={12} color="#059669" strokeWidth={2.5} />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              border: '1.5px solid #991B1B',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.5rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.72rem',
              fontWeight: 900,
              textTransform: 'uppercase'
            }}
          >
            <XCircle size={12} color="#DC2626" strokeWidth={2.5} />
            Rejected
          </span>
        );
      case 'NEEDS_INFO':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1.5px solid #92400E',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.5rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.72rem',
              fontWeight: 900,
              textTransform: 'uppercase'
            }}
          >
            <AlertTriangle size={12} color="#D97706" strokeWidth={2.5} />
            Needs Info
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FEF9C3',
              color: '#854D0E',
              border: '1.5px solid #854D0E',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.5rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.72rem',
              fontWeight: 900,
              textTransform: 'uppercase'
            }}
          >
            <Clock size={12} color="#CA8A04" strokeWidth={2.5} />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div style={{ padding: 'clamp(1rem, 2.5vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          borderBottom: 'var(--border-thick)',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-block', marginBottom: '0.4rem' }}>
            <Badge variant="yellow" size="sm">ADMIN VERIFICATION QUEUE</Badge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, margin: 0 }}>
            NGO Registration Review
          </h1>
          <p style={{ color: '#5A6F64', fontSize: '0.92rem', margin: 0, marginTop: '4px', fontWeight: 500 }}>
            Verify statutory certificates, inspect authorized representatives, and approve or reject submissions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: 'var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
              padding: '0.4rem 0.85rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          >
            Pending Queue: {ngos.filter((n) => n.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <Card style={{ padding: '1rem', border: 'var(--border-thick)', boxShadow: 'var(--shadow-md)', backgroundColor: '#FFFFFF' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['ALL', 'PENDING', 'APPROVED', 'NEEDS_INFO', 'REJECTED'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`nb-btn ${statusFilter === tab ? 'nb-btn-yellow' : 'nb-btn-white'} nb-btn-sm`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search
              size={15}
              color="#5A6F64"
              strokeWidth={2.5}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by NGO name, reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nb-input"
              style={{
                paddingLeft: '2rem',
                height: '38px',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Main List Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <SkeletonCard lines={2} height="130px" />
          <SkeletonCard lines={2} height="130px" />
          <SkeletonCard lines={2} height="130px" />
        </div>
      ) : filteredNgos.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          description="No registrations match the selected filter criteria."
          onReset={() => { setStatusFilter('ALL'); setSearchQuery(''); }}
          resetLabel="Reset Filter"
          icon={<Building2 size={28} color="#000" strokeWidth={2.5} />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredNgos.map((ngo) => (
            <Card
              key={ngo.id}
              style={{
                border: 'var(--border-thick)',
                boxShadow: 'var(--shadow-md)',
                padding: '1.25rem',
                backgroundColor: 'var(--white)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem'
                }}
              >
                {/* NGO info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 400px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'var(--bg-offwhite)',
                      border: '2px solid #000',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {ngo.logo ? (
                      <img
                        src={ngo.logo}
                        alt={ngo.organizationName}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span>{ngo.organizationName?.substring(0, 2).toUpperCase() || 'NB'}</span>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                        {ngo.organizationName}
                      </h3>
                      {renderStatusBadge(ngo.status)}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>
                      <span>Reg: <strong style={{ color: '#000', fontFamily: 'var(--font-mono)' }}>{ngo.registrationNumber}</strong></span>
                      <span>Type: <strong style={{ color: '#000' }}>{ngo.ngoType || 'NGO'}</strong></span>
                      <span>City: <strong style={{ color: '#000' }}>{ngo.city || 'N/A'}, {ngo.state || ''}</strong></span>
                      <span>Submitted: <strong style={{ color: '#000' }}>{new Date(ngo.createdAt).toLocaleDateString()}</strong></span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: '#374151', margin: '0.5rem 0 0', lineHeight: 1.45 }}>
                      {ngo.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    variant="white"
                    size="sm"
                    icon={Eye}
                    onClick={() => { setSelectedNgo(ngo); setActionType(null); }}
                  >
                    Inspect
                  </Button>

                  {ngo.status !== 'APPROVED' && (
                    <Button
                      variant="green"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleOpenReview(ngo, 'APPROVE')}
                    >
                      Approve
                    </Button>
                  )}

                  {ngo.status !== 'NEEDS_INFO' && (
                    <Button
                      variant="yellow"
                      size="sm"
                      icon={AlertTriangle}
                      onClick={() => handleOpenReview(ngo, 'NEEDS_INFO')}
                    >
                      Needs Info
                    </Button>
                  )}

                  {ngo.status !== 'REJECTED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleOpenReview(ngo, 'REJECT')}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* INSPECT & REVIEW MODAL */}
      {selectedNgo && (
        <div
          className="nb-modal-backdrop"
          onClick={() => { setSelectedNgo(null); setActionType(null); }}
        >
          <div
            className="nb-modal-content"
            style={{ maxWidth: '720px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nb-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} strokeWidth={2.5} />
                <h3 style={{ margin: 0 }}>{selectedNgo.organizationName}</h3>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedNgo(null); setActionType(null); }}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
                aria-label="Close review dialog"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {actionType ? (
                <form onSubmit={handleExecuteStatusUpdate}>
                  <div
                    style={{
                      padding: '1rem',
                      border: 'var(--border-medium)',
                      borderRadius: '4px',
                      marginBottom: '1.25rem',
                      backgroundColor:
                        actionType === 'APPROVE'
                          ? '#ECFDF5'
                          : actionType === 'REJECT'
                          ? '#FEE2E2'
                          : '#FEF3C7'
                    }}
                  >
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, margin: 0, marginBottom: '0.35rem' }}>
                      Confirm Action: {actionType}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151' }}>
                      {actionType === 'APPROVE'
                        ? 'Approving this organization will publish it to the verified directory with the "Verified by Impact Bridge" badge.'
                        : actionType === 'NEEDS_INFO'
                        ? 'Notify the representative to upload missing certificates or submit clarifications.'
                        : 'Reject this application. Please provide the reason.'}
                    </p>
                  </div>

                  {message && (
                    <div style={{ backgroundColor: '#D1FAE5', border: '1.5px solid #059669', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: '#064E3B', fontWeight: 700, marginBottom: '1rem' }}>
                      {message}
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="nb-label" htmlFor="admin-action-note">
                      Reviewer Note {actionType !== 'APPROVE' ? '*' : '(Optional)'}
                    </label>
                    <textarea
                      id="admin-action-note"
                      required={actionType !== 'APPROVE'}
                      rows="4"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder={actionType === 'APPROVE' ? 'Internal audit clearance note...' : 'Explain what information is required or reason for rejection...'}
                      className="nb-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <Button
                      type="button"
                      variant="white"
                      size="sm"
                      icon={ArrowLeft}
                      onClick={() => setActionType(null)}
                      disabled={submitting}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant={actionType === 'APPROVE' ? 'green' : actionType === 'REJECT' ? 'danger' : 'yellow'}
                      size="sm"
                      icon={actionType === 'APPROVE' ? CheckCircle2 : actionType === 'REJECT' ? XCircle : AlertTriangle}
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : `Confirm ${actionType}`}
                    </Button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Grid details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ padding: '0.75rem', border: '1.5px solid #E2ECE6', borderRadius: '4px', backgroundColor: '#F8FAF9' }}>
                      <span style={{ fontSize: '0.7rem', color: '#5A6F64', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Registration Number
                      </span>
                      <strong>{selectedNgo.registrationNumber}</strong> ({selectedNgo.ngoType})
                    </div>

                    <div style={{ padding: '0.75rem', border: '1.5px solid #E2ECE6', borderRadius: '4px', backgroundColor: '#F8FAF9' }}>
                      <span style={{ fontSize: '0.7rem', color: '#5A6F64', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Statutory Certificate
                      </span>
                      {selectedNgo.registrationCertificate ? (
                        <a
                          href={selectedNgo.registrationCertificate}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--brand-dark-green)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FileText size={14} />
                          View Certificate Document
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--danger-red)', fontWeight: 700 }}>No document</span>
                      )}
                    </div>

                    <div style={{ padding: '0.75rem', border: '1.5px solid #E2ECE6', borderRadius: '4px', backgroundColor: '#F8FAF9' }}>
                      <span style={{ fontSize: '0.7rem', color: '#5A6F64', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Representative
                      </span>
                      <strong>{selectedNgo.authorizedRepresentative}</strong> ({selectedNgo.contactEmail})
                    </div>

                    <div style={{ padding: '0.75rem', border: '1.5px solid #E2ECE6', borderRadius: '4px', backgroundColor: '#F8FAF9' }}>
                      <span style={{ fontSize: '0.7rem', color: '#5A6F64', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Location
                      </span>
                      <strong>{selectedNgo.address}, {selectedNgo.city}, {selectedNgo.state}</strong>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
                      Description
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
                      {selectedNgo.description}
                    </p>
                  </div>

                  {selectedNgo.adminReview?.reviewNotes && (
                    <div style={{ backgroundColor: '#FEF3C7', border: '1.5px solid #D97706', padding: '0.75rem', borderRadius: '4px', fontSize: '0.84rem' }}>
                      <strong>Prior Review Notes:</strong> {selectedNgo.adminReview.reviewNotes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1.5px solid #E2ECE6', paddingTop: '1rem', flexWrap: 'wrap' }}>
                    <Button variant="green" size="sm" icon={CheckCircle2} onClick={() => handleOpenReview(selectedNgo, 'APPROVE')}>
                      Approve
                    </Button>
                    <Button variant="yellow" size="sm" icon={AlertTriangle} onClick={() => handleOpenReview(selectedNgo, 'NEEDS_INFO')}>
                      Request Info
                    </Button>
                    <Button variant="danger" size="sm" icon={XCircle} onClick={() => handleOpenReview(selectedNgo, 'REJECT')}>
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
