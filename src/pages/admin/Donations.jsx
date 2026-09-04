import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Tabs from '../../components/common/Tabs';
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
  Printer
} from 'lucide-react';

export default function Donations() {
  const { donations, addDonation, ngoProfile, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [offlineForm, setOfflineForm] = useState({
    donorName: '',
    email: '',
    phone: '',
    panNumber: '',
    amount: 10000,
    purpose: 'Education Kit & STEM Lab',
    paymentMethod: 'Corporate CSR Direct NEFT Wire',
    donorType: 'Corporate CSR Partner'
  });

  const totalFunds = donations.reduce((acc, d) => acc + (d.amount || 0), 0) + 17500000;
  const directDonorsCount = donations.length + 840;

  const purposes = ['All', ...Array.from(new Set(donations.map((d) => d.purpose)))];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.taxExempt80G && d.taxExempt80G.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPurpose = purposeFilter === 'All' || d.purpose === purposeFilter;
    const matchesMethod = methodFilter === 'All' || d.paymentMethod.includes(methodFilter);

    return matchesSearch && matchesPurpose && matchesMethod;
  });

  const handleRecordOffline = (e) => {
    e.preventDefault();
    if (!offlineForm.donorName || !offlineForm.amount) return;

    addDonation({
      ...offlineForm,
      amount: Number(offlineForm.amount)
    });
    setRecordModalOpen(false);
  };

  const handleViewReceipt = (d) => {
    setSelectedDonation(d);
    setReceiptModalOpen(true);
  };

  const handleExportLedgerCSV = () => {
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

        <div style={{ display: 'flex', gap: '0.75rem' }}>
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
          { id: 'ledger', label: '1. Donation Ledger', icon: CreditCard, count: donations.length },
          { id: 'analytics', label: '2. Inflow Analytics', icon: TrendingUp }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: LEDGER */}
      {activeTab === 'ledger' && (
        <>
          {/* Filters */}
          <Card style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                placeholder="Search donor, email, 80G receipt..."
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
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'Method: All Channels' },
                  { value: 'UPI', label: 'UPI' },
                  { value: 'CSR', label: 'Corporate CSR Wire' },
                  { value: 'Net Banking', label: 'Net Banking' }
                ]}
                style={{ marginBottom: 0 }}
              />
            </div>
          </Card>

          {/* Table */}
          <Card style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--white)' }}>
            <div className="nb-table-container">
              <table className="nb-table">
                <thead>
                  <tr>
                    <th>Donor Details</th>
                    <th>80G Receipt Number</th>
                    <th>Intervention Program</th>
                    <th>Amount (INR)</th>
                    <th>Payment Channel</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{d.donorName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#5A6F64' }}>
                            {d.email} {d.panNumber && `• PAN: ${d.panNumber}`}
                          </div>
                        </div>
                      </td>

                      <td>
                        <Badge variant="yellow" size="sm">{d.taxExempt80G}</Badge>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d.purpose}</span>
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
          </Card>
        </>
      )}

      {/* TAB 2: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
          <BarChart
            title="Quarterly Inflow vs Utilization (INR ₹)"
            subtitle="Comparing Incoming Grants vs Ground Program Deployments"
            data={[
              { label: 'Q1', value: 4200000, secondaryValue: 3800000 },
              { label: 'Q2', value: 4900000, secondaryValue: 4400000 },
              { label: 'Q3', value: 5800000, secondaryValue: 5200000 },
              { label: 'Q4', value: 6500000, secondaryValue: 5900000 }
            ]}
            isCurrency={true}
            hasSecondary={true}
            primaryLabel="Funds Raised"
            secondaryLabel="Funds Deployed"
            height={280}
          />

          <DonutChart
            title="Donor Segmentation"
            subtitle="Distribution by Contributor Type"
            data={[
              { label: 'Corporate CSR', value: 55, color: '#2E7D5B' },
              { label: 'Individual Donors', value: 28, color: '#F4B942' },
              { label: 'Foundations', value: 12, color: '#3A86FF' },
              { label: 'HNIs / Major', value: 5, color: '#A8D5BA' }
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
            <Button variant="white" onClick={() => setRecordModalOpen(false)}>Cancel</Button>
            <Button variant="yellow" icon={Plus} onClick={handleRecordOffline}>Record & Generate 80G</Button>
          </>
        }
      >
        <form onSubmit={handleRecordOffline}>
          <div className="grid-2">
            <Input
              label="Donor / Company Legal Name"
              required
              value={offlineForm.donorName}
              onChange={(e) => setOfflineForm({ ...offlineForm, donorName: e.target.value })}
            />
            <Input
              label="Donor Email"
              type="email"
              required
              value={offlineForm.email}
              onChange={(e) => setOfflineForm({ ...offlineForm, email: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Amount in INR (₹)"
              type="number"
              required
              value={offlineForm.amount}
              onChange={(e) => setOfflineForm({ ...offlineForm, amount: Number(e.target.value) })}
            />
            <Input
              label="Donor PAN Card"
              value={offlineForm.panNumber}
              onChange={(e) => setOfflineForm({ ...offlineForm, panNumber: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="grid-2">
            <Select
              label="Purpose"
              value={offlineForm.purpose}
              onChange={(e) => setOfflineForm({ ...offlineForm, purpose: e.target.value })}
              options={[
                { value: 'Education Kit & STEM Lab', label: 'Education Kit & STEM Lab' },
                { value: 'Poshan Community Meals', label: 'Poshan Community Meals' },
                { value: 'Mobile Primary Healthcare Van', label: 'Mobile Primary Healthcare Van' },
                { value: 'Women Handloom Artisans Grant', label: 'Women Handloom Artisans Grant' },
                { value: 'Emergency Flood Relief Preps', label: 'Emergency Flood Relief Preps' }
              ]}
            />
            <Select
              label="Payment Method"
              value={offlineForm.paymentMethod}
              onChange={(e) => setOfflineForm({ ...offlineForm, paymentMethod: e.target.value })}
              options={[
                { value: 'Corporate CSR Direct NEFT Wire', label: 'Corporate CSR Direct NEFT Wire' },
                { value: 'Cheque / Demand Draft', label: 'Cheque / Demand Draft' },
                { value: 'Direct Bank Wire (RTGS)', label: 'Direct Bank Wire (RTGS)' }
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* 80G RECEIPT VIEWER MODAL */}
      {selectedDonation && (
        <Modal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          title="Section 80G Tax Exemption Certificate"
          maxWidth="640px"
          footer={
            <>
              <Button variant="white" icon={Printer} onClick={() => window.print()}>
                Print Certificate
              </Button>
              <Button
                variant="yellow"
                icon={Download}
                onClick={() => {
                  addToast('80G Receipt PDF downloaded.', 'success');
                  setReceiptModalOpen(false);
                }}
              >
                Download PDF
              </Button>
            </>
          }
        >
          <div style={{ padding: '1.5rem', backgroundColor: '#FAFCFA', border: '2px solid #000', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.25rem' }}>{ngoProfile.name}</h3>
                <p style={{ fontSize: '0.72rem', color: '#5A6F64' }}>PAN: {ngoProfile.panNumber} • 80G Order: {ngoProfile.tax80GNumber}</p>
              </div>
              <Badge variant="green" size="sm">{selectedDonation.taxExempt80G}</Badge>
            </div>

            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', color: '#5A6F64' }}>Donor:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{selectedDonation.donorName}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', color: '#5A6F64' }}>PAN:</td>
                  <td style={{ padding: '6px 0', fontWeight: 800, textAlign: 'right' }}>{selectedDonation.panNumber || 'N/A'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2ECE6' }}>
                  <td style={{ padding: '6px 0', color: '#5A6F64' }}>Amount:</td>
                  <td style={{ padding: '6px 0', fontWeight: 900, fontSize: '1.1rem', color: 'var(--brand-dark-green)', textAlign: 'right' }}>
                    {formatCurrency(selectedDonation.amount)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#5A6F64' }}>Program:</td>
                  <td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right' }}>{selectedDonation.purpose}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
