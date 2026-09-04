import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Input, Select, Textarea } from '../components/common/Input';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';

export default function Contact() {
  const { sendMessage, addToast } = useApp();

  const [formData, setFormData] = useState({
    senderName: '',
    email: '',
    phone: '',
    category: 'General Public',
    subject: '',
    content: ''
  });

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.senderName || !formData.email || !formData.content) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    sendMessage(formData);
    setFormData({
      senderName: '',
      email: '',
      phone: '',
      category: 'General Public',
      subject: '',
      content: ''
    });
  };

  const regionalOffices = [
    {
      city: 'New Delhi (National HQ)',
      address: 'Plot 42, Institutional Area, Lodhi Road, New Delhi 110003',
      phone: '+91 11 4987 6500',
      email: 'delhi.hq@impactbridge.org',
      lead: 'Director Sunita Rao'
    },
    {
      city: 'Mumbai Slum Innovation Base',
      address: '90 Feet Road, Dharavi Urban Labs, Mumbai 400017',
      phone: '+91 22 2407 1199',
      email: 'mumbai@impactbridge.org',
      lead: 'Dr. Ananya Iyer'
    },
    {
      city: 'Bengaluru Tech for Good Lab',
      address: '100 Feet Road, 4th Block Koramangala, Bengaluru 560034',
      phone: '+91 80 2553 7780',
      email: 'bengaluru@impactbridge.org',
      lead: 'Karthik Narayanan'
    },
    {
      city: 'Guwahati Northeast Relief Base',
      address: 'Riverfront Disaster Staging Post, Morigaon, Assam 782105',
      phone: '+91 361 245 9901',
      email: 'assam.relief@impactbridge.org',
      lead: 'Pranabjyoti Barman'
    }
  ];

  const faqs = [
    {
      q: 'How do I claim 80G tax exemption for my donation?',
      a: 'Immediately after donating on our website, you can download your official 80G Tax Exemption Certificate (Form 10BE compliant) with your PAN card number embedded. We also file annual Form 10BD with the Income Tax Department.'
    },
    {
      q: 'Can corporate companies allocate CSR grants to Impact Bridge?',
      a: 'Yes, Impact Bridge Foundation is registered on the MCA portal (CSR Reg #CSR00019288) and meets all Schedule VII mandates for education, healthcare, hunger, and rural development.'
    },
    {
      q: 'How are volunteers selected and trained?',
      a: 'Once you submit your volunteer registration, our regional volunteer lead conducts a 30-minute orientation session and assigns you to a local ground program or online mentorship track based on your skills and availability.'
    },
    {
      q: 'How can our local village apply for clean water or education support?',
      a: 'Village Panchayats and self-help groups can submit a project proposal through our contact form under "Community Partnership" or contact our nearest regional hub.'
    }
  ];

  return (
    <div className="contact-page" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">GET IN TOUCH</Badge>
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
            We Are Here to Listen, Collaborate & Act
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
            Reach out for CSR partnerships, volunteer inquiries, media requests, or ground community collaborations.
          </p>
        </div>
      </section>

      {/* 2. 24/7 EMERGENCY HELPLINE BANNER */}
      <section className="nb-container">
        <div
          style={{
            backgroundColor: 'var(--accent-yellow)',
            border: 'var(--border-thick)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '6px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#000000',
                color: 'var(--accent-yellow)',
                padding: '0.65rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ShieldAlert size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem' }}>
                24/7 Emergency Flood & Medical Helpline
              </h4>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#26332D' }}>
                For disaster rescue in flood zones or urgent tribal medical van dispatches: Call toll-free <strong>1800-419-8800</strong>
              </p>
            </div>
          </div>

          <Button variant="green" size="md" icon={Phone}>
            Call Emergency Desk
          </Button>
        </div>
      </section>

      {/* 3. CONTACT FORM & REGIONAL HUBS */}
      <section className="nb-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }} className="hero-grid">
          <style>{`
            @media (max-width: 900px) {
              .hero-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* Left: Contact Form */}
          <Card style={{ padding: '2rem', border: 'var(--border-thick)' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              Send an Official Message
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#5A6F64', fontWeight: 600, marginBottom: '1.5rem' }}>
              Your inquiry will be directly routed to the corresponding department lead.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <Input
                  label="Your Full Name"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <Input
                  label="Contact Phone"
                  placeholder="+91 98000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Select
                  label="Inquiry Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'General Public', label: 'General Inquiry / Public' },
                    { value: 'Donors', label: 'CSR & Philanthropic Grant' },
                    { value: 'Volunteers', label: 'Volunteer Question' },
                    { value: 'Contact Form', label: 'Media & Field Collaboration' }
                  ]}
                />
              </div>

              <Input
                label="Subject Line"
                placeholder="e.g. Partnership inquiry for solar classrooms"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <Textarea
                label="Your Message"
                rows={5}
                required
                placeholder="Please provide complete details regarding your request or proposal..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />

              <Button type="submit" variant="yellow" size="lg" fullWidth icon={Send}>
                Dispatch Message to Impact Bridge Team
              </Button>
            </form>
          </Card>

          {/* Right: Regional Centers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>
              🏛️ Regional Hubs & Offices
            </h3>

            {regionalOffices.map((office, i) => (
              <Card key={i} variant={i === 0 ? 'lightgreen' : 'default'} hover={true} style={{ padding: '1.25rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                  {office.city}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#3A4E44', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                  📍 {office.address}
                </p>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '2px', color: 'var(--text-dark)' }}>
                  <span>📞 {office.phone}</span>
                  <span>✉️ {office.email}</span>
                  <span style={{ color: 'var(--brand-dark-green)', marginTop: '4px' }}>Lead: {office.lead}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="nb-container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="yellow">FREQUENTLY ASKED QUESTIONS</Badge>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
            Everything You Need to Know
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '820px', margin: '0 auto' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <Card
                key={idx}
                hover={false}
                style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
              >
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    backgroundColor: isOpen ? 'var(--brand-light-green)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
                </div>

                {isOpen && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '2px solid #000', backgroundColor: '#FFFFFF', fontSize: '0.92rem', color: '#3A4E44', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
