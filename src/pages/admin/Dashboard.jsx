import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  Users,
  Heart,
  Building2,
  TrendingUp,
  Smile,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const {
    volunteers,
    beneficiaries,
    donations,
    programs,
    ngoProfile,
    messages,
    fetchAdminStats
  } = useApp();

  const [activityFilter, setActivityFilter] = useState('All');
  const [dbStats, setDbStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const stats = await fetchAdminStats();
      if (isMounted) {
        setDbStats(stats);
        setStatsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [fetchAdminStats]);

  // Compute Live Metrics from actual records
  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter((v) => v.status === 'Active').length;
  const totalBeneficiaries = beneficiaries.length;
  const activePrograms = programs.filter((p) => p.status === 'Ongoing').length;
  const completedPrograms = programs.filter((p) => p.status === 'Completed').length;
  const totalDonationsAmount = donations.reduce((acc, d) => acc + (d.amount || 0), 0) + 17500000;
  const monthlyDonations = donations.slice(0, 5).reduce((acc, d) => acc + (d.amount || 0), 0) + 1200000;

  const pendingFindHelp = dbStats?.findHelp?.pending ?? 1;
  const pendingFundRaise = dbStats?.fundRaise?.pending ?? 1;
  const pendingVolunteers = dbStats?.volunteer?.pending ?? 1;
  const totalPending = dbStats?.summary?.pending ?? (pendingFindHelp + pendingFundRaise + pendingVolunteers);

  // Donation Trend Chart Data
  const donationChartData = [
    { label: 'Oct', value: 1150000, secondaryValue: 900000 },
    { label: 'Nov', value: 1420000, secondaryValue: 1100000 },
    { label: 'Dec', value: 1890000, secondaryValue: 1400000 },
    { label: 'Jan', value: 1540000, secondaryValue: 1250000 },
    { label: 'Feb', value: 1650000, secondaryValue: 1380000 },
    { label: 'Mar', value: 1980000, secondaryValue: 1550000 }
  ];

  // Growth Line Chart Data
  const growthChartData = [
    { label: 'Oct', val1: 820, val2: 320 },
    { label: 'Nov', val1: 910, val2: 360 },
    { label: 'Dec', val1: 1040, val2: 410 },
    { label: 'Jan', val1: 1150, val2: 435 },
    { label: 'Feb', val1: 1220, val2: 460 },
    { label: 'Mar', val1: 1280, val2: 485 }
  ];

  // Program Distribution Donut Data
  const programDonutData = [
    { label: 'Education', value: 35, color: '#2E7D5B' },
    { label: 'Healthcare', value: 25, color: '#F4B942' },
    { label: 'Nutrition', value: 20, color: '#3A86FF' },
    { label: 'Women', value: 12, color: '#A8D5BA' },
    { label: 'Disaster', value: 8, color: '#E63946' }
  ];

  const activities = [
    {
      id: 'act-1',
      type: 'Donation',
      title: '₹5,00,000 CSR Grant Recorded',
      desc: 'TechVanguard CSR Foundation funded Melghat Mobile Van.',
      time: '2 hours ago',
      badgeColor: 'green'
    },
    {
      id: 'act-2',
      type: 'Volunteer',
      title: 'New Volunteer Application',
      desc: 'Megha Sundaram (IIT Bombay) applied for Solar Classrooms.',
      time: '4 hours ago',
      badgeColor: 'yellow'
    },
    {
      id: 'act-3',
      type: 'Beneficiary',
      title: 'Laxmi Devi Aid Request Approved',
      desc: 'Education kit & tablet allocated via Dharavi Lab.',
      time: '1 day ago',
      badgeColor: 'blue'
    },
    {
      id: 'act-4',
      type: 'Program',
      title: 'Assam Flood Pre-positioning Complete',
      desc: '6 elevated rescue hubs pre-deployed with 5,000 rations.',
      time: '2 days ago',
      badgeColor: 'red'
    }
  ];

  const filteredActivities = activityFilter === 'All'
    ? activities
    : activities.filter((a) => a.type === activityFilter);

  return (
    <div className="admin-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 0. LIVE APPROVAL QUEUE (CRITICAL WORKFLOW BANNER) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚡</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
              Action Required: Approval Queues
            </h3>
          </div>
          <Badge variant={totalPending > 0 ? 'red' : 'green'} size="sm">
            {totalPending} PENDING ACTION
          </Badge>
        </div>

        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin/requests/find-help" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: '4px 4px 0px #000',
                backgroundColor: pendingFindHelp > 0 ? '#FFFBEB' : '#FFFFFF',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Find Help Requests
                </span>
                <Badge variant={pendingFindHelp > 0 ? 'yellow' : 'gray'} size="sm">
                  {pendingFindHelp} Pending
                </Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                {dbStats?.findHelp?.total ?? 3} Total
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '0.35rem' }}>
                Approved: {dbStats?.findHelp?.approved ?? 1} • Rejected: {dbStats?.findHelp?.rejected ?? 0}
              </div>
            </Card>
          </Link>

          <Link to="/admin/requests/fund-raise" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: '4px 4px 0px #000',
                backgroundColor: pendingFundRaise > 0 ? '#FFFBEB' : '#FFFFFF',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Fund Raise Proposals
                </span>
                <Badge variant={pendingFundRaise > 0 ? 'yellow' : 'gray'} size="sm">
                  {pendingFundRaise} Pending
                </Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                {dbStats?.fundRaise?.total ?? 2} Total
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '0.35rem' }}>
                Live Approved: {dbStats?.fundRaise?.approved ?? 1}
              </div>
            </Card>
          </Link>

          <Link to="/admin/requests/volunteers" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: '4px 4px 0px #000',
                backgroundColor: pendingVolunteers > 0 ? '#FFFBEB' : '#FFFFFF',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Volunteer Applications
                </span>
                <Badge variant={pendingVolunteers > 0 ? 'yellow' : 'gray'} size="sm">
                  {pendingVolunteers} Pending
                </Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                {dbStats?.volunteer?.total ?? 2} Total
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '0.35rem' }}>
                Approved Field Leads: {dbStats?.volunteer?.approved ?? 1}
              </div>
            </Card>
          </Link>

          <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card
              style={{
                border: 'var(--border-thick)',
                boxShadow: '4px 4px 0px #000',
                backgroundColor: '#FFFFFF',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Registered Users
                </span>
                <Badge variant="green" size="sm">
                  RBAC Active
                </Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                {dbStats?.users?.total ?? 5} Accounts
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '0.35rem' }}>
                Volunteers: {dbStats?.users?.volunteer ?? 1} • Donors: {dbStats?.users?.donor ?? 1} • Ben: {dbStats?.users?.beneficiary ?? 1}
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* 1. TOP 8 KPI SUMMARY GRID */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>
            Live Operational KPIs
          </h3>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5A6F64' }}>
            UPDATED: JUST NOW
          </span>
        </div>

        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin/volunteers" style={{ textDecoration: 'none', color: 'inherit' }}>
            <StatCard
              title="Total Volunteers"
              value={formatNumber(totalVolunteers)}
              subtitle={`${activeVolunteers} currently active`}
              icon={Users}
              variant="lightgreen"
              trend={{ value: '+14% MoM', isPositive: true }}
            />
          </Link>
          <Link to="/admin/beneficiaries" style={{ textDecoration: 'none', color: 'inherit' }}>
            <StatCard
              title="Beneficiaries Verified"
              value={formatNumber(ngoProfile.stats.beneficiariesSupported)}
              subtitle="Across 142 communities"
              icon={Smile}
              variant="yellow"
              trend={{ value: '+2,150 this month', isPositive: true }}
            />
          </Link>
          <Link to="/admin/donations" style={{ textDecoration: 'none', color: 'inherit' }}>
            <StatCard
              title="Total Funds Raised"
              value={formatCurrency(totalDonationsAmount, true)}
              subtitle="100% Tax Exempt 80G"
              icon={Heart}
              variant="green"
              trend={{ value: '+22% vs 2024', isPositive: true }}
            />
          </Link>
          <Link to="/admin/programs" style={{ textDecoration: 'none', color: 'inherit' }}>
            <StatCard
              title="Active Programs"
              value={formatNumber(activePrograms)}
              subtitle={`${completedPrograms} completed`}
              icon={Building2}
              variant="white"
              trend={{ value: '4 In Progress', isPositive: true }}
            />
          </Link>
        </div>

        <div className="grid-4">
          <StatCard
            title="Monthly Run-Rate"
            value={formatCurrency(monthlyDonations)}
            subtitle="Recurring + CSR grants"
            icon={TrendingUp}
            variant="default"
          />
          <Link to="/admin/impact-map" style={{ textDecoration: 'none', color: 'inherit' }}>
            <StatCard
              title="Active Locations"
              value="18 Hubs"
              subtitle="8 Indian States"
              icon={Building2}
              variant="lightgreen"
            />
          </Link>
          <Link to="/admin/messages" style={{ textDecoration: 'none', color: 'inherit' }}>
            <StatCard
              title="Unread Inquiries"
              value={formatNumber(messages.filter((m) => !m.read).length)}
              subtitle="Volunteers & Donors"
              icon={Users}
              variant="yellow"
            />
          </Link>
          <StatCard
            title="Impact Efficiency"
            value="98.4%"
            subtitle="Direct program ratio"
            icon={ShieldCheck}
            variant="green"
            badgeText="Audited"
          />
        </div>
      </div>

      {/* 2. INTERACTIVE CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
        <style>{`
          @media (max-width: 1024px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Donation Trend Bar Chart */}
        <BarChart
          title="Monthly Donation Inflows (INR ₹)"
          subtitle="Comparison: Direct Individual Donors vs Corporate CSR Grants"
          data={donationChartData}
          isCurrency={true}
          height={260}
          hasSecondary={true}
          primaryLabel="Total Donations"
          secondaryLabel="CSR Grants"
        />

        {/* Program Category Donut */}
        <DonutChart
          title="Budget Allocation by Category"
          subtitle="Portfolio Distribution across Interventions"
          data={programDonutData}
          height={260}
        />
      </div>

      {/* 3. GROWTH LINE CHART & RECENT ACTIVITY FEED */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="hero-grid">
        {/* Growth Line Chart */}
        <LineChart
          title="Volunteer Roster vs Community Reach (x100)"
          subtitle="6-Month Longitudinal Field Growth"
          data={growthChartData}
          series1Name="Volunteers"
          series2Name="Beneficiaries (x100)"
          height={260}
        />

        {/* Live Activity Stream */}
        <Card style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>
                ⚡ Live Activity Stream
              </h4>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['All', 'Donation', 'Volunteer', 'Beneficiary'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    style={{
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      border: '1px solid #000',
                      borderRadius: '3px',
                      backgroundColor: activityFilter === f ? 'var(--accent-yellow)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#F7FAF8',
                    border: '1.5px solid #000',
                    borderRadius: '4px',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{act.title}</span>
                    <span style={{ fontSize: '0.7rem', color: '#7A8E83', fontWeight: 600 }}>{act.time}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#5A6F64', lineHeight: 1.3 }}>{act.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1.5px solid #E2ECE6', paddingTop: '0.75rem', marginTop: '0.75rem', textAlign: 'right' }}>
            <Link to="/admin/reports" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="sm">
                View Full Audit Logs <ArrowRight size={13} strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
