import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import {
  HandHeart,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Sparkles,
  Send,
  Building2,
  FileQuestion
} from 'lucide-react';

export default function BeneficiaryDashboard() {
  const {
    currentUser,
    logoutUser,
    addToast,
    submitFindHelp,
    fetchMyFindHelpRequests
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'new-request' | 'centers' | 'profile'
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Request Form
  const [category, setCategory] = useState('Food & Nutrition');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [city, setCity] = useState('Mumbai');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch only this beneficiary's own requests from the backend
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const requests = await fetchMyFindHelpRequests();
      if (isMounted) {
        setMyRequests(requests);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [fetchMyFindHelpRequests]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      addToast('Please describe the assistance you need.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await submitFindHelp({
      requesterName: currentUser?.name || 'Community Member',
      phone,
      email: currentUser?.email || '',
      city,
      category,
      description,
      urgency
    });
    setIsSubmitting(false);

    if (result.success) {
      setDescription('');
      // Reload my requests
      const updated = await fetchMyFindHelpRequests();
      setMyRequests(updated);
      setActiveTab('requests');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="green" size="md">✓ APPROVED</Badge>;
      case 'PENDING':
        return <Badge variant="yellow" size="md">⏳ PENDING ADMIN REVIEW</Badge>;
      case 'NEEDS_INFO':
        return <Badge variant="yellow" size="md">⚠️ NEEDS MORE INFO</Badge>;
      case 'REJECTED':
        return <Badge variant="red" size="md">✕ REJECTED</Badge>;
      default:
        return <Badge variant="gray" size="md">{status}</Badge>;
    }
  };

  return (
    <div style={{ minHeight: '88vh', backgroundColor: 'var(--bg-offwhite)', padding: 'clamp(1rem, 3vw, 2.5rem) 1rem' }}>
      <div className="nb-container" style={{ maxWidth: '1050px', margin: '0 auto' }}>
        {/* Simple & Welcoming Header */}
        <div
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            color: '#FFFFFF',
            border: 'var(--border-thick)',
            borderRadius: '6px',
            boxShadow: '6px 6px 0px #000000',
            padding: '1.5rem',
            marginBottom: '1.75rem',
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
                backgroundColor: 'var(--brand-light-green)',
                border: '2.5px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '3px 3px 0px #000'
              }}
            >
              🤝
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
                  Namaste, {currentUser?.name || 'Friend'}!
                </h1>
                <Badge variant="yellow" size="sm">BENEFICIARY HUB</Badge>
              </div>
              <p style={{ color: 'var(--brand-light-green)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                We are here to support you. You can submit aid requests and track their status in real time.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="yellow"
              size="sm"
              icon={Plus}
              onClick={() => setActiveTab('new-request')}
            >
              Request Help
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

        {/* Big, Clear Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            borderBottom: '2.5px solid #000',
            paddingBottom: '0.65rem'
          }}
        >
          {[
            { id: 'requests', label: 'My Help Requests', icon: HandHeart },
            { id: 'new-request', label: 'Submit New Request', icon: Plus },
            { id: 'centers', label: 'Emergency Help Centers', icon: Building2 },
            { id: 'profile', label: 'My Profile', icon: CheckCircle2 }
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
                  padding: '0.65rem 1.1rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: isActive ? '3.5px 3.5px 0px #000' : '1.5px 1.5px 0px #000',
                  transition: 'all 0.1s ease'
                }}
              >
                <Icon size={18} strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: My Help Requests */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                  My Support Requests
                </h2>
                <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                  Showing only your requests. Every request is reviewed by Impact Bridge coordinators.
                </p>
              </div>

              <Button variant="yellow" size="sm" icon={Plus} onClick={() => setActiveTab('new-request')}>
                Ask for Assistance
              </Button>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}>
                Loading your assistance records...
              </div>
            ) : myRequests.length === 0 ? (
              <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌱</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  No Active Requests Yet
                </h3>
                <p style={{ color: '#5A6F64', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                  If you or your family require food rations, healthcare support, education kits, or emergency aid, please let us know.
                </p>
                <Button variant="yellow" size="md" icon={Plus} onClick={() => setActiveTab('new-request')}>
                  Submit a Help Request
                </Button>
              </Card>
            ) : (
              myRequests.map((req) => (
                <Card
                  key={req.id}
                  style={{
                    border: 'var(--border-thick)',
                    boxShadow: '4px 4px 0px #000',
                    backgroundColor: '#FFFFFF',
                    padding: '1.25rem 1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.25rem' }}>
                          {req.category?.includes('Food') ? '🍲' : req.category?.includes('Health') ? '🩺' : req.category?.includes('Education') ? '📚' : '🏠'}
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                          {req.category}
                        </h3>
                        {getStatusBadge(req.status)}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#5A6F64', marginTop: '0.35rem' }}>
                        Reference ID: <strong>{req.id}</strong> • Submitted:{' '}
                        {new Date(req.createdAt).toLocaleDateString()} • City: {req.city}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      margin: '1rem 0',
                      padding: '0.85rem 1rem',
                      backgroundColor: '#F9FAF9',
                      border: '1.5px solid #000',
                      borderRadius: '4px',
                      fontSize: '0.92rem',
                      lineHeight: 1.5
                    }}
                  >
                    <strong>Assistance Requested:</strong>
                    <div style={{ marginTop: '0.25rem' }}>{req.description}</div>
                  </div>

                  {/* Admin feedback note */}
                  {req.adminNotes ? (
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: req.status === 'APPROVED' ? '#E8F5E9' : req.status === 'NEEDS_INFO' ? '#FFFBEB' : '#FFEAEA',
                        border: '1.5px solid #000',
                        borderRadius: '4px',
                        fontSize: '0.88rem'
                      }}
                    >
                      <strong>Coordinator Message:</strong> {req.adminNotes}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: '#6B7280', fontStyle: 'italic' }}>
                      Status update: Our regional coordinator is reviewing this application. We will contact you at {req.phone}.
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Submit New Request */}
        {activeTab === 'new-request' && (
          <Card style={{ border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', maxWidth: '720px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
              Request Direct Community Assistance
            </h2>
            <p style={{ color: '#5A6F64', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Fill in what you need. This request goes securely to the administrator for verification. Your personal contact information is never shown publicly.
            </p>

            <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  What kind of help do you need? *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700 }}
                >
                  <option value="Food & Nutrition">🍲 Food & Daily Meals / Dry Ration Kits</option>
                  <option value="Healthcare & Medicine">🩺 Free Clinic Consultation & Essential Medicines</option>
                  <option value="Education Support">📚 School Kits, Books & Digital Learning Tablets</option>
                  <option value="Emergency Shelter">🏠 Emergency Flood, Cold Relief & Temporary Shelter</option>
                  <option value="Livelihood & Skills">💼 Skill Training, Sewing Machines & Job Aid</option>
                  <option value="Other Assistance">🌟 Other Urgent Community Support</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Urgency Level
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Normal', 'High', 'Emergency'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      style={{
                        flex: 1,
                        padding: '0.55rem',
                        border: '1.5px solid #000',
                        borderRadius: '4px',
                        backgroundColor: urgency === lvl ? (lvl === 'Emergency' ? '#FFD4D4' : 'var(--accent-yellow)') : '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {lvl === 'Emergency' ? '🚨 Immediate Emergency' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Describe your need in detail *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="e.g. Need monthly ration support for family of 4. Father daily wager currently without work..."
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <Button variant="yellow" size="md" icon={Send} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending Request...' : 'Submit Request to Admin'}
              </Button>
            </form>
          </Card>
        )}

        {/* Tab 3: Emergency Centers */}
        {activeTab === 'centers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
              Verified Direct Assistance Hubs
            </h2>
            <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
              You can walk directly into these centers for immediate food, health checkups, or study resources.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                {
                  title: 'Okhla Mega Nutrition Kitchen',
                  city: 'New Delhi',
                  address: 'Phase III Industrial Shed, Okhla, New Delhi 110020',
                  phone: '+91 11 4050 2000',
                  timing: '11:00 AM - 3:00 PM Daily',
                  service: 'Daily hot nutritious meals & dry ration supply packs'
                },
                {
                  title: 'Mumbai Slum Innovation Lab',
                  city: 'Mumbai',
                  address: '90 Feet Road, Dharavi, Mumbai 400017',
                  phone: '+91 22 2407 1199',
                  timing: '10:00 AM - 6:00 PM (Mon-Sat)',
                  service: 'Digital classroom, student tablets, coaching support'
                },
                {
                  title: 'Sundarbans Floating Medical Clinic',
                  city: 'Sundarbans, WB',
                  address: 'Gosaba Jetty Base, 24 Parganas South',
                  phone: '+91 33 2289 1234',
                  timing: '9:00 AM - 5:00 PM (Mon-Sat)',
                  service: 'Free doctor consultation, pediatric care, free medicines'
                }
              ].map((hub, idx) => (
                <Card key={idx} style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                    {hub.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#5A6F64', marginBottom: '0.65rem' }}>
                    📍 {hub.address}
                  </div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Services:</strong> {hub.service}
                  </div>
                  <div style={{ fontSize: '0.82rem', marginBottom: '1rem', color: 'var(--brand-dark-green)', fontWeight: 700 }}>
                    🕒 {hub.timing} • 📞 {hub.phone}
                  </div>
                  <a href={`tel:${hub.phone.replace(/\s+/g, '')}`} style={{ textDecoration: 'none' }}>
                    <Button variant="white" size="sm" icon={Phone} style={{ width: '100%' }}>
                      Call Help Center
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', maxWidth: '650px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, marginBottom: '1rem' }}>
              My Beneficiary Profile
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><strong>Name:</strong> {currentUser?.name}</div>
              <div><strong>Email:</strong> {currentUser?.email}</div>
              <div><strong>Role:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 800 }}>BENEFICIARY</span></div>
              <div><strong>Registered Phone:</strong> +91 98765 43210</div>
              <div><strong>Account ID:</strong> {currentUser?.id}</div>
              <div><strong>Verified Status:</strong> <span style={{ color: 'var(--brand-dark-green)', fontWeight: 800 }}>✓ Verified Citizen</span></div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
