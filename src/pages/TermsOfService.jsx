import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  FileCheck2,
  ShieldCheck,
  HeartHandshake,
  CreditCard,
  Users,
  AlertTriangle,
  Scale,
  Award,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="terms-of-service-page" style={{ paddingBottom: '4rem' }}>
      {/* 1. TOP HEADER BANNER */}
      <section
        style={{
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)',
          padding: 'clamp(2rem, 5vw, 3.5rem) 0'
        }}
      >
        <div className="nb-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem' }}>
            <Link to="/home" style={{ color: 'var(--brand-dark-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={16} strokeWidth={2.5} /> Home
            </Link>
            <span>/</span>
            <span style={{ color: '#5A6F64' }}>Legal</span>
            <span>/</span>
            <span style={{ color: 'var(--text-dark)' }}>Terms of Service</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <Badge variant="yellow" size="md">STATUTORY CHARTER</Badge>
            <Badge variant="green" size="md">INDIAN TRUSTS ACT 1882</Badge>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              lineHeight: 1.15,
              marginBottom: '1rem'
            }}
          >
            Terms of Service & Operational Charter
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              fontWeight: 600,
              color: '#3A4E44',
              maxWidth: '840px',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}
          >
            These Terms of Service ("Terms") govern your use of the website, community portals, donation services, volunteer coordination infrastructure, and field programs of Impact Bridge Public Charitable Trust. By accessing our platform or contributing to our programs, you agree to be bound by these Terms.
          </p>

          {/* Legal Trust Meta Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#26332D',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              borderRadius: '6px',
              padding: '0.75rem 1.25rem',
              maxWidth: 'fit-content'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} color="var(--brand-dark-green)" />
              <span>Trust Reg: <strong>IV-19028/2021</strong></span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Scale size={16} color="var(--brand-dark-green)" />
              <span>Jurisdiction: <strong>New Delhi, India</strong></span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--brand-dark-green)" />
              <span>Last Revised: <strong>September 2026</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <section className="nb-container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>

          {/* Core Operating Principle Card */}
          <div
            style={{
              backgroundColor: 'var(--brand-light-green)',
              border: 'var(--border-thick)',
              borderRadius: '6px',
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}
          >
            <ShieldCheck size={28} color="var(--brand-dark-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 0.4rem 0', color: 'var(--brand-dark-green)' }}>
                Fiduciary Integrity & Secular Public Purpose
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#26332D', margin: 0, lineHeight: 1.5 }}>
                Impact Bridge is established exclusively for non-profit charitable purposes. All public donations, CSR allocations, and volunteer hours are deployed transparently without discrimination on the grounds of religion, race, caste, sex, or place of birth.
              </p>
            </div>
          </div>

          {/* Section 1: Voluntary Donations & 80G Tax Certificates */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-yellow)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                1
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Voluntary Donations & Section 80G Tax Exemption
              </h2>
            </div>
            
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              All financial donations made to Impact Bridge are voluntary, irrevocable gifts dedicated to public charitable initiatives. By making a financial contribution, you confirm that:
            </p>

            <ul style={{ paddingLeft: '1.4rem', fontSize: '0.92rem', color: '#26332D', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              <li><strong>Source of Funds:</strong> The funds remitted originate from legitimate legal sources and comply with the Prevention of Money Laundering Act (PMLA), 2002.</li>
              <li><strong>Tax Exemption Eligibility:</strong> Donations are eligible for a 50% deduction under Section 80G of the Income Tax Act, 1961, subject to the furnishing of a valid PAN number at the time of remittance.</li>
              <li><strong>Form 10BE Certificate:</strong> Automated electronic receipts with Unique Registration Numbers are issued instantly upon payment settlement. Formal certificates of donation (Form 10BE) are filed with the Income Tax Department annually by May 31st.</li>
              <li><strong>Refund Policy:</strong> Because funds are immediately mobilized for procurement of essential supplies (food kits, solar labs, medicine), donations are strictly non-refundable once settled, except in verified cases of technical payment duplicate debits reported within 7 days.</li>
            </ul>
          </Card>

          {/* Section 2: Volunteer Code of Conduct */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--brand-light-green)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                2
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Field Volunteer Code of Conduct & Safeguarding
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Volunteers represent the Trust and are held to rigorous ethical standards during field assignments:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '4px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--brand-dark-green)', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} /> Child Protection & POCSO Compliance
                </div>
                <p style={{ fontSize: '0.85rem', color: '#3A4E44', margin: 0, lineHeight: 1.5 }}>
                  Zero tolerance for physical, emotional, or verbal abuse of minors. Strict adherence to the Protection of Children from Sexual Offences (POCSO) Act.
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF9EE', border: '1.5px solid #000', borderRadius: '4px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#B45309', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} /> Community Dignity & Anti-Exploitation
                </div>
                <p style={{ fontSize: '0.85rem', color: '#3A4E44', margin: 0, lineHeight: 1.5 }}>
                  No unauthorized photography or recording of vulnerable beneficiaries for personal social media channels without informed institutional consent.
                </p>
              </div>

              <div style={{ backgroundColor: '#EFF6FF', border: '1.5px solid #000', borderRadius: '4px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#1D4ED8', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} /> Non-Commercialization
                </div>
                <p style={{ fontSize: '0.85rem', color: '#3A4E44', margin: 0, lineHeight: 1.5 }}>
                  Volunteers may not solicit gifts, commercial commissions, or personal favors from beneficiary families or partner organizations.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 3: Intellectual Property & Creative Commons */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-yellow)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                3
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Audited Reports & Open Research Commons
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Impact metrics, audited financial disclosures, and project impact evaluations published by Impact Bridge are made accessible under the <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</strong> license to encourage academic research, policy reform, and civil society transparency.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#5A6F64', margin: 0 }}>
              The Impact Bridge name, brand trademarks, logos, and digital system software remain the proprietary intellectual property of Impact Bridge Public Charitable Trust.
            </p>
          </Card>

          {/* Section 4: External Integrations & Map Disclaimers */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--brand-light-green)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                4
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Third-Party Services & OpenStreetMap Licensing
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Our interactive geospatial map utilizes OpenStreetMap (OSM) data queried via public Overpass APIs. OSM geographic information is licensed under the <strong>Open Database License (ODbL 1.0)</strong> by the OpenStreetMap Foundation.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#5A6F64', margin: 0 }}>
              Impact Bridge provides geospatial nearby NGO locations as a public community directory. Users are advised to verify center operating hours and ground access directly prior to dispatching physical materials or visiting field centers.
            </p>
          </Card>

          {/* Section 5: Governing Law & Dispute Jurisdiction */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-yellow)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                5
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Governing Law & Legal Jurisdiction
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              These Terms, their interpretation, and any non-contractual obligations or claims arising out of or in connection with them shall be governed by and construed in accordance with the substantive laws of the Republic of India.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#5A6F64', margin: 0 }}>
              Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or invalidity thereof shall be subject to the exclusive jurisdiction of the competent civil courts at <strong>New Delhi, India</strong>.
            </p>
          </Card>

          {/* Action Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '2px solid #E2ECE6', paddingTop: '1.5rem' }}>
            <Link to="/privacy" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="sm">
                ← View Privacy Policy
              </Button>
            </Link>
            <Link to="/donation" style={{ textDecoration: 'none' }}>
              <Button variant="yellow" size="sm" icon={CreditCard}>
                Donate with 80G Exemption
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
