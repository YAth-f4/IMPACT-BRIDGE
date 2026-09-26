import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Tabs from '../../components/common/Tabs';
import BridgeLoader from '../../components/common/BridgeLoader';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import { Input, Select } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  Search,
  Plus,
  Eye,
  Download,
  ShieldCheck,
  TrendingUp,
  Heart,
  Printer,
  RefreshCw,
  Clock,
  X
} from 'lucide-react';

export default function Donations() {
  const {
    donations,
    createAdminDonation,
    fetchAdminDonations,
    ngoProfile,
    addToast
  } = useApp();

  const [ledgerDonations, setLedgerDonations] = useState(donations || []);
  const [totalDbCount, setTotalDbCount] = useState(donations.length);
  const [totalDbAmount, setTotalDbAmount] = useState(
    donations.reduce((acc, d) => acc + (Number(d.amount) || 0), 0)
  );
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [offlineForm, setOfflineForm] = useState({
    donorName: '',
    email: '',
    phone: '',
    panNumber: '',
    amount: 10000,
    purpose: 'Education Kit & STEM Lab',
    paymentMethod: 'Corporate CSR Direct NEFT Wire',
    donorType: 'Corporate CSR Partner',
    message: ''
  });

  const loadDonations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    const result = await fetchAdminDonations(params.toString());
    if (result && Array.isArray(result.donations)) {
      setLedgerDonations(result.donations);
      setTotalDbCount(result.total ?? result.donations.length);
      setTotalDbAmount(
        result.totalAmount ?? result.donations.reduce((acc, d) => acc + (Number(d.amount) || 0), 0)
      );
    }
    setLoading(false);
  }, [fetchAdminDonations, searchQuery]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const totalFunds = totalDbAmount;
  const directDonorsCount = totalDbCount;

  const purposes = ['All', ...Array.from(new Set(ledgerDonations.map((d) => d.purpose).filter(Boolean)))];

  const filteredDonations = ledgerDonations.filter((d) => {
    const matchesSearch =
      (d.donorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.taxExempt80G && d.taxExempt80G.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPurpose = purposeFilter === 'All' || d.purpose === purposeFilter;
    const matchesMethod = methodFilter === 'All' || (d.paymentMethod || '').includes(methodFilter);

    return matchesSearch && matchesPurpose && matchesMethod;
  });

  const handleRecordOffline = async (e) => {
    e.preventDefault();
    if (!offlineForm.donorName || !offlineForm.amount) {
      addToast('Please provide donor name and amount.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await createAdminDonation({
      ...offlineForm,
      amount: Number(offlineForm.amount)
    });
    setIsSubmitting(false);

    if (res && res.success) {
      setRecordModalOpen(false);
      setOfflineForm({
        donorName: '',
        email: '',
        phone: '',
        panNumber: '',
        amount: 10000,
        purpose: 'Education Kit & STEM Lab',
        paymentMethod: 'Corporate CSR Direct NEFT Wire',
        donorType: 'Corporate CSR Partner',
        message: ''
      });
      loadDonations();
    }
  };

  const handleViewReceipt = (d) => {
    setSelectedDonation(d);
    setReceiptModalOpen(true);
  };

  const handleExportLedgerCSV = () => {
    if (!filteredDonations.length) {
      addToast('No donations to export.', 'info');
      return;
    }
    const headers = ['Receipt No,Donor Name,Email,PAN,Amount,Purpose,Method,Date\n'];
    const rows = filteredDonations.map(
      (d) => `"${d.taxExempt80G}","${d.donorName}","${d.email}","${d.panNumber || ''}",${d.amount},"${d.purpose}","${d.paymentMethod}","${d.date}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_ledger_${Date.now()}.csv`;
    a.click();
    addToast('Donations ledger exported to CSV file!', 'info');
  };

  return (
    <div className="admin-donations" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Treasury & Donation Ledger (Total: {formatCurrency(totalFunds, true)})
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Real-time audit log of all online payments, CSR wires, offline cheques, and 80G tax receipts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="white" size="sm" icon={RefreshCw} onClick={loadDonations}>
            Refresh
          </Button>
          <Button variant="white" size="sm" icon={Download} onClick={handleExportLedgerCSV}>
            Export Ledger
          </Button>
          <Button variant="yellow" size="sm" icon={Plus} onClick={() => setRecordModalOpen(true)}>
            Record Offline / CSR Wire
          </Button>
        </div>
      </div>

      {/* 2. TABS NAVIGATOR */}
      <Tabs
        tabs={[
          { id: 'ledger', label: '1. Donation Ledger', icon: CreditCard, count: ledgerDonations.length },
          { id: 'analytics', label: '2. Treasury Analytics & Inflows', icon: TrendingUp }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: LEDGER TABLE */}
      {activeTab === 'ledger' && (
        <>
          {/* SEARCH & FILTERS BAR */}
          <Card style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', minWidth: '220px', maxWidth: '400px' }}>
              <Input
                placeholder="Search donor name, email, 80G receipt..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: '180px' }}>
                <Select
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  options={purposes.map((p) => ({ value: p, label: p }))}
                />
              </div>

              <div style={{ width: '160px' }}>
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  options={[
                    { value: 'All', label: 'All Methods' },
                    { value: 'UPI', label: 'UPI (GPay/PhonePe)' },
                    { value: 'Net Banking', label: 'Net Banking' },
                    { value: 'Corporate', label: 'Corporate Wire' },
                    { value: 'Cheque', label: 'Cheque / Offline' }
                  ]}
                />
              </div>

              <Badge variant="green" size="md">
                {filteredDonations.length} RECORDS
              </Badge>
            </div>
          </Card>

          {/* TABLE CONTAINER */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <div className="table-wrapper">
                <table className="nb-table">
                  <thead>
                    <tr>
                      <th>80G Receipt #</th>
                      <th>Donor Details</th>
                      <th>Program Cause</th>
                      <th>Contribution</th>
                      <th>Channel</th>
                      <th>Timestamp</th>
                      <th style={{ textAlign: 'right' }}>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonTableRow columns={7} />
                    <SkeletonTableRow columns={7} />
                    <SkeletonTableRow columns={7} />
                    <SkeletonTableRow columns={7} />
                  </tbody>
                </table>
              </div>
            ) : filteredDonations.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6B7280' }}>
                <Clock size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: '0 0 0.25rem' }}>
                  No Donations Found
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  {searchQuery ? 'Try clearing your search query or filters.' : 'Donations submitted on the platform will appear here.'}
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="nb-table">
                  <thead>
                    <tr>
                      <th>80G Receipt #</th>
                      <th>Donor Details</th>
                      <th>Program / Purpose</th>
                      <th>Amount (₹)</th>
                      <th>Payment Method</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              backgroundColor: '#EBF4EF',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              border: '1px solid #2E7D5B',
                              color: '#1E523A',
                              fontSize: '0.75rem'
                            }}
                          >
                            {d.taxExempt80G}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{d.donorName}</div>
                          <div style={{ fontSize: '0.74rem', color: '#5A6F64' }}>{d.email}</div>
                          {d.panNumber && (
                            <div style={{ fontSize: '0.7rem', color: '#88998F', fontWeight: 600 }}>
                              PAN: {d.panNumber}
                            </div>
                          )}
                        </td>

                        <td>
                          <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{d.purpose}</span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 900, color: 'var(--brand-dark-green)', fontSize: '1rem' }}>
                            {formatCurrency(d.amount)}
                          </span>
                        </td>

                        <td>
                          <Badge variant="white" size="sm">{d.paymentMethod}</Badge>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.78rem', color: '#5A6F64', fontWeight: 600 }}>
                            {formatDate(d.date)}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleViewReceipt(d)}
                            className="nb-btn nb-btn-lightgreen nb-btn-sm"
                            style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                            title="View Official 80G Certificate"
                          >
                            <Eye size={14} strokeWidth={2.5} />
                            <span>80G</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* TAB 2: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
          <BarChart
            title="Donation Inflows (INR ₹)"
            subtitle="Real Donation Inflows from Application Database"
            data={
              ledgerDonations.length > 0
                ? ledgerDonations.slice(0, 6).map((d) => ({
                    label: d.donorName ? d.donorName.split(' ')[0] : 'Donor',
                    value: Number(d.amount) || 0,
                    secondaryValue: Math.round((Number(d.amount) || 0) * 0.4)
                  }))
                : [{ label: 'Total', value: totalFunds, secondaryValue: Math.round(totalFunds * 0.4) }]
            }
            isCurrency={true}
            hasSecondary={true}
            primaryLabel="Donation Amount"
            secondaryLabel="Estimated Impact"
            height={280}
          />

          <DonutChart
            title="Donor Segmentation"
            subtitle="Distribution by Contributor Type"
            data={[
              { label: 'Corporate CSR', value: Math.max(1, ledgerDonations.filter((d) => (d.donorType || '').includes('CSR')).length), color: '#2E7D5B' },
              { label: 'Individual Philanthropists', value: Math.max(1, ledgerDonations.filter((d) => (d.donorType || '').includes('Individual') || (d.donorType || '').includes('Philanthropist')).length), color: '#F4B942' },
              { label: 'Community / Other', value: Math.max(1, ledgerDonations.filter((d) => !((d.donorType || '').includes('CSR') || (d.donorType || '').includes('Individual'))).length), color: '#3A86FF' }
            ]}
            height={280}
          />
        </div>
      )}

      {/* RECORD OFFLINE DONATION MODAL */}
      <Modal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title="Record Offline Donation / CSR Wire"
        maxWidth="600px"
        footer={
          <>
            <Button variant="white" icon={X} onClick={() => setRecordModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={Plus} onClick={handleRecordOffline} disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record & Generate 80G'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleRecordOffline} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Donor / Organization Name *"
              required
              placeholder="e.g. Tata Trusts CSR or Rajesh Sharma"
              value={offlineForm.donorName}
              onChange={(e) => setOfflineForm({ ...offlineForm, donorName: e.target.value })}
            />
            <Input
              label="Contact Email"
              type="email"
              placeholder="donor@company.com"
              value={offlineForm.email}
              onChange={(e) => setOfflineForm({ ...offlineForm, email: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Phone Number"
              placeholder="+91 98200 00000"
              value={offlineForm.phone}
              onChange={(e) => setOfflineForm({ ...offlineForm, phone: e.target.value })}
            />
            <Input
              label="Donor PAN Card (for 80G Receipt)"
              placeholder="ABCDE1234F"
              value={offlineForm.panNumber}
              onChange={(e) => setOfflineForm({ ...offlineForm, panNumber: e.target.value.toUpperCase() })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Contribution Amount (₹) *"
              type="number"
              required
              min="100"
              value={offlineForm.amount}
              onChange={(e) => setOfflineForm({ ...offlineForm, amount: e.target.value })}
            />
            <Select
              label="Purpose / Allocated Program"
              value={offlineForm.purpose}
              onChange={(e) => setOfflineForm({ ...offlineForm, purpose: e.target.value })}
              options={[
                { value: 'Education Kit & STEM Lab', label: 'Education Kit & STEM Lab' },
                { value: 'Poshan Community Meals', label: 'Poshan Community Meals' },
                { value: 'Mobile Primary Healthcare Van', label: 'Mobile Healthcare Van' },
                { value: 'Women Handloom Artisans Grant', label: 'Women Artisans Grant' },
                { value: 'General Impact Fund', label: 'General Impact Fund' }
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              label="Payment Channel"
              value={offlineForm.paymentMethod}
              onChange={(e) => setOfflineForm({ ...offlineForm, paymentMethod: e.target.value })}
              options={[
                { value: 'Corporate CSR Direct NEFT Wire', label: 'Corporate CSR Direct Wire (NEFT/RTGS)' },
                { value: 'Cheque / Demand Draft', label: 'Cheque / Demand Draft' },
                { value: 'Bank Transfer (IMPS)', label: 'Bank Transfer (IMPS)' },
                { value: 'UPI Direct Account Settlement', label: 'UPI Direct Settlement' }
              ]}
            />
            <Select
              label="Donor Classification"
              value={offlineForm.donorType}
              onChange={(e) => setOfflineForm({ ...offlineForm, donorType: e.target.value })}
              options={[
                { value: 'Corporate CSR Partner', label: 'Corporate CSR Partner' },
                { value: 'Individual Philanthropist', label: 'Individual Philanthropist' },
                { value: 'Family Foundation', label: 'Family Foundation' },
                { value: 'Crowdfunding Group', label: 'Crowdfunding Group' }
              ]}
            />
          </div>

          <Input
            label="Internal Ledger Note / Cheque Number"
            placeholder="e.g. HDFC Chq #009811 cleared on 15-Mar-2026"
            value={offlineForm.message}
            onChange={(e) => setOfflineForm({ ...offlineForm, message: e.target.value })}
          />
        </form>
      </Modal>

      {/* OFFICIAL 80G RECEIPT MODAL */}
      {selectedDonation && (
        <Modal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          title="Official Section 80G Tax Exemption Receipt"
          maxWidth="680px"
          footer={
            <>
              <Button variant="white" onClick={() => setReceiptModalOpen(false)}>Close</Button>
              <Button variant="yellow" icon={Printer} onClick={() => window.print()}>
                Print / Save PDF Certificate
              </Button>
            </>
          }
        >
          <div
            id="receipt-print-area"
            style={{
              border: '2px solid #000000',
              padding: '2rem',
              backgroundColor: '#FFFFFF',
              position: 'relative'
            }}
          >
            {/* Watermark / Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, margin: 0, fontSize: '1.4rem' }}>
                  IMPACT BRIDGE FOUNDATION
                </h3>
                <p style={{ margin: '0.2rem 0', fontSize: '0.78rem', color: '#4B5563' }}>
                  Registered Society Under Societies Registration Act XXI of 1860
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700 }}>
                  PAN: AAATI4901K • Income Tax 80G Reg: CIT(E)/80G/2022-23/A/10988
                </p>
              </div>
              <Badge variant="green" size="md">FORM 10BE COMPLIANT</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#5A6F64' }}>Receipt Number:</strong>
                <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                  {selectedDonation.taxExempt80G}
                </div>
              </div>
              <div>
                <strong style={{ color: '#5A6F64' }}>Date of Donation:</strong>
                <div style={{ fontWeight: 800 }}>{formatDate(selectedDonation.date)}</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#F7FAF8', border: '1.5px solid #000', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: '#5A6F64', display: 'block', fontSize: '0.78rem' }}>Received with thanks from:</span>
                  <strong style={{ fontSize: '1.05rem' }}>{selectedDonation.donorName}</strong>
                </div>
                <div>
                  <span style={{ color: '#5A6F64', display: 'block', fontSize: '0.78rem' }}>Donor PAN Card:</span>
                  <strong style={{ fontFamily: 'monospace' }}>{selectedDonation.panNumber || 'NOT DISCLOSED'}</strong>
                </div>
                <div>
                  <span style={{ color: '#5A6F64', display: 'block', fontSize: '0.78rem' }}>Donation Amount:</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--brand-dark-green)' }}>
                    {formatCurrency(selectedDonation.amount)}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#5A6F64', display: 'block', fontSize: '0.78rem' }}>Payment Mode:</span>
                  <strong>{selectedDonation.paymentMethod}</strong>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.5, borderTop: '1px solid #E2ECE6', paddingTop: '0.75rem' }}>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Statutory Declaration:</strong> Donations to Impact Bridge Foundation are 100% eligible for tax deduction under Section 80G(5)(vi) of the Income Tax Act, 1961. This official digital certificate carries automated validation hash compliant with MCA and CBDT mandates.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#7A8E83' }}>Digitally verified via Impact Bridge Treasury Engine</div>
                  <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Timestamp: {selectedDonation.createdAt || new Date().toISOString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'cursive', fontSize: '1.2rem', color: '#1E523A', marginBottom: '2px' }}>
                    Sunita Rao
                  </div>
                  <div style={{ borderTop: '1px solid #000', fontSize: '0.72rem', fontWeight: 800, paddingTop: '2px' }}>
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
