import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import { TEAM_MEMBERS } from '../../data/mockData';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  Heart,
  Target,
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  const { navigateTo, ngoProfile } = useApp();

  const timelineEvents = [
    {
      year: '2018',
      title: 'Foundation & Legal Inception',
      desc: 'Founded by Sunita Rao and Prof. Devendra Joshi in New Delhi with a grant to study digital education gaps in urban slums.'
    },
    {
      year: '2020',
      title: 'Emergency COVID-19 Relief Grid',
      desc: 'Distributed 250,000+ hot meals and deployed 40 oxygen concentrators across Delhi NCR during lockdowns.'
    },
    {
      year: '2022',
      title: 'Arogya Vahini Mobile Telemedicine',
      desc: 'Launched first satellite-linked clinical telemetry van in Melghat forest tribal hamlets, serving 8,000+ patients.'
    },
    {
      year: '2024',
      title: 'Jal Chetna Desert Rainwater Taankas',
      desc: 'Constructed 65 underground community reservoirs in Barmer, Rajasthan, bringing potable water to 6,200 desert residents.'
    },
    {
      year: '2025-26',
      title: 'Nationwide Digital Platform Scale',
      desc: 'Launched Impact Bridge Platform uniting 1,280+ volunteers and 28 ongoing projects across 8 Indian states.'
    }
  ];

  const approaches = [
    {
      step: '01',
      title: 'Grassroots Data Audit',
      desc: 'We conduct baseline socio-economic and demographic field surveys to pinpoint exact community bottlenecks before committing funds.'
    },
    {
      step: '02',
      title: 'Co-Design with Locals',
      desc: 'Programs are co-developed with village panchayats and slum youth committees to guarantee 100% local ownership and cultural resonance.'
    },
    {
      step: '03',
      title: 'Digital Field Telemetry',
      desc: 'Every ration kit, tablet, and medical checkup is logged in real-time via geotagged mobile audits on our central NGO ledger.'
    },
    {
      step: '04',
      title: 'Self-Sustaining Exit',
      desc: 'We build local leadership capacity to transition projects into independent community cooperatives within 18–24 months.'
    }
  ];

  return (
    <div className="about-page" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: '#EBF4EF',
          borderBottom: 'var(--border-thick)'
        }}
      >
        <div className="nb-container">
          <Badge variant="yellow" size="md">ABOUT IMPACT BRIDGE FOUNDATION</Badge>
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
            Engineering Dignity, Opportunity & Resilience Across India
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
            Registered in 2018 as a Public Charitable Trust (Reg: {ngoProfile.registrationNumber}), IMPACT BRIDGE is dedicated to bridging structural divides in child education, rural medicine, and community resilience.
          </p>
        </div>
      </section>

      {/* 2. MISSION, VISION & OBJECTIVES */}
      <section className="nb-container">
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          <Card variant="green" hover={true} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Compass size={24} color="var(--accent-yellow)" />
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem' }}>Our Mission</h3>
            </div>
            <p style={{ color: '#D6E9DE', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
              To deploy technology-driven, transparent, and scalable grassroots interventions that uplift marginalized families out of poverty and equip the next generation with digital skills.
            </p>
          </Card>

          <Card variant="yellow" hover={true} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={24} color="#000000" />
              <h3 style={{ color: '#000000', fontSize: '1.35rem' }}>Our Vision</h3>
            </div>
            <p style={{ color: '#26332D', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600 }}>
              An equitable India where every child has a digital classroom, every patient receives primary care, and every community owns drought and flood resilience infrastructure.
            </p>
          </Card>

          <Card variant="lightgreen" hover={true} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target size={24} color="var(--brand-dark-green)" />
              <h3 style={{ color: '#26332D', fontSize: '1.35rem' }}>Strategic Goals</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700 }}>
              <li>✓ 100,000 Beneficiaries by 2027</li>
              <li>✓ 50 Solar-Powered Slum Labs</li>
              <li>✓ 100% Clean Water Access in 25 Desert Villages</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 3. OUR 4-STEP SYSTEMATIC APPROACH */}
      <section
        style={{
          backgroundColor: 'var(--white)',
          borderTop: 'var(--border-thick)',
          borderBottom: 'var(--border-thick)',
          padding: '4rem 0'
        }}
      >
        <div className="nb-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="yellow">METHODOLOGY</Badge>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
              Our 4-Step Systematic Approach
            </h2>
            <p style={{ color: '#5A6F64', fontWeight: 600, maxWidth: '600px', margin: '0.4rem auto 0' }}>
              How we transform philanthropic capital into long-term community autonomy.
            </p>
          </div>

          <div className="grid-4">
            {approaches.map((app) => (
              <Card key={app.step} variant="default" hover={true} style={{ padding: '1.75rem', position: 'relative' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'var(--brand-dark-green)',
                    opacity: 0.25,
                    position: 'absolute',
                    top: '12px',
                    right: '16px'
                  }}
                >
                  {app.step}
                </div>

                <Badge variant="green" size="sm" style={{ marginBottom: '1rem' }}>
                  PHASE {app.step}
                </Badge>

                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                  {app.title}
                </h4>

                <p style={{ fontSize: '0.88rem', color: '#3A4E44', lineHeight: 1.5, fontWeight: 500 }}>
                  {app.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE & JOURNEY */}
      <section className="nb-container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Badge variant="yellow">OUR MILESTONES</Badge>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
            A Journey of Relentless Grassroots Service
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
          {timelineEvents.map((evt, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start'
              }}
            >
              {/* Year Stamp */}
              <div
                style={{
                  width: '90px',
                  backgroundColor: 'var(--accent-yellow)',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0 #000',
                  borderRadius: '4px',
                  padding: '8px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}
              >
                {evt.year}
              </div>

              {/* Detail Card */}
              <Card variant="default" hover={false} style={{ flex: 1, padding: '1.25rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                  {evt.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#5A6F64', lineHeight: 1.5, fontWeight: 500 }}>
                  {evt.desc}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LEADERSHIP & TRUSTEES TEAM */}
      <section style={{ backgroundColor: '#EBF4EF', borderTop: 'var(--border-thick)', padding: '4rem 0' }}>
        <div className="nb-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="green">GOVERNANCE & TRUSTEES</Badge>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
              Leadership Driving Grassroots Impact
            </h2>
          </div>

          <div className="grid-4">
            {TEAM_MEMBERS.map((member, i) => (
              <Card key={i} variant="default" hover={true} style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '200px', width: '100%', borderBottom: '2px solid #000' }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>
                    {member.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)', marginBottom: '0.6rem' }}>
                    {member.role}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#5A6F64', lineHeight: 1.4, fontWeight: 500 }}>
                    {member.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
