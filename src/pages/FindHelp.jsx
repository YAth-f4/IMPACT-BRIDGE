import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  HandHeart,
  Search,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function FindHelp() {
  const { submitFindHelp, currentUser, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'apply' | 'track'

  // Application Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    city: 'Mumbai',
    category: 'Food & Nutrition',
    need: '',
    urgency: 'Normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState(null);

  // Status Search State
  const [searchId, setSearchId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedRequest, setSearchedRequest] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Category filter for public aid directory
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = [
    { id: 'All', label: 'All Services', icon: '🌟' },
    { id: 'Food & Nutrition', label: 'Daily Meals & Food Ration', icon: '🍲' },
    { id: 'Healthcare & Medicine', label: 'Free Clinics & Medicines', icon: '🩺' },
    { id: 'Education Support', label: 'School Kits & Digital Labs', icon: '📚' },
    { id: 'Livelihood & Skills', label: 'Vocational Training & Jobs', icon: '💼' },
    { id: 'Emergency Shelter', label: 'Emergency Relief & Shelter', icon: '🏠' }
  ];

  const publicServices = [
    {
      id: 'AID-1',
      title: 'Free Daily Meals & Nutrition Kit',
      category: 'Food & Nutrition',
      center: 'Okhla Mega Nutrition Kitchen',
      city: 'New Delhi',
      timing: '11:00 AM - 3:00 PM Daily',
      phone: '+91 11 4050 2000',
      description: 'Hot nutritious lunch boxes and 15-day dry ration supplies for families.',
      badge: 'Immediate Walk-in'
    },
    {
      id: 'AID-2',
      title: 'Mobile Doctor Clinic & Free Medicines',
      category: 'Healthcare & Medicine',
      center: 'Sundarbans Floating Clinic',
      city: 'Sundarbans / Delta',
      timing: '9:00 AM - 5:00 PM (Mon-Sat)',
      phone: '+91 33 2289 1234',
      description: 'Doctor consultations, pediatric checks, essential maternal medicines at zero cost.',
      badge: 'Free Medicine'
    },
    {
      id: 'AID-3',
      title: 'Student Study Kits & Tablet Lending',
      category: 'Education Support',
      center: 'Mumbai Slum Innovation Lab',
      city: 'Mumbai',
      timing: '10:00 AM - 6:00 PM',
      phone: '+91 22 2404 8899',
      description: 'Free textbooks, notebooks, coding tablet devices, and after-school tuition.',
      badge: 'Grade 1 to 12'
    },
    {
      id: 'AID-4',
      title: 'Tailoring, Artisan & Tech Skill Training',
      category: 'Livelihood & Skills',
      center: 'Koramangala Community Skill Center',
      city: 'Bengaluru',
      timing: '9:30 AM - 4:30 PM (Mon-Fri)',
      phone: '+91 80 2553 4422',
      description: 'Certified courses in sewing, computer literacy, and job placement assistance.',
      badge: 'Govt Certified'
    },
    {
      id: 'AID-5',
      title: 'Emergency Flood & Cold Relief Support',
      category: 'Emergency Shelter',
      center: 'Assam Brahmaputra Relief Base',
      city: 'Guwahati',
      timing: '24 Hours On-Call',
      phone: '+91 361 234 5678',
      description: 'Emergency waterproof tents, clean drinking water filters, dry blankets.',
      badge: '24/7 Rapid Response'
    }
  ];

  const filteredServices =
    categoryFilter === 'All'
      ? publicServices
      : publicServices.filter((s) => s.category === categoryFilter);

  // Form Submit Handler
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.need.trim()) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await submitFindHelp({
      requesterName: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      category: formData.category,
      description: formData.need.trim(),
      urgency: formData.urgency
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubmittedRefId(result.requestId);
      setSearchId(result.requestId);
      setActiveTab('track');
      setFormData({
        name: currentUser?.name || '',
        phone: '',
        email: currentUser?.email || '',
        city: 'Mumbai',
        category: 'Food & Nutrition',
        need: '',
        urgency: 'Normal'
      });
    }
  };

  // Status Search Handler
  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setSearchedRequest(null);

    try {
      const query = searchPhone ? `?phone=${encodeURIComponent(searchPhone.trim())}` : '';
      const res = await fetch(`/api/requests/find-help/track/${encodeURIComponent(searchId.trim())}${query}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSearchError(data.message || 'Request reference not found.');
      } else {
        setSearchedRequest(data.request);
      }
    } catch (err) {
      setSearchError('Unable to connect to status server. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: 'var(--bg-offwhite)', padding: 'clamp(1rem, 3vw, 2.5rem) 1rem' }}>
      <div className="nb-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            color: '#FFFFFF',
            border: 'var(--border-thick)',
            borderRadius: '6px',
            boxShadow: '6px 6px 0px #000000',
            padding: '2rem 1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <Badge variant="yellow" size="sm" style={{ marginBottom: '0.5rem' }}>
            COMMUNITY AID & ASSISTANCE
          </Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
              fontWeight: 900,
              margin: '0.25rem 0 0.5rem 0'
            }}
          >
            Find Help & Direct Support
          </h1>
          <p style={{ color: 'var(--brand-light-green)', maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
            No one should walk alone in times of crisis. Connect with our nationwide relief hubs for meals, medical care, education kits, or emergency aid.
          </p>

          {/* Quick Helplines */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#1E553D',
              border: '2px solid #000',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem'
            }}
          >
            <span>📞 National Toll-Free: <strong>1800-2026-HELP</strong></span>
            <span>🚨 24/7 Relief Dispatch: <strong>+91 11 4050 2000</strong></span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {[
            { id: 'find', label: '1. Browse Relief Services', icon: Search },
            { id: 'apply', label: '2. Request Assistance Form', icon: HandHeart },
            { id: 'track', label: '3. Track Request Status', icon: ShieldCheck }
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
                  padding: '0.65rem 1.25rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: isActive ? '4px 4px 0px #000' : '2px 2px 0px #000',
                  transition: 'all 0.1s ease'
                }}
              >
                <Icon size={18} strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Browse Public Services */}
        {activeTab === 'find' && (
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  style={{
                    backgroundColor: categoryFilter === c.id ? 'var(--brand-dark-green)' : '#FFFFFF',
                    color: categoryFilter === c.id ? '#FFFFFF' : '#000000',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: categoryFilter === c.id ? '2px 2px 0px #000' : 'none'
                  }}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredServices.map((svc) => (
                <Card
                  key={svc.id}
                  style={{
                    border: 'var(--border-thick)',
                    boxShadow: '4px 4px 0px #000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <Badge variant="green" size="sm">{svc.category}</Badge>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--accent-yellow)', border: '1px solid #000', padding: '1px 6px', borderRadius: '3px' }}>
                        {svc.badge}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: '0.4rem 0' }}>
                      {svc.title}
                    </h3>
                    <p style={{ color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                      {svc.description}
                    </p>

                    <div style={{ fontSize: '0.82rem', color: '#5A6F64', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1rem' }}>
                      <div>📍 <strong>Center:</strong> {svc.center} ({svc.city})</div>
                      <div>🕒 <strong>Hours:</strong> {svc.timing}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <a href={`tel:${svc.phone.replace(/\s+/g, '')}`} style={{ textDecoration: 'none' }}>
                      <Button variant="white" size="sm" icon={Phone} style={{ width: '100%' }}>
                        Call Center
                      </Button>
                    </a>
                    <Button
                      variant="yellow"
                      size="sm"
                      icon={HandHeart}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, category: svc.category, city: svc.city }));
                        setActiveTab('apply');
                      }}
                    >
                      Request Aid
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Application Form */}
        {activeTab === 'apply' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', maxWidth: '680px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✍️</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                  Submit a Confidential Help Request
                </h2>
              </div>
              <p style={{ color: '#5A6F64', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Your request is saved securely in our database and reviewed by an administrator. Contact info is strictly protected.
              </p>

              <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                      style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      City / Area *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                      required
                      style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Help Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Food & Nutrition">Food & Nutrition (Daily Meals / Ration)</option>
                      <option value="Healthcare & Medicine">Healthcare & Medicine (Clinic / Meds)</option>
                      <option value="Education Support">Education Support (Kits / Tablet)</option>
                      <option value="Emergency Shelter">Emergency Shelter / Disaster Relief</option>
                      <option value="Livelihood & Skills">Livelihood & Vocational Training</option>
                      <option value="Other Assistance">Other Urgent Community Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Urgency Level
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Normal', 'High', 'Emergency'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency: lvl })}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: '1.5px solid #000',
                          borderRadius: '4px',
                          backgroundColor: formData.urgency === lvl ? (lvl === 'Emergency' ? '#FFD4D4' : 'var(--accent-yellow)') : '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        {lvl === 'Emergency' ? '🚨 Immediate Emergency' : lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Detailed Description of Assistance Needed *
                  </label>
                  <textarea
                    value={formData.need}
                    onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                    rows={4}
                    placeholder="Please explain the situation and specific items or help required..."
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <Button variant="yellow" size="md" icon={Send} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting to Admin Queue...' : 'Submit Request for Review'}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* TAB 3: Track Request Status */}
        {activeTab === 'track' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ border: 'var(--border-thick)', boxShadow: '6px 6px 0px #000', maxWidth: '640px', width: '100%' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                Track Your Request Status
              </h2>
              <p style={{ color: '#5A6F64', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Enter your Request Reference ID (e.g. <code>REQ-FH-...</code>) to check live administrator review status.
              </p>

              {submittedRefId && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#E8F5E9',
                    border: '2px solid #2E7D5B',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#1B5E20' }}>
                    ✓ Your help request has been submitted and is awaiting admin review!
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    Your Reference ID is: <strong>{submittedRefId}</strong>
                  </div>
                </div>
              )}

              <form onSubmit={handleTrackSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Request Reference ID *
                  </label>
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="e.g. REQ-FH-2026-001"
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Verification Phone Digits (Optional, for privacy)
                  </label>
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    placeholder="Last 4 digits of phone number"
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <Button variant="yellow" size="md" icon={Search} type="submit" disabled={searchLoading}>
                  {searchLoading ? 'Checking...' : 'Check Status'}
                </Button>
              </form>

              {searchError && (
                <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: '#FFEAEA', border: '1.5px solid #D9383A', borderRadius: '4px', color: '#D9383A', fontSize: '0.88rem' }}>
                  {searchError}
                </div>
              )}

              {searchedRequest && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '3px 3px 0px #000'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{searchedRequest.id}</span>
                    <Badge
                      variant={
                        searchedRequest.status === 'APPROVED'
                          ? 'green'
                          : searchedRequest.status === 'PENDING'
                          ? 'yellow'
                          : searchedRequest.status === 'NEEDS_INFO'
                          ? 'yellow'
                          : 'red'
                      }
                      size="sm"
                    >
                      {searchedRequest.status}
                    </Badge>
                  </div>

                  <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#4B5563' }}>
                    <div><strong>Category:</strong> {searchedRequest.category}</div>
                    <div><strong>City:</strong> {searchedRequest.city}</div>
                    <div><strong>Submitted:</strong> {new Date(searchedRequest.createdAt).toLocaleDateString()}</div>
                  </div>

                  {searchedRequest.adminNotes && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem', backgroundColor: '#F3F4F6', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <strong>Coordinator Remarks:</strong> {searchedRequest.adminNotes}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
