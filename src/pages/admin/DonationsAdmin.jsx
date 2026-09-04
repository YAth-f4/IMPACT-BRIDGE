import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  Search,
  Plus,
  Eye,
  Download,
  Filter,
  ShieldCheck,
  Calendar,
  DollarSign,
  Printer,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function DonationsAdmin() {
  const { donations, addDonation, ngoProfile, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewTab, setViewTab] = useState('ledger'); // 'ledger' | 'analytics'

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [receiptModalDonation, setReceiptModalDonation] = useState(null);

  // Form State for Offline Donation
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: 25000,
    purpose: 'Education Kit & STEM Lab',
    paymentMethod: 'Cheque / Bank Draft',
    donorType: 'Individual Philanthropist',
    panNumber: '',
    message: ''
  });

  // Financial Metrics
  const totalAmount = donations.reduce((acc, d) => acc + (d.amount || 0), 0) + 17500000;
  const monthlyAmount = 1650000;
  const avgAmount = Math.round(totalAmount / (donations.length + 240));
  const uniqueDonors = donations.length + 180;

  const purposes = [
    'All',
    'Education Kit & Smart Lab',
    'Poshan Community Meals',
    'Mobile Primary Healthcare Van',
    'Women Handloom Artisans Grant',
    'Emergency Flood Relief Preps'
  ];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.taxExempt80G && d.taxExempt80G.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPurpose = purposeFilter === 'All' || d.purpose.includes(purposeFilter) || purposeFilter.includes(d.purpose);
    const matchesStatus = statusFilter === 'All' || d.paymentStatus === statusFilter;

    return matchesSearch && matchesPurpose && matchesStatus;
  });

  const handleSaveOfflineDonation = (e) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amount) {
      addToast('Donor Name and Amount are required', 'error');
      return;
    }
    addDonation(formData);
    setCreateModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ReceiptID,DonorName,Email,Amount,Date,Purpose,PaymentMethod,PAN']
        .concat(
          donations.map(
            (d) =>
              `"${d.taxExempt80G || d.id}","${d.donorName}","${d.email}","${d.amount}","${d.date}","${d.purpose}","${d.paymentMethod}","${d.panNumber || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `impact_bridge_donations_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Donations ledger exported to CSV successfully!', 'success');
  };

  return (
    <div className="donations-admin" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP STATS CARDS */}
      <div className="grid-4">
        <StatCard
          title="Total Donations Raised"
          value={formatCurrency(totalAmount, true)}
          subtitle="100% Tax Deductible (80G)"
          icon={CreditCard}
          variant="green"
          trend={{ value: '+22% YoY', isPositive: true }}
        />
        <StatCard
          title="Monthly Donations"
          value={formatCurrency(monthlyAmount)}
          subtitle="Target: ₹20,00,000"
          icon={TrendingUp}
          variant="yellow"
          trend={{ value: '82.5% of Goal', isPositive: true }}
        />
        <StatCard
          title="Average Ticket Size"
          value={formatCurrency(avgAmount)}
          subtitle="Across all channels"
          icon={DollarSign}
          variant="lightgreen"
        />
        <StatCard
          title="Total Donor Community"
          value={formatNumber(uniqueDonors)}
          subtitle="Retaining 84% donors"
          icon={ShieldCheck}
          variant="default"
        />
      </div>

      {/* 2. ACTIONS & VIEW TOGGLE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewTab('ledger')}
            style={{
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: '2px solid #000',
              borderRadius: '4px',
              backgroundColor: viewTab === 'ledger' ? 'var(--brand-dark-green)' : '#FFFFFF',
              color: viewTab === 'ledger' ? '#FFFFFF' : '#000000',
              boxShadow: viewTab === 'ledger' ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
              cursor: 'pointer'
            }}
          >
            📋 Donation Ledger
          </button>
          <button
            onClick={() => setViewTab('analytics')}
            style={{
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: '2px solid #000',
              borderRadius: '4px',
              backgroundColor: viewTab === 'analytics' ? 'var(--brand-dark-green)' : '#FFFFFF',
              color: viewTab === 'analytics' ? '#FFFFFF' : '#000000',
              boxShadow: viewTab === 'analytics' ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
              cursor: 'pointer'
            }}
          >
            📊 Inflow Analytics
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="white" size="sm" icon={Download} onClick={handleExportCSV}>
            Export Audit Ledger
          </Button>
          <Button variant="yellow" size="sm" icon={Plus} onClick={() => setCreateModalOpen(true)}>
            Record Offline Donation
          </Button>
        </div>
      </div>

      {/* 3. MAIN LEDGER VIEW */}
      {viewTab === 'ledger' && (
        <>
          {/* Search & Filter Bar */}
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
                placeholder="Search donor, receipt #, or purpose..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 0 }}
              />

              <Select
                label=""
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                options={purposes.map((p) => ({ value: p, label: `Purpose: ${p}` }))}
                style={{ marginBottom: 0 }}
              />

              <Select
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Processing', label: 'Processing' }
                ]}
                style={{ marginBottom: 0 }}
              />
            </div>
          </Card>

          {/* Ledger Table */}
          <div className="nb-table-container">
            <table className="nb-table">
              <thead>
                <tr>
                  <th>80G Receipt ID</th>
                  <th>Donor / Corporate Entity</th>
                  <th>Amount</th>
                  <th>Purpose / Project</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                      No donations found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.82rem', color: 'var(--brand-dark-green)' }}>
                          {d.taxExempt80G || d.id}
                        </span>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{d.donorName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#5A6F64' }}>{d.email}</div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--brand-dark-green)' }}>
                          {formatCurrency(d.amount)}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {d.purpose}
                      </td>

                      <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {d.paymentMethod}
                      </td>

                      <td style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5A6F64' }}>
                        {formatDate(d.date)}
                      </td>

                      <td>
                        <Badge variant={d.paymentStatus === 'Completed' ? 'green' : 'yellow'} size="sm">
                          {d.paymentStatus}
                        </Badge>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setReceiptModalDonation(d)}
                          className="nb-btn nb-btn-lightgreen nb-btn-sm"
                          style={{ padding: '4px 6px' }}
                          title="View Official 80G Receipt"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 4. ANALYTICS VIEW */}
      {viewTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
          <BarChart
            title="Monthly Donation Run-Rate (INR ₹)"
            subtitle="Current Fiscal Year 2025-2026 vs Previous"
            data={[
              { label: 'Oct', value: 1150000, secondaryValue: 850000 },
              { label: 'Nov', value: 1420000, secondaryValue: 980000 },
              { label: 'Dec', value: 1890000, secondaryValue: 1250000 },
              { label: 'Jan', value: 1540000, secondaryValue: 1100000 },
              { label: 'Feb', value: 1650000, secondaryValue: 1200000 },
              { label: 'Mar', value: 1980000, secondaryValue: 1450000 }
            ]}
            height={280}
            hasSecondary={true}
            primaryLabel="FY 25-26"
            secondaryLabel="FY 24-25"
          />

          <DonutChart
            title="Funds by Project Purpose"
            subtitle="Allocation Breakdown"
            data={[
              { label: 'Child Education', value: 40, color: '#2E7D5B' },
              { label: 'Mobile Healthcare', value: 25, color: '#F4B942' },
              { label: 'Community Meals', value: 20, color: '#3A86FF' },
              { label: 'Flood Resilience', value: 15, color: '#E63946' }
            ]}
            height={280}
          />
        </div>
      )}

      {/* 5. RECORD OFFLINE DONATION MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Record Offline Donation / Grant"
        maxWidth="580px"
        footer={
          <>
            <Button variant="white" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" onClick={handleSaveOfflineDonation}>Record & Issue 80G</Button>
          </>
        }
      >
        <form onSubmit={handleSaveOfflineDonation}>
          <div className="grid-2">
            <Input
              label="Donor / Company Name"
              required
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Amount (INR ₹)"
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
            <Select
              label="Payment Channel"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={[
                { value: 'Cheque / Bank Draft', label: 'Cheque / Bank Draft' },
                { value: 'Corporate CSR Direct Wire', label: 'Corporate CSR Direct Wire (NEFT/RTGS)' },
                { value: 'Cash Receipt', label: 'Cash Receipt' },
                { value: 'Direct Foreign Inward (FCRA)', label: 'Foreign Inward Remittance (FCRA)' }
              ]}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Donor PAN Card Number"
              placeholder="e.g. ABCPS1234F"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
            />
            <Select
              label="Program Purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              options={[
                { value: 'Education Kit & STEM Lab', label: 'Education Kit & STEM Lab' },
                { value: 'Poshan Community Meals', label: 'Poshan Community Meals' },
                { value: 'Mobile Primary Healthcare Van', label: 'Mobile Primary Healthcare Van' },
                { value: 'Women Handloom Artisans Grant', label: 'Women Handloom Artisans Grant' },
                { value: 'Emergency Flood Relief Preps', label: 'Emergency Flood Relief Preps' }
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* 6. VIEW 80G RECEIPT MODAL */}
      {receiptModalDonation && (
        <Modal
          isOpen={!!receiptModalDonation}
          onClose={() => setReceiptModalDonation(null)}
          title="Audited 80G Tax Exemption Certificate"
          maxWidth="640px"
          footer={
            <>
              <Button variant="white" icon={Printer} onClick={() => window.print()}>
                Print
              </Button>
              <Button
                variant="yellow"
                icon={Download}
                onClick={() => {
                  addToast('Official 80G Certificate PDF downloaded!', 'success');
                  setReceiptModalDonation(null);
                }}
              >
                Download PDF
              </Button>
            </>
          }
        >
          <div style={{ padding: '1.5rem', backgroundColor: '#FAFCFA', border: '2px solid #000', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.25rem' }}>
                  {ngoProfile.name}
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#5A6F64', fontWeight: 600 }}>
                  PAN: {ngoProfile.panNumber} • 80G Reg: {ngoProfile.tax80GNumber}
                </p>
              </div>
              <Badge variant="green" size="sm">FORM 10BE COMPLIANT</Badge>
            </div>

            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Receipt Ref No:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{receiptModalDonation.taxExempt80G || receiptModalDonation.id}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Donor Name:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{receiptModalDonation.donorName}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Donor PAN:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{receiptModalDonation.panNumber || 'ABCPS1234F'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Payment Mode:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{receiptModalDonation.paymentMethod}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', fontWeight: 700, color: '#5A6F64' }}>Purpose / Project:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{receiptModalDonation.purpose}</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <td style={{ padding: '10px 0', fontWeight: 900, fontSize: '1rem' }}>TOTAL AMOUNT RECEIVED:</td>
                  <td style={{ padding: '10px 0', fontWeight: 900, fontSize: '1.25rem', textAlign: 'right', color: 'var(--brand-dark-green)' }}>
                    {formatCurrency(receiptModalDonation.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
