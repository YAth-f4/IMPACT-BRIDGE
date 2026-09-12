import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function BeneficiaryPortal() {
  const { supportRequests, addSupportRequest } = useApp();
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'apply' | 'status' | 'helpline'

  // Filter for Find Help
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Application Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    category: 'Food & Nutrition',
    need: '',
    urgency: 'Normal'
  });

  // Status Search State
  const [searchId, setSearchId] = useState('');
  const [searchedRequest, setSearchedRequest] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Categories
  const categories = [
    { id: 'All', label: 'All Services', icon: '🌟' },
    { id: 'Food & Nutrition', label: 'Daily Meals & Food Ration', icon: '🍲' },
    { id: 'Healthcare & Medicine', label: 'Free Clinics & Medicines', icon: '🩺' },
    { id: 'Education Support', label: 'School Kits & Digital Labs', icon: '📚' },
    { id: 'Livelihood & Skills', label: 'Vocational Training & Jobs', icon: '💼' },
    { id: 'Emergency Shelter', label: 'Emergency Relief & Shelter', icon: '🏠' }
  ];

  // Aid services from verified locations/centers
  const availableServices = [
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
      city: 'Kolkata / Sundarbans',
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

  const filteredServices = categoryFilter === 'All'
    ? availableServices
    : availableServices.filter(s => s.category === categoryFilter);

  // Form Submit Handler
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.need.trim()) {
      return;
    }
    const newReq = addSupportRequest(formData);
    setSearchId(newReq.id);
    setSearchedRequest(newReq);
    setHasSearched(true);
    setActiveTab('status');
    setFormData({
      name: '',
      phone: '',
      city: '',
      category: 'Food & Nutrition',
      need: '',
      urgency: 'Normal'
    });
  };

  // Status Search Handler
  const handleSearchStatus = (e) => {
    e.preventDefault();
    const query = searchId.trim().toLowerCase();
    if (!query) return;

    const match = supportRequests.find(
      r => r.id.toLowerCase() === query || r.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''))
    );
    setSearchedRequest(match || null);
    setHasSearched(true);
  };

  // 4 Progress Stages
  const stages = [
    { title: 'Application Received', desc: 'Registered in system' },
    { title: 'Verified by Field Lead', desc: 'Center verified details' },
    { title: 'Aid Dispatched', desc: 'Supplies or kit on the way' },
    { title: 'Delivered / Completed', desc: 'Assistance handed over' }
  ];

  const getStageIndex = (statusStr) => {
    if (!statusStr) return 0;
    const lower = statusStr.toLowerCase();
    if (lower.includes('delivered') || lower.includes('completed')) return 3;
    if (lower.includes('dispatched') || lower.includes('allocated')) return 2;
    if (lower.includes('verified')) return 1;
    return 0;
  };

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '90vh', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Friendly Hero Banner */}
        <div style={{
          backgroundColor: '#A8D5BA',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '999px',
              padding: '0.35rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              <span>🤝</span> BENEFICIARY SUPPORT HUB
            </div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: '#000000',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.2
            }}>
              We are here to support you.
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#1a1a1a',
              margin: 0,
              maxWidth: '650px',
              lineHeight: 1.5
            }}>
              Access free meals, medical checkups, student learning kits, or emergency aid.
              No complex paperwork. Simple, fast, and completely free.
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #000000',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            textAlign: 'center',
            boxShadow: '3px 3px 0px #000000'
          }}>
            <span style={{ fontSize: '2rem', display: 'block' }}>📞</span>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#666' }}>
              Free Toll-Free Helpline
            </div>
            <a
              href="tel:18002026000"
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#2E7D5B',
                textDecoration: 'none',
                display: 'block',
                marginTop: '0.25rem'
              }}
            >
              1800-202-6000
            </a>
            <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>
              Available 24 hours / 7 days
            </div>
          </div>
        </div>

        {/* 4 Primary Navigation Action Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {[
            { id: 'find', title: '1. Find Help', subtitle: 'Browse free services & centers', icon: '🍲', color: '#FFFBEB' },
            { id: 'apply', title: '2. Request Support', subtitle: 'Quick 2-minute application', icon: '✍️', color: '#E8F5E9' },
            { id: 'status', title: '3. Check Application', subtitle: 'Track your reference ID', icon: '🔍', color: '#E1F5FE' },
            { id: 'helpline', title: '4. Immediate Helpline', subtitle: 'Call or WhatsApp us', icon: '📞', color: '#FFF3E0' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: isSelected ? '#F4B942' : tab.color,
                  border: '3px solid #000000',
                  boxShadow: isSelected ? '4px 4px 0px #000000' : '2px 2px 0px #000000',
                  transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{tab.icon}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#000000', marginBottom: '0.2rem' }}>
                  {tab.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#333333', fontWeight: 500 }}>
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FIND HELP */}
        {activeTab === 'find' && (
          <div>
            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    backgroundColor: categoryFilter === cat.id ? '#2E7D5B' : '#FFFFFF',
                    color: categoryFilter === cat.id ? '#FFFFFF' : '#000000',
                    border: '2px solid #000000',
                    borderRadius: '999px',
                    padding: '0.5rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: categoryFilter === cat.id ? '2px 2px 0px #000000' : 'none'
                  }}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Service Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '3px solid #000000',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '4px 4px 0px #000000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{
                        backgroundColor: '#F4B942',
                        border: '2px solid #000000',
                        borderRadius: '6px',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {service.category}
                      </span>
                      <span style={{
                        backgroundColor: '#A8D5BA',
                        border: '2px solid #000000',
                        borderRadius: '6px',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {service.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#000000' }}>
                      {service.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#444444', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                      {service.description}
                    </p>

                    <div style={{
                      backgroundColor: '#F9F9F9',
                      border: '2px dashed #CCCCCC',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      marginBottom: '1.25rem'
                    }}>
                      <div>📍 <strong>Center:</strong> {service.center} ({service.city})</div>
                      <div style={{ marginTop: '0.25rem' }}>🕒 <strong>Hours:</strong> {service.timing}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${service.phone.replace(/\s+/g, '')}`}
                      style={{
                        flex: '1 1 auto',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        border: '2px solid #000000',
                        borderRadius: '8px',
                        padding: '0.65rem 0.75rem',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '2px 2px 0px #000000'
                      }}
                    >
                      📞 Call Center
                    </a>
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          category: service.category,
                          need: `Requesting assistance under: ${service.title} (${service.center})`
                        }));
                        setActiveTab('apply');
                      }}
                      style={{
                        flex: '1 1 auto',
                        backgroundColor: '#2E7D5B',
                        color: '#FFFFFF',
                        border: '2px solid #000000',
                        borderRadius: '8px',
                        padding: '0.65rem 0.75rem',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 0px #000000'
                      }}
                    >
                      ✍️ Request Support
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Link to Map */}
            <div style={{
              marginTop: '2rem',
              backgroundColor: '#FFFBEB',
              border: '3px solid #000000',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '4px 4px 0px #000000'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.2rem' }}>
                Want to see nearby hubs on an interactive map?
              </h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#555' }}>
                View all verified relief hubs across India or find NGOs within your immediate neighborhood.
              </p>
              <Link
                to="/impact-map"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#F4B942',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #000000'
                }}
              >
                🗺️ Open Interactive Impact Map
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: REQUEST SUPPORT FORM */}
        {activeTab === 'apply' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid #EEEEEE', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#000000' }}>
                ✍️ Request Community Support
              </h2>
              <p style={{ margin: 0, fontSize: '1rem', color: '#555555' }}>
                Fill in these details and our nearest center team will contact you. No documents or charges required.
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Laxmi Devi"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '2px solid #000000',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                    Phone Number (for SMS & Call updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '2px solid #000000',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                    City / Town / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, New Delhi, Bengaluru..."
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '2px solid #000000',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                    Type of Assistance *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '2px solid #000000',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Food & Nutrition">Food & Monthly Ration</option>
                    <option value="Healthcare & Medicine">Healthcare, Checkup & Medicines</option>
                    <option value="Education Support">School Kit, Books & Device</option>
                    <option value="Livelihood & Skills">Vocational Training & Jobs</option>
                    <option value="Emergency Shelter">Emergency Aid & Shelter</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                  What support do you or your family need? *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Please describe briefly what support is needed (e.g. monthly food ration for family of 4, or school textbooks for grade 8 student)..."
                  value={formData.need}
                  onChange={e => setFormData({ ...formData, need: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                  Urgency Level
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Normal', 'Urgent (Within 24 Hours)'].map(level => (
                    <label
                      key={level}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                      }}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        checked={formData.urgency === (level.includes('Urgent') ? 'Urgent' : 'Normal')}
                        onChange={() => setFormData({ ...formData, urgency: level.includes('Urgent') ? 'Urgent' : 'Normal' })}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2E7D5B',
                    color: '#FFFFFF',
                    border: '3px solid #000000',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 0px #000000',
                    width: '100%'
                  }}
                >
                  🚀 Submit Support Application
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CHECK APPLICATION STATUS */}
        {activeTab === 'status' && (
          <div>
            {/* Search Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔍 Check Your Application Status
              </h2>
              <p style={{ margin: '0 0 1rem 0', color: '#555', fontSize: '0.95rem' }}>
                Enter your Application Reference ID (e.g. <code>REQ-101</code>) or your registered Phone Number:
              </p>

              <form onSubmit={handleSearchStatus} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g. REQ-101 or 9876543210"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  style={{
                    flex: '1 1 250px',
                    padding: '0.85rem 1rem',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#F4B942',
                    border: '2px solid #000000',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #000000'
                  }}
                >
                  Track Status
                </button>
              </form>
            </div>

            {/* Search Result or Default Recent View */}
            {hasSearched && !searchedRequest && (
              <div style={{
                backgroundColor: '#FFF0F0',
                border: '3px solid #000000',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '4px 4px 0px #000000'
              }}>
                <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                <h3 style={{ margin: '0.5rem 0', fontWeight: 800 }}>No Application Found</h3>
                <p style={{ color: '#555', margin: '0 0 1rem 0' }}>
                  We couldn't find a record for <strong>{searchId}</strong>. Please double-check your ID or phone number, or submit a new request.
                </p>
                <button
                  onClick={() => setActiveTab('apply')}
                  style={{
                    backgroundColor: '#2E7D5B',
                    color: '#FFF',
                    border: '2px solid #000000',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Submit New Request
                </button>
              </div>
            )}

            {/* Display Active or Found Request Card */}
            {(searchedRequest || (!hasSearched && supportRequests.length > 0)) && (
              (() => {
                const req = searchedRequest || supportRequests[0];
                const currentStageIdx = getStageIndex(req.status);

                return (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '3px solid #000000',
                    boxShadow: '6px 6px 0px #000000',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderBottom: '2px solid #EEEEEE',
                      paddingBottom: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div>
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: '#2E7D5B',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          marginBottom: '0.25rem'
                        }}>
                          Application ID: {req.id}
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#000000' }}>
                          {req.name} ({req.city})
                        </h2>
                      </div>

                      <div style={{
                        backgroundColor: '#A8D5BA',
                        border: '2px solid #000000',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}>
                        Current Status: {req.status}
                      </div>
                    </div>

                    {/* Visual 4-Step Progress Indicator */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        {stages.map((stage, idx) => {
                          const isDone = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={stage.title}
                              style={{
                                textAlign: 'center',
                                padding: '0.75rem 0.25rem',
                                border: '2px solid #000000',
                                borderRadius: '8px',
                                backgroundColor: isCurrent ? '#F4B942' : isDone ? '#A8D5BA' : '#F5F5F5',
                                boxShadow: isCurrent ? '3px 3px 0px #000000' : 'none',
                                fontWeight: 700
                              }}
                            >
                              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                                {isDone ? '✅' : '⏳'}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#000000' }}>
                                Step {idx + 1}
                              </div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
                                {stage.title}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Details Box */}
                    <div style={{
                      backgroundColor: '#FAF9F6',
                      border: '2px solid #000000',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '1rem',
                      fontSize: '0.95rem'
                    }}>
                      <div>
                        <div style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800 }}>Category</div>
                        <div style={{ fontWeight: 700 }}>{req.category}</div>
                      </div>
                      <div>
                        <div style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800 }}>Date Registered</div>
                        <div style={{ fontWeight: 700 }}>{req.date}</div>
                      </div>
                      <div>
                        <div style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800 }}>Assigned Center</div>
                        <div style={{ fontWeight: 700 }}>{req.assignedCenter || 'Impact Bridge Community Center'}</div>
                      </div>
                      <div>
                        <div style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800 }}>Assistance Needed</div>
                        <div style={{ fontWeight: 700 }}>{req.need}</div>
                      </div>
                    </div>

                    {req.notes && (
                      <div style={{
                        marginTop: '1rem',
                        backgroundColor: '#FFFBEB',
                        border: '2px dashed #E6A700',
                        borderRadius: '8px',
                        padding: '1rem',
                        fontSize: '0.9rem'
                      }}>
                        <strong>📝 Field Team Update:</strong> {req.notes}
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB 4: IMMEDIATE HELPLINE & ASSISTANCE */}
        {activeTab === 'helpline' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Toll Free Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #000000',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '6px 6px 0px #000000',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '3rem' }}>📞</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0' }}>
                National Toll-Free Helpline
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Free calls from any phone network across India. Hindi, English, and regional languages supported.
              </p>
              <a
                href="tel:18002026000"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#2E7D5B',
                  color: '#FFFFFF',
                  border: '3px solid #000000',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  textDecoration: 'none',
                  boxShadow: '4px 4px 0px #000000'
                }}
              >
                1800-202-6000
              </a>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
                Available 24 Hours a Day, 365 Days a Year
              </div>
            </div>

            {/* WhatsApp Chat Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #000000',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '6px 6px 0px #000000',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '3rem' }}>💬</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0' }}>
                WhatsApp Direct Helpdesk
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Send us a WhatsApp message to ask questions, share location, or check supplies.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hello%20Impact%20Bridge%2C%20I%20need%20community%20assistance"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#25D366',
                  color: '#000000',
                  border: '3px solid #000000',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  textDecoration: 'none',
                  boxShadow: '4px 4px 0px #000000'
                }}
              >
                Chat on WhatsApp
              </a>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
                Average response time: Under 15 minutes
              </div>
            </div>

            {/* Emergency Guidelines */}
            <div style={{
              backgroundColor: '#FFFBEB',
              border: '3px solid #000000',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '6px 6px 0px #000000',
              gridColumn: '1 / -1'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>
                🚨 Critical Emergency Quick Contacts
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ backgroundColor: '#FFF', padding: '1rem', border: '2px solid #000', borderRadius: '8px' }}>
                  <strong>Ambulance:</strong> <a href="tel:108" style={{ fontWeight: 800, color: '#2E7D5B' }}>108</a>
                </div>
                <div style={{ backgroundColor: '#FFF', padding: '1rem', border: '2px solid #000', borderRadius: '8px' }}>
                  <strong>Disaster Management:</strong> <a href="tel:1078" style={{ fontWeight: 800, color: '#2E7D5B' }}>1078</a>
                </div>
                <div style={{ backgroundColor: '#FFF', padding: '1rem', border: '2px solid #000', borderRadius: '8px' }}>
                  <strong>Women Helpline:</strong> <a href="tel:1091" style={{ fontWeight: 800, color: '#2E7D5B' }}>1091</a>
                </div>
                <div style={{ backgroundColor: '#FFF', padding: '1rem', border: '2px solid #000', borderRadius: '8px' }}>
                  <strong>Childline:</strong> <a href="tel:1098" style={{ fontWeight: 800, color: '#2E7D5B' }}>1098</a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
