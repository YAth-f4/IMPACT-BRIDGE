import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp
} from 'lucide-react';

export default function Reports() {
  const { ngoProfile, addToast } = useApp();

  const [timeframe, setTimeframe] = useState('FY 2025-26');
  const [reportType, setReportType] = useState('comprehensive');

  // Quarterly Program Spend Data
  const spendData = [
    { label: 'Q1 (Apr-Jun)', value: 3800000, secondaryValue: 4200000 },
    { label: 'Q2 (Jul-Sep)', value: 4400000, secondaryValue: 4900000 },
    { label: 'Q3 (Oct-Dec)', value: 5200000, secondaryValue: 5800000 },
    { label: 'Q4 (Jan-Mar)', value: 5900000, secondaryValue: 6500000 }
  ];

  // State Impact Distribution Donut
  const stateDonutData = [
    { label: 'Maharashtra', value: 32, color: '#2E7D5B' },
    { label: 'Delhi NCR', value: 24, color: '#F4B942' },
    { label: 'Uttar Pradesh', value: 16, color: '#3A86FF' },
    { label: 'Rajasthan', value: 14, color: '#A8D5BA' },
    { label: 'Assam & NE', value: 14, color: '#E63946' }
  ];

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    addToast('Audited Annual Report PDF generated & downloaded!', 'success');
  };

  return (
    <div className="admin-reports" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. TOP HEADER & ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Audited Impact Analytics & Statutory Reports
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Comprehensive disclosures for Ministry of Corporate Affairs, Income Tax 80G, and Institutional Donors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="white" size="sm" icon={Printer} onClick={handlePrintReport}>
            Print Formal Report
          </Button>
          <Button variant="yellow" size="sm" icon={Download} onClick={handleDownloadPDF}>
            Download PDF Packet
          </Button>
        </div>
      </div>

      {/* 2. TIMEFRAME SELECTOR BAR */}
      <Card style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--brand-dark-green)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Reporting Period:</span>
            {['FY 2025-26', 'FY 2024-25', 'All Time Cumulative'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  border: '1.5px solid #000',
                  borderRadius: '3px',
                  backgroundColor: timeframe === tf ? 'var(--accent-yellow)' : '#FFFFFF',
                  boxShadow: timeframe === tf ? '2px 2px 0 #000' : 'none',
                  cursor: 'pointer'
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="green" size="sm">✓ NITI Darpan Audited</Badge>
            <Badge variant="yellow" size="sm">✓ 100% Tax Deductible 80G</Badge>
          </div>
        </div>
      </Card>

      {/* 3. ANALYTICAL CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
        <BarChart
          title="Quarterly Capital Deployment vs Inflow (₹)"
          subtitle="FY 2025-26 Financial Quarter Run-Rate"
          data={spendData}
          isCurrency={true}
          hasSecondary={true}
          primaryLabel="Program Spend"
          secondaryLabel="Donation Inflows"
          height={280}
        />

        <DonutChart
          title="Geographic State Allocations"
          subtitle="Percentage Capital Dispatched by Region"
          data={stateDonutData}
          height={280}
        />
      </div>

      {/* 4. FORMAL STATUTORY AUDIT SUMMARY TABLE */}
      <Card style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
              Statutory Program Efficiency Ledger
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#5A6F64' }}>
              Audited according to ICAI Non-Profit Reporting Standards
            </p>
          </div>
          <Badge variant="green" size="md">89.2% Direct Efficiency</Badge>
        </div>

        <div className="nb-table-container">
          <table className="nb-table">
            <thead>
              <tr>
                <th>Intervention Sector</th>
                <th>Active Hubs</th>
                <th>Target Beneficiaries</th>
                <th>Budget Allocated</th>
                <th>Utilized (Audited)</th>
                <th>Completion Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sector: 'Child Education & Solar Labs', hubs: 8, ben: '18,500', budget: '₹75,00,000', spent: '₹71,20,000', status: '94.9%' },
                { sector: 'Mobile Primary Healthcare & Telemedicine', hubs: 4, ben: '12,200', budget: '₹55,00,000', spent: '₹51,80,000', status: '94.1%' },
                { sector: 'Poshan Nutrition & Community Meals', hubs: 3, ben: '9,400', budget: '₹35,00,000', spent: '₹34,10,000', status: '97.4%' },
                { sector: 'Women Artisans Micro-Enterprise', hubs: 2, ben: '1,800', budget: '₹22,00,000', spent: '₹20,50,000', status: '93.1%' },
                { sector: 'Emergency Flood Relief Pre-Positioning', hubs: 1, ben: '3,300', budget: '₹18,00,000', spent: '₹17,40,000', status: '96.6%' }
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 800 }}>{row.sector}</td>
                  <td>{row.hubs} Centers</td>
                  <td>{row.ben}</td>
                  <td>{row.budget}</td>
                  <td style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>{row.spent}</td>
                  <td>
                    <Badge variant="green" size="sm">{row.status} Delivered</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
