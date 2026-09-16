import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  ShieldCheck,
  Lock,
  FileText,
  Mail,
  AlertCircle,
  CheckCircle,
  Eye,
  Database,
  Users,
  ArrowLeft,
  Building2,
  Calendar
} from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page" style={{ paddingBottom: '4rem' }}>
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
            <span style={{ color: 'var(--text-dark)' }}>Privacy Policy</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <Badge variant="yellow" size="md">LEGAL COMPLIANCE</Badge>
            <Badge variant="green" size="md">DPDP ACT 2023 COMPLIANT</Badge>
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
            Privacy & Data Protection Policy
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
            This Policy sets out how Impact Bridge Public Charitable Trust collects, protects, utilizes, and manages personal data provided by donors, volunteers, beneficiaries, and web visitors in strict accordance with the Digital Personal Data Protection (DPDP) Act, 2023, Information Technology Act, 2000, and Indian public trust statutory requirements.
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
              <ShieldCheck size={16} color="var(--brand-dark-green)" />
              <span>NITI Aayog Darpan: <strong>DL/2021/0298174</strong></span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--brand-dark-green)" />
              <span>Last Updated: <strong>September 2026</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <section className="nb-container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
          
          {/* Statutory Highlight Box */}
          <div
            style={{
              backgroundColor: '#FFF9DB',
              border: 'var(--border-thick)',
              borderRadius: '6px',
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}
          >
            <AlertCircle size={28} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 0.4rem 0' }}>
                Zero Commercial Exploitation Guarantee
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#26332D', margin: 0, lineHeight: 1.5 }}>
                Impact Bridge is a certified non-profit charitable trust. We <strong>never sell, rent, trade, or lease</strong> donor, volunteer, or beneficiary personal information to any third-party marketing agency, broker, or commercial enterprise under any circumstance.
              </p>
            </div>
          </div>

          {/* Section 1: Entity Details & Scope */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--brand-light-green)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                1
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Identity of the Data Fiduciary
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              This Policy applies to all digital properties, websites, APIs, and ground outreach programs operated by <strong>Impact Bridge Public Charitable Trust</strong> (hereinafter referred to as "Impact Bridge", "the Trust", "we", "us", or "our"). The Trust is established and duly registered under the Indian Trusts Act, 1882, holding valid registrations under Sections 12A and 80G of the Income Tax Act, 1961.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#5A6F64', margin: 0 }}>
              Registered Office: Plot 42, Institutional Area, Sector 44, New Delhi - 110003, India. For the purposes of applicable data privacy legislation, Impact Bridge acts as the <em>Data Fiduciary</em> for all personal data entrusted to us.
            </p>
          </Card>

          {/* Section 2: Categories of Personal Data Collected */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-yellow)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                2
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Categories of Information We Collect
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '6px', padding: '1rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: 'var(--brand-dark-green)', marginBottom: '0.5rem' }}>
                  A. Donors & CSR Partners
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#26332D', lineHeight: 1.6 }}>
                  <li>Full legal name and organization/entity name</li>
                  <li>Email address and phone number for receipt delivery</li>
                  <li>Permanent Account Number (PAN) strictly required under Indian Tax Law for Section 80G deduction certificate Form 10BE</li>
                  <li>Billing address and citizenship declaration</li>
                  <li>Transaction reference number and payment confirmation</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#FAF9EE', border: '1.5px solid #000', borderRadius: '6px', padding: '1rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#B45309', marginBottom: '0.5rem' }}>
                  B. Field Volunteers & Changemakers
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#26332D', lineHeight: 1.6 }}>
                  <li>Name, age verification, and contact coordinates</li>
                  <li>Skill profiles, educational background, languages spoken</li>
                  <li>City and geographic availability for mobilization</li>
                  <li>Emergency contact details for ground deployments</li>
                  <li>Logged volunteer service hours and contribution records</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#EFF6FF', border: '1.5px solid #000', borderRadius: '6px', padding: '1rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#1D4ED8', marginBottom: '0.5rem' }}>
                  C. Beneficiaries & Communities
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#26332D', lineHeight: 1.6 }}>
                  <li>Family welfare status and relief requirement assessment</li>
                  <li>Community geography (village, ward, district)</li>
                  <li>Affirmative consent records for aid delivery and monitoring</li>
                  <li>Photographic/video documentation strictly with informed consent</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 3: Statutory 80G Tax Reporting */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--brand-light-green)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                3
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Income Tax Department & Form 10BD / 10BE Compliance
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Under Rule 18AB of the Income-tax Rules, 1962, every charitable organization approved under Section 80G of the Income Tax Act, 1961 is mandated by statutory regulation to furnish a Statement of Donations in <strong>Form No. 10BD</strong> to the Directorate of Income Tax (Systems) on an annual basis.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#5A6F64', margin: 0 }}>
              To enable you to claim 50% tax deduction on your voluntary contribution, we must report your donor name, complete address, donation amount, and PAN (or Aadhaar/Passport for non-resident donors). Failure to furnish accurate PAN details may render the donation ineligible for automated pre-filling in your Annual Information Statement (AIS) and Form 26AS.
            </p>
          </Card>

          {/* Section 4: Financial Payment Security */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-yellow)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                4
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Banking Security & PCI-DSS Standards
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Impact Bridge uses certified payment aggregator gateways (such as Razorpay, UPI QR networks, and direct NEFT/RTGS bank transfers) complying with the highest level of Payment Card Industry Data Security Standards (<strong>PCI-DSS Level 1</strong>).
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#F0F7F2', border: '1.5px solid #000', borderRadius: '6px', padding: '0.85rem 1.25rem' }}>
              <Lock size={20} color="var(--brand-dark-green)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-dark-green)' }}>
                Zero Card Retention: We never store, capture, or log your credit card numbers, CVVs, expiry dates, or banking PINs on any server or internal application database.
              </span>
            </div>
          </Card>

          {/* Section 5: Data Subject Rights */}
          <Card style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--brand-light-green)', border: '2px solid #000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                5
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                Your Rights Under the DPDP Act, 2023
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '1rem' }}>
              As a Data Principal, you are entitled to statutory rights regarding personal data handled by Impact Bridge:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', border: '1.5px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Right to Information:</strong>
                <span style={{ fontSize: '0.85rem', color: '#5A6F64' }}>Request confirmation and summary of personal data being processed.</span>
              </div>
              <div style={{ padding: '0.85rem', border: '1.5px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Right to Correction:</strong>
                <span style={{ fontSize: '0.85rem', color: '#5A6F64' }}>Rectify inaccurate, outdated, or incomplete personal details.</span>
              </div>
              <div style={{ padding: '0.85rem', border: '1.5px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Right to Erasure:</strong>
                <span style={{ fontSize: '0.85rem', color: '#5A6F64' }}>Withdraw consent and request data deletion, subject to mandatory statutory tax audit retention laws (7 years).</span>
              </div>
              <div style={{ padding: '0.85rem', border: '1.5px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Right of Grievance Redressal:</strong>
                <span style={{ fontSize: '0.85rem', color: '#5A6F64' }}>Expedited hearing and resolution through our designated Grievance Officer within 15 business days.</span>
              </div>
            </div>
          </Card>

          {/* Section 6: Grievance Officer & Official Contact */}
          <Card variant="lightgreen" style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              Designated Grievance Redressal Officer
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#26332D', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              In accordance with Section 11 of the DPDP Act, 2023, and Rule 5(9) of the Information Technology Rules, 2011, the details of our official Grievance Officer are set out below:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#FFFFFF', border: '2px solid #000', borderRadius: '6px', padding: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Officer Name</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 800, fontSize: '1rem' }}>Shri Rajiv K. Deshmukh</p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#5A6F64' }}>Head of Compliance & Legal Governance</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Official Email</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 800, fontSize: '1rem' }}>
                  <a href="mailto:grievance@impactbridge.org.in" style={{ color: 'var(--brand-dark-green)', textDecoration: 'none' }}>
                    grievance@impactbridge.org.in
                  </a>
                </p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#5A6F64' }}>Subject: Attention: Grievance Redressal</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A6F64', textTransform: 'uppercase' }}>Registered Address</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 700, fontSize: '0.88rem' }}>
                  Impact Bridge Public Charitable Trust, Sector 44, New Delhi - 110003
                </p>
              </div>
            </div>
          </Card>

          {/* Action Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '2px solid #E2ECE6', paddingTop: '1.5rem' }}>
            <Link to="/terms" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="sm">
                View Terms of Service →
              </Button>
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <Button variant="yellow" size="sm" icon={Mail}>
                Contact Legal Helpdesk
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
