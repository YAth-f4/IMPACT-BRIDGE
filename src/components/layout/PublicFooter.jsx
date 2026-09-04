import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Heart, MapPin, Phone, Mail, Award, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PublicFooter() {
  const { navigateTo, ngoProfile, addToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast('Thank you for subscribing to Impact Bridge newsletter!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#26332D',
        color: '#FFFFFF',
        borderTop: 'var(--border-thick)',
        marginTop: '4rem',
        paddingTop: '3.5rem',
        paddingBottom: '2rem'
      }}
    >
      <div className="nb-container">
        {/* Top Highlight Banner: 80G Tax Exemption & Transparency */}
        <div
          style={{
            backgroundColor: 'var(--accent-yellow)',
            border: 'var(--border-thick)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '6px',
            padding: '1.25rem 1.75rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            color: 'var(--black)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: 'var(--brand-dark-green)',
                color: '#FFFFFF',
                padding: '0.65rem',
                border: '2px solid #000',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem' }}>
                100% Tax Deductible under Section 80G & 12A
              </h4>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3A4841' }}>
                Reg: {ngoProfile.tax80GNumber} • MHA FCRA Accredited • Form 10BE issued instantly.
              </p>
            </div>
          </div>

          <Button
            variant="green"
            size="md"
            icon={Heart}
            onClick={() => navigateTo('donate')}
          >
            Donate & Save Tax
          </Button>
        </div>

        {/* 4 Main Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Column 1: Organization & About */}
          <div>
            <BrandLogo size="md" isDark={true} />
            <p style={{ color: '#D2DDD7', fontSize: '0.88rem', marginTop: '1rem', lineHeight: 1.6 }}>
              IMPACT BRIDGE is a non-profit technology foundation empowering underserved communities across India through digitized education, emergency relief, maternal nutrition, and rural healthcare telemetry.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <Badge variant="yellow" size="sm">NITI Aayog Darpan</Badge>
              <Badge variant="lightgreen" size="sm">80G Approved</Badge>
              <Badge variant="white" size="sm">FCRA Active</Badge>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                color: 'var(--accent-yellow)',
                borderBottom: '2px solid #3A4E44',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              {[
                { label: 'Home Page', view: 'home' },
                { label: 'About & Governance', view: 'about' },
                { label: 'Programs & Initiatives', view: 'programs' },
                { label: 'Geographic Impact Map', view: 'impact-map' },
                { label: 'Volunteer Sign-up', view: 'volunteer' },
                { label: 'Online Donations', view: 'donate' },
                { label: 'Admin Portal Login', view: 'admin-dashboard' }
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => navigateTo(item.view)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D2DDD7',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: 0
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--accent-yellow)')}
                    onMouseLeave={(e) => (e.target.style.color = '#D2DDD7')}
                  >
                    <ArrowRight size={13} strokeWidth={2.5} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Headquarters */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                color: 'var(--accent-yellow)',
                borderBottom: '2px solid #3A4E44',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              Contact & Helpline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#D2DDD7' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--brand-light-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{ngoProfile.hqAddress}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--brand-light-green)" style={{ flexShrink: 0 }} />
                <span>{ngoProfile.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--brand-light-green)" style={{ flexShrink: 0 }} />
                <span>{ngoProfile.email}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Impact Dispatch Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                color: 'var(--accent-yellow)',
                borderBottom: '2px solid #3A4E44',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              Monthly Impact Dispatch
            </h4>
            <p style={{ color: '#D2DDD7', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Receive audited field reports, volunteer stories, and project milestone updates directly in your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="nb-input"
                style={{ backgroundColor: '#FFFFFF', color: '#000000', fontSize: '0.88rem', padding: '0.6rem 0.8rem' }}
              />
              <Button type="submit" variant="yellow" size="sm" fullWidth>
                Subscribe to Dispatch
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div
          style={{
            borderTop: '2px solid #3A4E44',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#A0B5AA'
          }}
        >
          <div>
            © {new Date().getFullYear()} {ngoProfile.name}. All rights reserved. Registered Indian Public Charitable Trust.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>80G Tax Exemption Guide</span>
            <span>•</span>
            <span>FCRA Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
