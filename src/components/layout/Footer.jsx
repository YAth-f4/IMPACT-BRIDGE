import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Heart, MapPin, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Footer() {
  const { ngoProfile, addToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();

    // 1. Prevent submission when email is empty or invalid and show clear inline error
    if (!trimmed) {
      setEmailError('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('Please enter a valid email address (e.g., name@example.com).');
      return;
    }

    setEmailError('');
    setIsSubmitting(true);
    setServerMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: trimmed })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to complete subscription. Please try again.');
      }

      setIsSubscribed(true);
      setServerMessage(data.message || 'You are subscribed to the Monthly Impact Dispatch!');
      addToast(data.message || 'Subscribed to Monthly Impact Dispatch!', 'success');
      setNewsletterEmail('');
    } catch (err) {
      console.error('[Footer Newsletter Error]', err);
      setEmailError(err.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
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
            padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 3vw, 1.75rem)',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            flexWrap: 'wrap',
            color: 'var(--black)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 280px' }}>
            <div
              style={{
                backgroundColor: 'var(--brand-dark-green)',
                color: '#FFFFFF',
                padding: '0.65rem',
                border: '2px solid #000',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(1rem, 2.5vw, 1.15rem)' }}>
                100% Tax Deductible under Section 80G & 12A
              </h4>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3A4841' }}>
                Reg: {ngoProfile.tax80GNumber} • MHA FCRA Accredited • Form 10BE issued instantly.
              </p>
            </div>
          </div>

          <Link to="/donation" style={{ textDecoration: 'none' }}>
            <Button
              variant="green"
              size="md"
              icon={Heart}
            >
              Donate & Save Tax
            </Button>
          </Link>
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
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <BrandLogo size="md" isDark={true} />
            </Link>
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
                { label: 'Home Page', path: '/home' },
                { label: 'About & Governance', path: '/about' },
                { label: 'Programs & Initiatives', path: '/programs' },
                { label: 'Geographic Impact Map', path: '/impact-map' },
                { label: 'Volunteer Sign-up', path: '/volunteer' },
                { label: 'Online Donations', path: '/donation' },
                { label: 'Admin Portal', path: '/admin/dashboard' }
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      color: '#D2DDD7',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--accent-yellow)')}
                    onMouseLeave={(e) => (e.target.style.color = '#D2DDD7')}
                  >
                    <ArrowRight size={13} strokeWidth={2.5} />
                    {item.label}
                  </Link>
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
            {isSubscribed ? (
              <div
                style={{
                  backgroundColor: 'var(--brand-light-green)',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0 #000',
                  borderRadius: '6px',
                  padding: '1rem',
                  color: '#26332D'
                }}
                role="status"
                aria-live="polite"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '0.92rem', color: 'var(--brand-dark-green)', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} /> Subscribed Successfully!
                </div>
                <p style={{ fontSize: '0.82rem', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
                  {serverMessage || 'Thank you! You will receive our next Monthly Impact Dispatch.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubscribed(false);
                    setServerMessage('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--brand-dark-green)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Subscribe another email →
                </button>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="footer-newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                  Email address for Monthly Impact Dispatch
                </label>
                <div>
                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your email"
                    className="nb-input"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'footer-newsletter-error' : undefined}
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      fontSize: '0.88rem',
                      padding: '0.6rem 0.8rem',
                      border: emailError ? '2px solid #FF8A8A' : '2px solid #000000',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {emailError && (
                    <div
                      id="footer-newsletter-error"
                      role="alert"
                      style={{
                        color: '#FFA8A8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <AlertCircle size={14} style={{ flexShrink: 0 }} />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>
                <Button type="submit" variant="yellow" size="sm" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to Dispatch'}
                </Button>
              </form>
            )}
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
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to="/privacy"
              style={{ color: '#D2DDD7', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-yellow)')}
              onMouseLeave={(e) => (e.target.style.color = '#D2DDD7')}
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              style={{ color: '#D2DDD7', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-yellow)')}
              onMouseLeave={(e) => (e.target.style.color = '#D2DDD7')}
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              to="/donation"
              style={{ color: '#D2DDD7', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-yellow)')}
              onMouseLeave={(e) => (e.target.style.color = '#D2DDD7')}
            >
              80G Tax Exemption Guide
            </Link>
            <span>•</span>
            <Link
              to="/about"
              style={{ color: '#D2DDD7', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-yellow)')}
              onMouseLeave={(e) => (e.target.style.color = '#D2DDD7')}
            >
              FCRA Disclosures
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
