import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  Printer,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Heart,
  Building2,
  FileText
} from 'lucide-react';

export default function ReportsAdmin() {
  const { ngoProfile, donations, volunteers, beneficiaries, programs, addToast } = useApp();

  const [dateRange, setDateRange] = useState('FY 2025-2026');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Analytics Chart Data
  const monthlyInflowData = [
    { label: 'Q1 24', value: 3400000, secondaryValue: 2800000 },
    { label: 'Q2 24', value: 4100000, secondaryValue: 3200000 },
    { label: 'Q3 24', value: 4800000, secondaryValue: 3900000 },
    { label: 'Q4 24', value: 5200000, secondaryValue: 4300000 },
    { label: 'Q1 25', value: 6100000, secondaryValue: 5100000 }
  ];

  const stateImpactData = [
    { label: 'Maharashtra', value: 38, color: '#2E7D5B' },
    { label: 'Delhi NCR', value: 24, color: '#F4B942' },
    { label: 'Rajasthan', value: 16, color: '#3A86FF' },
    { label: 'Assam', value: 12, color: '#E63946' },
    { label: 'Karnataka', value: 10, color: '#A8D5BA' }
  ];

  const volunteerHoursTrend = [
    { label: 'Oct', val1: 420, val2: 120 },
    { label: 'Nov', val1: 580, val2: 160 },
    { label: 'Dec', val1: 740, val2: 210 },
    { label: 'Jan', val1: 890, val2: 270 },
    { label: 'Feb', val1: 990, val2: 320 },
    { label: 'Mar', val1: 1140, val2: 380 }
  ];

  const handleDownloadExcel = () => {
    addToast('Audited Impact Report (Excel XLSX mockup) exported successfully!', 'success');
  };

  return (
    <div className="reports-admin" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. TOP HEADER & FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem' }}>
            Audited Reports & Impact Analytics
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#5A6F64', fontWeight: 600 }}>
            Comprehensive data visualizations and donor audit reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Select
            label=""
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'FY 2025-2026', label: 'FY 2025-2026 (Current)' },
              { value: 'Last 12 Months', label: 'Last 12 Months' },
              { value: 'Q4 (Jan-Mar 2026)', label: 'Q4 (Jan-Mar 2026)' },
              { value: 'All Time (2018-2026)', label: 'All Time (2018-2026)' }
            ]}
            style={{ marginBottom: 0, width: '200px' }}
          />
          <Button variant="white" size="sm" icon={Download} onClick={handleDownloadExcel}>
            Export XLSX
          </Button>
          <Button variant="yellow" size="sm" icon={Printer} onClick={() => setShowPrintReport(!showPrintReport)}>
            {showPrintReport ? 'Hide Formal Report' : 'Print Formal Report'}
          </Button>
        </div>
      </div>

      {/* 2. FORMAL PRINTABLE REPORT MODAL / VIEW */}
      {showPrintReport && (
        <Card style={{ padding: '2rem', border: 'var(--border-thick)', backgroundColor: '#FAFCFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <Badge variant="yellow" size="sm">OFFICIAL STATUTORY DISCLOSURE</Badge>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginTop: '0.35rem' }}>
                {ngoProfile.name} — IMPACT AUDIT REPORT
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#5A6F64', fontWeight: 600 }}>
                Period: {dateRange} • NITI Aayog Darpan ID: {ngoProfile.darpanId} • Form 10BE Filing Compliant
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button variant="green" size="sm" icon={Printer} onClick={() => window.print()}>
                Print to PDF
              </Button>
            </div>
          </div>

          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>TOTAL FUNDS ALLOCATED</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-dark-green)' }}>
                ₹1.84 Cr
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>BENEFICIARIES AUDITED</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900 }}>
                45,200+
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>VOLUNTEER HOURS</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900 }}>
                18,450 hrs
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64' }}>PROGRAM EFFICIENCY</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-dark-green)' }}>
                98.4%
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#3A4E44', lineHeight: 1.6 }}>
            This statutory impact report is verified by the Board of Trustees and independent chartered accountants in compliance with Section 12A and 80G(5) of the Income Tax Act. 89.2% of all capital was directly expended in field interventions.
          </p>
        </Card>
      )}

      {/* 3. ANALYTICS CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
        <style>{`
          @media (max-width: 1024px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Quarterly Inflows */}
        <BarChart
          title="Quarterly Capital Deployment (INR ₹)"
          subtitle="Direct Community Program Expenditure vs Field Logistics"
          data={monthlyInflowData}
          height={260}
          hasSecondary={true}
          primaryLabel="Program Spend"
          secondaryLabel="Field Logistics"
        />

        {/* State Breakdown Donut */}
        <DonutChart
          title="Beneficiary Distribution by State"
          subtitle="Regional Geographical Reach (%)"
          data={stateImpactData}
          height={260}
        />
      </div>

      {/* 4. LONGITUDINAL VOLUNTEER HOURS CHART */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
        <LineChart
          title="Volunteer Hours Delivered & Community Sessions"
          subtitle="Cumulative Field Work Tracking"
          data={volunteerHoursTrend}
          series1Name="Volunteer Hours"
          series2Name="Field Sessions (x10)"
          height={260}
        />

        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Badge variant="green" size="sm">AUDIT HIGHLIGHTS</Badge>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Impact Highlights & Compliance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2ECE6', paddingBottom: '4px' }}>
                <span>NITI Aayog NGO Darpan Status:</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>ACTIVE & VERIFIED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2ECE6', paddingBottom: '4px' }}>
                <span>FCRA Compliance (MHA):</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>VALID TILL 2029</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2ECE6', paddingBottom: '4px' }}>
                <span>Direct Beneficiary Touchpoints:</span>
                <span style={{ fontWeight: 800 }}>45,200 Citizens</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2ECE6', paddingBottom: '4px' }}>
                <span>Average Cost per Beneficiary:</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>₹408 / person</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Button variant="yellow" size="sm" fullWidth icon={FileText} onClick={handleDownloadExcel}>
              Download Full Statutory Package (ZIP)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
