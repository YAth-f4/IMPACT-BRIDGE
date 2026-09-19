import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BridgeLoader from '../../components/common/BridgeLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Plus,
  X
} from 'lucide-react';

export default function MyNgoSubmissions() {
  const { fetchMyNgos, resubmitNgo } = useApp();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resubmitModal, setResubmitModal] = useState(null);
  const [resubmitNotes, setResubmitNotes] = useState('');
  const [resubmitFile, setResubmitFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetchMyNgos();
      if (res && res.success) {
        setNgos(res.ngos || []);
      }
    } catch (err) {
      console.error('Failed to load my NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResubmit = (ngo) => {
    setResubmitModal(ngo);
    setResubmitNotes('');
    setResubmitFile(null);
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setResubmitFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!resubmitNotes.trim()) {
      alert('Please explain the clarifications or updates made.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        revisionNotes: resubmitNotes,
        ...(resubmitFile && { registrationCertificate: resubmitFile })
      };
      const res = await resubmitNgo(resubmitModal.id, payload);
      if (res && res.success) {
        setMessage('Your revisions have been submitted for admin review!');
        setTimeout(() => {
          setResubmitModal(null);
          loadSubmissions();
        }, 1500);
      } else {
        alert(res?.error || 'Failed to submit revisions');
      }
    } catch (err) {
      alert('An error occurred while submitting revisions.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#D1FAE5',
              color: '#064E3B',
              border: '1.5px solid #065F46',
              borderRadius: 'var(--radius-sm)',
              padding: '0.25rem 0.6rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              boxShadow: '1.5px 1.5px 0px #065F46'
            }}
          >
            <CheckCircle2 size={14} color="#059669" strokeWidth={2.5} />
            Approved & Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              border: '1.5px solid #991B1B',
              borderRadius: 'var(--radius-sm)',
              padding: '0.25rem 0.6rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              boxShadow: '1.5px 1.5px 0px #991B1B'
            }}
          >
            <XCircle size={14} color="#DC2626" strokeWidth={2.5} />
            Application Rejected
          </span>
        );
      case 'NEEDS_INFO':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1.5px solid #92400E',
              borderRadius: 'var(--radius-sm)',
              padding: '0.25rem 0.6rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              boxShadow: '1.5px 1.5px 0px #92400E'
            }}
          >
            <AlertTriangle size={14} color="#D97706" strokeWidth={2.5} />
            Clarification Required
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#FEF9C3',
              color: '#854D0E',
              border: '1.5px solid #854D0E',
              borderRadius: 'var(--radius-sm)',
              padding: '0.25rem 0.6rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              boxShadow: '1.5px 1.5px 0px #854D0E'
            }}
          >
            <Clock size={14} color="#CA8A04" strokeWidth={2.5} />
            Under Review
          </span>
        );
    }
  };

  return (
    <div
      className="my-ngos-page"
      style={{
        backgroundColor: 'var(--bg-offwhite)',
        minHeight: '80vh',
        color: 'var(--text-dark)',
        paddingBottom: '4rem'
      }}
    >
      {/* 1. HEADER HERO */}
      <section
        style={{
          padding: 'clamp(2.5rem, 4vw, 3.5rem) 0',
          backgroundColor: '#FFFFFF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                <Badge variant="lightgreen" size="md">REPRESENTATIVE PORTAL</Badge>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
                  fontWeight: 900,
                  marginBottom: '0.5rem',
                  lineHeight: 1.15
                }}
              >
                My Registered NGOs
              </h1>
              <p style={{ color: '#5A6F64', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
                Track verification status, review admin feedback, and manage your Impact Bridge listings.
              </p>
            </div>

            <Link to="/register-ngo" style={{ textDecoration: 'none' }}>
              <Button variant="yellow" size="md" icon={Plus}>
                Register Another NGO
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SUBMISSIONS LIST */}
      <div className="nb-container" style={{ marginTop: '2.5rem' }}>
        {loading ? (
          <div
            style={{
              minHeight: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem'
            }}
          >
            <BridgeLoader size="lg" label="Loading your registrations..." />
          </div>
        ) : ngos.length === 0 ? (
          <EmptyState
            title="No NGOs Registered Yet"
            description="You haven't submitted any NGO registrations on Impact Bridge. Register your non-profit today to obtain verified badge status."
            onReset={() => {}}
            resetLabel="Start NGO Registration"
            icon={<Building2 size={28} color="#000" strokeWidth={2.5} />}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {ngos.map((ngo) => (
              <Card
                key={ngo.id}
                style={{
                  border: 'var(--border-thick)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                  backgroundColor: 'var(--white)'
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderBottom: 'var(--border-medium)',
                    paddingBottom: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        backgroundColor: 'var(--accent-yellow)',
                        border: '2px solid #000',
                        borderRadius: 'var(--radius-sm)',
                        boxShadow: '2px 2px 0px #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {ngo.logo ? (
                        <img
                          src={ngo.logo}
                          alt={ngo.organizationName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>{ngo.organizationName?.substring(0, 2).toUpperCase() || 'NB'}</span>
                      )}
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          margin: 0,
                          lineHeight: 1.2
                        }}
                      >
                        {ngo.organizationName}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600, marginTop: '2px' }}>
                        Reg No: <span style={{ color: '#000', fontFamily: 'var(--font-mono)' }}>{ngo.registrationNumber}</span> • Submitted {new Date(ngo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>{renderStatusBadge(ngo.status)}</div>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    backgroundColor: '#F8FAF9',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid #E2ECE6'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                      Location
                    </span>
                    <strong style={{ color: '#111827' }}>
                      {ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.address || 'Pan-India'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                      Representative Contact
                    </span>
                    <strong style={{ color: '#111827' }}>
                      {ngo.contactEmail} ({ngo.phone})
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64', display: 'block' }}>
                      Primary Causes
                    </span>
                    <strong style={{ color: '#111827' }}>
                      {ngo.causes?.join(', ') || 'Community Welfare'}
                    </strong>
                  </div>
                </div>

                {/* Admin Review Note Callout */}
                {ngo.adminReview?.reviewNotes && (
                  <div
                    style={{
                      padding: '1rem',
                      border: 'var(--border-medium)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      backgroundColor:
                        ngo.status === 'NEEDS_INFO'
                          ? '#FEF3C7'
                          : ngo.status === 'REJECTED'
                          ? '#FEE2E2'
                          : '#ECFDF5'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        marginBottom: '0.35rem'
                      }}
                    >
                      <FileText size={15} strokeWidth={2.5} />
                      Admin Reviewer Note ({new Date(ngo.adminReview.reviewedAt).toLocaleDateString()})
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1F2937' }}>
                      {ngo.adminReview.reviewNotes}
                    </p>
                  </div>
                )}

                {/* Action Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderTop: '1.5px solid #E2ECE6',
                    paddingTop: '1rem'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#5A6F64' }}>
                    Registration Reference: <strong style={{ color: '#000' }}>{ngo.id}</strong>
                  </span>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {ngo.status === 'APPROVED' && (
                      <Link to={`/ngos/${ngo.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="dark" size="sm" icon={ExternalLink}>
                          View Public Directory Profile
                        </Button>
                      </Link>
                    )}

                    {ngo.status === 'NEEDS_INFO' && (
                      <Button
                        variant="yellow"
                        size="sm"
                        icon={RefreshCw}
                        onClick={() => handleOpenResubmit(ngo)}
                      >
                        Provide Clarification / Resubmit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 3. RESUBMIT MODAL */}
      {resubmitModal && (
        <div className="nb-modal-backdrop">
          <div className="nb-modal-content" style={{ maxWidth: '580px' }}>
            <div className="nb-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={20} strokeWidth={2.5} />
                <h3 style={{ margin: 0 }}>Provide Clarification</h3>
              </div>
              <button
                type="button"
                onClick={() => setResubmitModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleResubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#5A6F64' }}>Organization:</span>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{resubmitModal.organizationName}</strong>
              </div>

              {resubmitModal.adminReview?.reviewNotes && (
                <div
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1.5px solid #D97706',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <strong>Admin Question:</strong> {resubmitModal.adminReview.reviewNotes}
                </div>
              )}

              {message && (
                <div
                  style={{
                    backgroundColor: '#D1FAE5',
                    border: '1.5px solid #059669',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: '#065F46',
                    fontWeight: 700,
                    marginBottom: '1.25rem'
                  }}
                >
                  {message}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="nb-label" htmlFor="resubmit-notes">
                  Clarification / Explanation *
                </label>
                <textarea
                  id="resubmit-notes"
                  required
                  rows="4"
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                  placeholder="Explain the changes made or clarify questions raised by the reviewer..."
                  className="nb-textarea"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="nb-label" htmlFor="resubmit-cert">
                  Updated Certificate (Optional)
                </label>
                <input
                  id="resubmit-cert"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="nb-input"
                  style={{ padding: '0.4rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#5A6F64' }}>
                  PDF, PNG, or JPG under 5MB.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setResubmitModal(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="yellow"
                  size="sm"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Revisions'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
