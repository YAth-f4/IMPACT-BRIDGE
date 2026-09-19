import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Heart,
  CreditCard,
  Download,
  TrendingUp,
  Award,
  Sparkles,
  Plus,
  LogOut,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';

export default function DonorDashboard() {
  const {
    currentUser,
    logoutUser,
    addToast,
    donations,
    addDonation,
    submitFundRaise,
    fetchMyFundRaiseRequests,
    fetchApprovedFundraisers
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'donations' | 'campaigns' | 'start-fundraiser' | 'receipts'
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [quickAmount, setQuickAmount] = useState('2500');
  const [quickPurpose, setQuickPurpose] = useState('Education Kit & STEM Lab');

  // Fundraiser form state
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignCategory, setCampaignCategory] = useState('Education & Tech');
  const [campaignTarget, setCampaignTarget] = useState('200000');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [campaignStory, setCampaignStory] = useState('');
  const [campaignLocation, setCampaignLocation] = useState('Mumbai, Maharashtra');
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);

  // Load donor campaigns
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const mine = await fetchMyFundRaiseRequests();
      const approved = await fetchApprovedFundraisers();
      if (isMounted) {
        setMyCampaigns(mine);
        setApprovedCampaigns(approved);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [fetchMyFundRaiseRequests, fetchApprovedFundraisers]);

  // Filter donations relevant to this donor or general demo
  const myDonations = donations.filter(
    (d) => !currentUser?.email || (d.email && d.email.toLowerCase() === currentUser.email.toLowerCase())
  );
  const totalDonated = (myDonations.length > 0 ? myDonations : donations.slice(0, 3)).reduce(
    (acc, d) => acc + (Number(d.amount) || 0),
    0
  );

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!campaignTitle.trim() || !campaignDesc.trim()) {
      addToast('Please provide a campaign title and description', 'error');
      return;
    }

    setIsSubmittingCampaign(true);
    const res = await submitFundRaise({
      title: campaignTitle,
      category: campaignCategory,
      targetAmount: Number(campaignTarget),
      description: campaignDesc,
      beneficiaryStory: campaignStory,
      location: campaignLocation
    });
    setIsSubmittingCampaign(false);

    if (res.success) {
      setCampaignTitle('');
      setCampaignDesc('');
      setCampaignStory('');
      // Reload campaigns
      const mine = await fetchMyFundRaiseRequests();
      setMyCampaigns(mine);
      setActiveTab('campaigns');
    }
  };

  const handleQuickDonate = (e) => {
    e.preventDefault();
    if (!quickAmount || Number(quickAmount) <= 0) {
      addToast('Please specify a valid donation amount', 'error');
      return;
    }

    addDonation({
      donorName: currentUser?.name || 'Anonymous Philanthropist',
      email: currentUser?.email || 'donor@example.com',
      amount: Number(quickAmount),
      purpose: quickPurpose,
      donorType: 'Individual Patron',
      panNumber: 'ABCPS9876K'
    });

    setDonateModalOpen(false);
    addToast(`Thank you! ₹${quickAmount} donation recorded. 80G certificate ready.`, 'success');
  };

  return (
    <div style={{ minHeight: '88vh', backgroundColor: 'var(--bg-offwhite)', padding: 'clamp(1rem, 3vw, 2.5rem) 1rem' }}>
      <div className="nb-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Header Card */}
        <div
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            color: '#FFFFFF',
            border: 'var(--border-thick)',
            borderRadius: '6px',
            boxShadow: '6px 6px 0px #000000',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-yellow)',
                border: '2.5px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '3px 3px 0px #000'
              }}
            >
              ❤️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
                  Welcome back, {currentUser?.name || 'Patron'}!
                </h1>
                <Badge variant="yellow" size="sm">DONOR DASHBOARD</Badge>
              </div>
              <p style={{ color: 'var(--brand-light-green)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                All donations are 50% tax exempt under Section 80G of the Indian Income Tax Act.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="yellow"
              size="sm"
              icon={Heart}
              onClick={() => setDonateModalOpen(true)}
            >
              Make a Donation
            </Button>
            <Button
              variant="white"
              size="sm"
              icon={LogOut}
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            borderBottom: '2.5px solid #000',
            paddingBottom: '0.5rem'
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Impact', icon: TrendingUp },
            { id: 'donations', label: 'My Donations', icon: CreditCard },
            { id: 'campaigns', label: 'Fundraising Campaigns', icon: Heart },
            { id: 'start-fundraiser', label: 'Start a Fundraiser', icon: Plus },
            { id: 'receipts', label: '80G Tax Receipts', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: isActive ? 'var(--accent-yellow)' : '#FFFFFF',
                  color: '#000000',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  padding: '0.5rem 0.9rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: isActive ? '3px 3px 0px #000' : '1px 1px 0px #000',
                  transition: 'all 0.1s ease'
                }}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stat Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <StatCard
                title="Total Contributions"
                value={`₹${totalDonated.toLocaleString('en-IN')}`}
                change="Verified Impact"
                isPositive={true}
                icon={CreditCard}
                variant="green"
              />
              <StatCard
                title="Supported Programs"
                value="3 Programs"
                change="Education & Nutrition"
                isPositive={true}
                icon={Building2}
                variant="yellow"
              />
              <StatCard
                title="Tax Savings (80G)"
                value={`₹${Math.round(totalDonated * 0.15).toLocaleString('en-IN')}`}
                change="50% Deduction"
                isPositive={true}
                icon={FileText}
                variant="lightgreen"
              />
              <StatCard
                title="Beneficiaries Reached"
                value="120+ Lives"
                change="Direct Impact"
                isPositive={true}
                icon={Award}
                variant="white"
              />
            </div>

            {/* Quick Donate Banner */}
            <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>
                    Support Ongoing Emergency Nutrition & STEM Programs
                  </h3>
                  <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.35rem 0 0 0' }}>
                    100% of your contributions go straight to on-ground field execution with zero middleman commissions.
                  </p>
                </div>
                <Button variant="yellow" size="sm" icon={Heart} onClick={() => setDonateModalOpen(true)}>
                  Donate ₹2,500
                </Button>
              </div>
            </Card>

            {/* Recent Donations Table */}
            <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1rem' }}>
                Recent Giving History
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F2F8F4', borderBottom: '2px solid #000' }}>
                      <th style={{ padding: '0.65rem' }}>Receipt / Ref ID</th>
                      <th style={{ padding: '0.65rem' }}>Date</th>
                      <th style={{ padding: '0.65rem' }}>Purpose</th>
                      <th style={{ padding: '0.65rem' }}>Amount</th>
                      <th style={{ padding: '0.65rem' }}>80G Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(myDonations.length > 0 ? myDonations : donations.slice(0, 3)).map((d, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '0.65rem', fontWeight: 700 }}>{d.id || `DON-${idx + 101}`}</td>
                        <td style={{ padding: '0.65rem', color: '#5A6F64' }}>{d.date || '2026-09-01'}</td>
                        <td style={{ padding: '0.65rem' }}>{d.purpose || 'STEM Lab Support'}</td>
                        <td style={{ padding: '0.65rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>
                          ₹{(d.amount || 2500).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.65rem' }}>
                          <Badge variant="green" size="sm">Certified 80G</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Donations */}
        {activeTab === 'donations' && (
          <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, marginBottom: '1rem' }}>
              My Complete Donation History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(myDonations.length > 0 ? myDonations : donations.slice(0, 5)).map((d, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: '1.5px solid #000',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                      ₹{(d.amount || 2500).toLocaleString('en-IN')} — {d.purpose || 'General Community Support'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#5A6F64', marginTop: '0.2rem' }}>
                      Reference ID: {d.id || `DON-${idx + 101}`} • Date: {d.date || '2026-09-01'} • Mode: UPI / Netbanking
                    </div>
                  </div>

                  <Button
                    variant="white"
                    size="sm"
                    icon={Download}
                    onClick={() => addToast(`Downloading 80G receipt for donation ${d.id || 'DON-101'}`, 'info')}
                  >
                    80G Receipt
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 3: Campaigns */}
        {activeTab === 'campaigns' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                  Fundraising Campaigns
                </h2>
                <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                  Community campaigns approved by the administrator, eligible for public backing.
                </p>
              </div>
              <Button variant="yellow" size="sm" icon={Plus} onClick={() => setActiveTab('start-fundraiser')}>
                Submit New Campaign
              </Button>
            </div>

            {/* My Proposed Campaigns */}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: '0.5rem 0' }}>
              My Submitted Campaigns (Approval Workflow)
            </h3>
            {myCampaigns.length === 0 ? (
              <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p>You haven't submitted any custom fundraising campaigns yet.</p>
                <Button variant="yellow" size="sm" onClick={() => setActiveTab('start-fundraiser')}>
                  Propose a Campaign
                </Button>
              </Card>
            ) : (
              myCampaigns.map((c) => (
                <Card key={c.id} style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>
                          {c.title}
                        </h4>
                        <Badge
                          variant={c.status === 'APPROVED' ? 'green' : c.status === 'PENDING' ? 'yellow' : 'red'}
                          size="sm"
                        >
                          {c.status}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#5A6F64', marginTop: '0.25rem' }}>
                        ID: {c.id} • Target: ₹{Number(c.targetAmount).toLocaleString('en-IN')} • Category: {c.category}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', margin: '0.75rem 0' }}>{c.description}</p>

                  {c.status === 'PENDING' && (
                    <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FFFBEB', border: '1.5px solid #F59E0B', borderRadius: '4px', fontSize: '0.82rem' }}>
                      ⏳ <strong>Pending Admin Review:</strong> This campaign is currently being reviewed by Impact Bridge administrators. It will be published publicly once approved.
                    </div>
                  )}

                  {c.status === 'APPROVED' && (
                    <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#EDF7F2', border: '1.5px solid #2E7D5B', borderRadius: '4px', fontSize: '0.82rem' }}>
                      ✓ <strong>Approved & Published:</strong> This campaign is now live in the public directory and can receive public donations.
                    </div>
                  )}
                </Card>
              ))
            )}

            {/* Approved Campaigns Directory */}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: '1rem 0 0.5rem' }}>
              Active Approved Campaigns
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {approvedCampaigns.map((camp) => (
                <Card key={camp.id} style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <Badge variant="green" size="sm">{camp.category}</Badge>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', margin: '0.5rem 0 0.35rem' }}>
                      {camp.title}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: '#5A6F64', marginBottom: '0.75rem' }}>
                      📍 {camp.location} • By {camp.organizerName}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.45 }}>{camp.description}</p>
                    <div style={{ fontWeight: 800, color: 'var(--brand-dark-green)', margin: '0.75rem 0' }}>
                      Goal: ₹{Number(camp.targetAmount).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <Button
                    variant="yellow"
                    size="sm"
                    icon={Heart}
                    onClick={() => {
                      setQuickPurpose(camp.title);
                      setDonateModalOpen(true);
                    }}
                  >
                    Back This Campaign
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Start a Fundraiser */}
        {activeTab === 'start-fundraiser' && (
          <Card style={{ border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', maxWidth: '750px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
              Propose a Fundraising Campaign
            </h2>
            <p style={{ color: '#5A6F64', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Every campaign undergoes administrative verification to ensure regulatory compliance and 80G tax clearance before going live.
            </p>

            <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Solar STEM Lab for Island Primary School"
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Target Amount (INR) *
                  </label>
                  <input
                    type="number"
                    value={campaignTarget}
                    onChange={(e) => setCampaignTarget(e.target.value)}
                    min="1000"
                    step="1000"
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={campaignCategory}
                    onChange={(e) => setCampaignCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Education & Tech">Education & STEM</option>
                    <option value="Nutrition & Food Relief">Nutrition & Daily Meals</option>
                    <option value="Healthcare & Aid">Healthcare & Medical Equipment</option>
                    <option value="Emergency Shelter">Emergency Disaster Shelter</option>
                    <option value="Livelihood & Skills">Skill Training & Tools</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Target Location / Hub
                </label>
                <input
                  type="text"
                  value={campaignLocation}
                  onChange={(e) => setCampaignLocation(e.target.value)}
                  placeholder="e.g. Dharavi, Mumbai or Sundarbans, WB"
                  style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Campaign Description & Budget Breakdown *
                </label>
                <textarea
                  value={campaignDesc}
                  onChange={(e) => setCampaignDesc(e.target.value)}
                  rows={4}
                  placeholder="Explain the objectives, equipment needed, and operational plan..."
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Beneficiary Context & Impact Story
                </label>
                <textarea
                  value={campaignStory}
                  onChange={(e) => setCampaignStory(e.target.value)}
                  rows={2}
                  placeholder="Describe how this funding transforms lives on the ground..."
                  style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <Button variant="yellow" size="md" icon={Send} type="submit" disabled={isSubmittingCampaign}>
                {isSubmittingCampaign ? 'Submitting...' : 'Submit Campaign for Administrator Review'}
              </Button>
            </form>
          </Card>
        )}

        {/* Tab 5: Receipts */}
        {activeTab === 'receipts' && (
          <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, marginBottom: '1rem' }}>
              80G Tax Exemption Certificates
            </h2>
            <p style={{ color: '#5A6F64', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Impact Bridge is a registered 80G non-profit organization under the Ministry of Finance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { fy: 'FY 2025-2026', total: totalDonated || 15000, certNum: 'IB-80G-2026-9812' },
                { fy: 'FY 2024-2025', total: 25000, certNum: 'IB-80G-2025-4521' }
              ].map((rec, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1.5px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>Annual Tax Certificate — {rec.fy}</div>
                    <div style={{ fontSize: '0.8rem', color: '#5A6F64' }}>
                      Certificate No: {rec.certNum} • Total Eligible Donation: ₹{rec.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Button variant="white" size="sm" icon={Download} onClick={() => addToast(`Downloaded ${rec.fy} 80G Annual Certificate`, 'success')}>
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Donate Modal */}
      {donateModalOpen && (
        <Modal
          isOpen={donateModalOpen}
          onClose={() => setDonateModalOpen(false)}
          title="Complete Donation & Receive 80G Receipt"
          maxWidth="460px"
        >
          <form onSubmit={handleQuickDonate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Donation Amount (INR)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {[1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setQuickAmount(String(amt))}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      border: '1.5px solid #000',
                      borderRadius: '4px',
                      backgroundColor: quickAmount === String(amt) ? 'var(--accent-yellow)' : '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Cause / Purpose
              </label>
              <input
                type="text"
                value={quickPurpose}
                onChange={(e) => setQuickPurpose(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="white" size="sm" type="button" onClick={() => setDonateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="yellow" size="sm" type="submit">
                Confirm & Donate ₹{quickAmount}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
