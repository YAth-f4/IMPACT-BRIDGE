import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import { Input, Select, Textarea } from '../components/common/Input';
import StatCard from '../components/common/StatCard';
import confetti from 'canvas-confetti';
import {
  Users,
  Heart,
  Clock,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Plus,
  BookOpen
} from 'lucide-react';

export default function Volunteer() {
  const { addVolunteer, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('join'); // 'join' | 'opportunities' | 'dashboard'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    skills: 'Teaching, Social Work',
    interests: 'Education',
    availability: 'Weekends (6 hrs/week)',
    emergencyContact: '',
    notes: ''
  });

  // Volunteer Mock Dashboard State
  const [mockVolunteer, setMockVolunteer] = useState({
    name: 'Aarav Sharma',
    city: 'Mumbai',
    skills: ['Python Coding', 'STEM Teaching', 'Graphic Design'],
    hoursLogged: 142,
    badges: ['Top Mentor 2024', '100+ Hours Club', 'Star Educator', 'Certified Field Lead'],
    assignedPrograms: ['PRG-101 (GyanSetu Digital Classrooms)', 'PRG-107 (Yuva Kaushal Bootcamp)'],
    upcomingEvents: [
      { date: 'This Sunday, 10:00 AM', title: 'STEM Workshop: Scratch Game Design', loc: 'Dharavi Slum Center' },
      { date: 'Next Saturday, 2:00 PM', title: 'Laptop Distribution & Coding Boot', loc: 'Koramangala Academy' }
    ]
  });

  const [newLogHours, setNewLogHours] = useState('');
  const [newLogActivity, setNewLogActivity] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    const created = addVolunteer({
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()),
      interests: [formData.interests]
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setMockVolunteer({
      name: created.name,
      city: created.city,
      skills: created.skills,
      hoursLogged: 0,
      badges: ['New Changemaker', 'Welcome 2026'],
      assignedPrograms: ['PRG-101 (GyanSetu Digital Classrooms)'],
      upcomingEvents: [
        { date: 'Next Sunday, 11:00 AM', title: 'New Volunteer Orientation & Kit Distribution', loc: 'Online & Local Center' }
      ]
    });

    setActiveTab('dashboard');
    addToast('Welcome to the Impact Bridge volunteer community!', 'success');
  };

  const handleLogHours = (e) => {
    e.preventDefault();
    if (!newLogHours || isNaN(newLogHours)) return;

    setMockVolunteer((prev) => ({
      ...prev,
      hoursLogged: prev.hoursLogged + Number(newLogHours)
    }));

    addToast(`Successfully logged ${newLogHours} volunteer hours!`, 'success');
    setNewLogHours('');
    setNewLogActivity('');
  };

  return (
    <div className="volunteer-page" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">JOIN THE VOLUNTEER MOVEMENT</Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              marginTop: '0.75rem',
              marginBottom: '1rem',
              lineHeight: 1.1
            }}
          >
            Your Time & Skills Can Change a Life
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#3A4E44',
              maxWidth: '820px',
              lineHeight: 1.6
            }}
          >
            Over 1,280 active professionals, university students, and grassroots mentors volunteer with Impact Bridge every week.
          </p>
        </div>
      </section>

      {/* 2. TABS NAVIGATOR */}
      <section className="nb-container">
        <Tabs
          tabs={[
            { id: 'join', label: '1. Volunteer Registration Form', icon: Users },
            { id: 'opportunities', label: '2. Explore Open Roles', icon: Sparkles },
            { id: 'dashboard', label: '3. Volunteer Dashboard Mockup', icon: Award }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* TAB 1: REGISTRATION FORM */}
        {activeTab === 'join' && (
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }} className="hero-grid">
            <style>{`
              @media (max-width: 900px) {
                .hero-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {/* Form */}
            <Card style={{ padding: '2rem', border: 'var(--border-thick)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>
                  Volunteer Application
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#5A6F64', fontWeight: 600 }}>
                  Fill out this quick profile. Our regional coordinator will contact you within 48 hours.
                </p>
              </div>

              <form onSubmit={handleRegister}>
                <div className="grid-2">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="radhika@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="Phone Number"
                    required
                    placeholder="+91 98201 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Select
                    label="Preferred City / Region"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    options={[
                      { value: 'Mumbai', label: 'Mumbai, MH' },
                      { value: 'New Delhi', label: 'New Delhi NCR' },
                      { value: 'Bengaluru', label: 'Bengaluru, KA' },
                      { value: 'Amravati', label: 'Amravati / Melghat, MH' },
                      { value: 'Varanasi', label: 'Varanasi, UP' },
                      { value: 'Jaipur', label: 'Jaipur, RJ' },
                      { value: 'Guwahati', label: 'Guwahati / Morigaon, AS' }
                    ]}
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="Skills & Expertise"
                    placeholder="e.g. Coding, Teaching, Medicine, First Aid"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    helperText="Comma separated list"
                  />
                  <Select
                    label="Area of Interest"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    options={[
                      { value: 'Education', label: 'Education & STEM Mentorship' },
                      { value: 'Food & Nutrition', label: 'Food Drives & Nutrition Kits' },
                      { value: 'Healthcare', label: 'Healthcare Clinics & Palliative' },
                      { value: 'Women Empowerment', label: 'Women & Artisan Collectives' },
                      { value: 'Emergency Support', label: 'Emergency Flood Relief' }
                    ]}
                  />
                </div>

                <div className="grid-2">
                  <Select
                    label="Weekly Availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    options={[
                      { value: 'Weekends (4-8 hrs/week)', label: 'Weekends (4-8 hrs/week)' },
                      { value: 'Weekday Evenings (4-6 hrs/week)', label: 'Weekday Evenings (4-6 hrs/week)' },
                      { value: 'Monthly Intensive Camps', label: 'Monthly Intensive Camps' },
                      { value: 'Remote / Online Mentorship', label: 'Remote / Online Mentorship' }
                    ]}
                  />
                  <Input
                    label="Emergency Contact Info"
                    placeholder="Name & Contact number"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Why do you want to volunteer with Impact Bridge?"
                  placeholder="Share a few words about your motivation or past volunteer experiences..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <Button type="submit" variant="yellow" size="lg" fullWidth icon={Send}>
                  Submit Volunteer Application
                </Button>
              </form>
            </Card>

            {/* Why Volunteer Value Props */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card variant="lightgreen" hover={true} style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Why Join Us?</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--brand-dark-green)" style={{ flexShrink: 0 }} />
                    <span><strong>Direct Grassroots Connection:</strong> Work directly in smart labs, medical vans, and relief staging centers.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--brand-dark-green)" style={{ flexShrink: 0 }} />
                    <span><strong>Verified Certificate of Hours:</strong> Earn official volunteer certificates recognized by universities and CSR boards.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--brand-dark-green)" style={{ flexShrink: 0 }} />
                    <span><strong>Skill-Based Mentoring:</strong> Apply your coding, medicine, design, or accounting expertise where it creates maximum leverage.</span>
                  </li>
                </ul>
              </Card>

              <Card variant="yellow" hover={true} style={{ padding: '1.5rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                  Volunteer Perks & Badges
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#26332D', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Unlock physical badges, Impact Bridge field gear, and leadership tracks as you log milestone hours.
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Badge variant="green" size="sm">50+ Hours</Badge>
                  <Badge variant="white" size="sm">100+ Hours Club</Badge>
                  <Badge variant="blue" size="sm">Lead Field Mentor</Badge>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: OPEN OPPORTUNITIES */}
        {activeTab === 'opportunities' && (
          <div style={{ marginTop: '2rem' }}>
            <div className="grid-3">
              {[
                {
                  role: 'STEM & Coding Mentor',
                  prog: 'GyanSetu Digital Classrooms',
                  loc: 'Dharavi, Mumbai',
                  commitment: 'Saturdays, 3 hrs',
                  desc: 'Teach basic Python and Scratch to children in grades 6-9 in our solar-powered community lab.',
                  badge: 'High Priority'
                },
                {
                  role: 'Community Kitchen Coordinator',
                  prog: 'Annapurna Seva Poshan Kitchen',
                  loc: 'Okhla, New Delhi',
                  commitment: 'Mon-Fri Evenings',
                  desc: 'Oversee packaging and hygienic dispatch of 1,000+ hot nutritional thalis to daily wage workers.',
                  badge: 'Immediate'
                },
                {
                  role: 'Telemedicine Support Lead',
                  prog: 'Arogya Vahini Mobile Van',
                  loc: 'Amravati, Melghat',
                  commitment: 'Monthly Weekend Camp',
                  desc: 'Assist doctors in conducting diagnostic ECGs, vitals registration, and generic medicine distribution in tribal padas.',
                  badge: 'Medical / Nursing'
                },
                {
                  role: 'E-Commerce Cataloguer',
                  prog: 'Sakhi Udyam Weavers Collective',
                  loc: 'Varanasi / Remote',
                  commitment: 'Flexible (4 hrs/week)',
                  desc: 'Help women handloom artisans photograph stoles, write product tags, and list products on e-commerce marketplaces.',
                  badge: 'Remote Friendly'
                },
                {
                  role: 'Rapid Flood Relief Responder',
                  prog: 'Suraksha Flood Resilience',
                  loc: 'Guwahati, Assam',
                  commitment: 'On-Call Emergencies',
                  desc: 'Trained first responders assisting in speed-boat dry ration delivery and water purification tablet distribution.',
                  badge: 'Field Ops'
                },
                {
                  role: 'Graphic Designer & Storyteller',
                  prog: 'Communications & Impact Reports',
                  loc: 'New Delhi / Remote',
                  commitment: 'Flexible (3 hrs/week)',
                  desc: 'Create visual infographics and field impact reports for annual donor disclosures.',
                  badge: 'Creative'
                }
              ].map((opp, i) => (
                <Card key={i} hover={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <Badge variant="yellow" size="sm">{opp.badge}</Badge>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5A6F64' }}>📍 {opp.loc}</span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.35rem' }}>
                      {opp.role}
                    </h4>
                    <p style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-dark-green)', marginBottom: '0.75rem' }}>
                      {opp.prog}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#5A6F64', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {opp.desc}
                    </p>
                  </div>

                  <div style={{ borderTop: '1.5px solid #E2ECE6', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>⏳ {opp.commitment}</span>
                    <Button variant="green" size="sm" onClick={() => setActiveTab('join')}>
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VOLUNTEER DASHBOARD MOCKUP */}
        {activeTab === 'dashboard' && (
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Volunteer Stats */}
            <div className="grid-4">
              <StatCard
                title="Hours Contributed"
                value={`${mockVolunteer.hoursLogged} hrs`}
                subtitle="Certified on field ledger"
                icon={Clock}
                variant="yellow"
              />
              <StatCard
                title="Active Assigned Programs"
                value="2 Initiatives"
                subtitle="Dharavi & Bengaluru"
                icon={BookOpen}
                variant="lightgreen"
              />
              <StatCard
                title="Badges Unlocked"
                value={`${mockVolunteer.badges.length} Badges`}
                subtitle="Level 3 Senior Mentor"
                icon={Award}
                variant="default"
              />
              <StatCard
                title="Verified Impact Score"
                value="99.2%"
                subtitle="Top 5% nationwide"
                icon={ShieldCheck}
                variant="green"
              />
            </div>

            {/* 2-Column Dashboard Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="hero-grid">
              {/* Left: Assigned Programs & Upcoming Roster */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                    📅 Upcoming Volunteer Schedule
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {mockVolunteer.upcomingEvents.map((evt, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.85rem 1rem',
                          backgroundColor: '#F0F7F2',
                          border: '2px solid #000',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>
                            {evt.date}
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{evt.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#5A6F64', fontWeight: 600 }}>📍 {evt.loc}</div>
                        </div>
                        <Button variant="yellow" size="sm">
                          Confirm Roster
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Log Hours Form */}
                <Card variant="lightgreen" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    ⏱️ Log New Volunteer Hours
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#26332D', marginBottom: '1rem', fontWeight: 600 }}>
                    Log completed field sessions for supervisor verification and certificate issuance.
                  </p>
                  <form onSubmit={handleLogHours} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <Input
                      label="Hours"
                      type="number"
                      placeholder="e.g. 4"
                      required
                      value={newLogHours}
                      onChange={(e) => setNewLogHours(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                    <Input
                      label="Activity Description"
                      placeholder="e.g. Conducted Scratch coding class"
                      value={newLogActivity}
                      onChange={(e) => setNewLogActivity(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                    <Button type="submit" variant="yellow" icon={Plus}>
                      Log
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Right: Volunteer Profile & Badges */}
              <div>
                <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '3px solid #000',
                      boxShadow: '3px 3px 0 #000',
                      overflow: 'hidden',
                      margin: '0 auto 1rem'
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                      alt="Volunteer Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem' }}>
                    {mockVolunteer.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#5A6F64', fontWeight: 700, marginBottom: '1rem' }}>
                    📍 {mockVolunteer.city} • Volunteer ID: IB-VOL-8821
                  </p>

                  <div style={{ borderTop: '2px solid #E2ECE6', paddingTop: '1rem', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
                      Earned Badges
                    </h4>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {mockVolunteer.badges.map((b, idx) => (
                        <Badge key={idx} variant="yellow" size="sm">
                          ⭐ {b}
                        </Badge>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#5A6F64', marginBottom: '0.5rem' }}>
                      Core Skills
                    </h4>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {mockVolunteer.skills.map((s, idx) => (
                        <Badge key={idx} variant="white" size="sm">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
