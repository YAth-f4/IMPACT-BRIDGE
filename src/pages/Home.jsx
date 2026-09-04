import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import StatCard from '../components/common/StatCard';
import ProgramCard from '../components/common/ProgramCard';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { IMPACT_STORIES } from '../data/mockData';
import {
  Heart,
  Users,
  Building2,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smile,
  Zap,
  Globe
} from 'lucide-react';

export default function Home() {
  const { programs, ngoProfile } = useApp();

  const featuredPrograms = programs.slice(0, 6);

  return (
    <div className="home-page" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: 'var(--border-thick)',
          backgroundColor: '#EBF4EF',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="nb-container">
          {/* Animated Marquee Ticker */}
          <div
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid #000',
              boxShadow: '3px 3px 0px #000',
              borderRadius: '4px',
              padding: '6px 12px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflow: 'hidden'
            }}
          >
            <span
              style={{
                backgroundColor: 'var(--black)',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.05em'
              }}
            >
              LIVE IMPACT
            </span>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                animation: 'marquee 30s linear infinite'
              }}
            >
              ⚡ ₹1.84+ Cr Distributed • 45,200+ Beneficiaries Supported Across 8 States • 1,280+ Active Field Volunteers • 100% Tax Deductible 80G Certified • 28 Live Community Programs
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '3rem',
              alignItems: 'center'
            }}
            className="hero-grid"
          >
            <style>{`
              @media (max-width: 900px) {
                .hero-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {/* Left Content */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <Badge variant="yellow" size="md">
                  🚀 India’s Modern NGO Platform
                </Badge>
                <Badge variant="lightgreen" size="md">
                  Section 80G Certified
                </Badge>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  lineHeight: 1.05,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.03em'
                }}
              >
                CONNECTING <span style={{ color: 'var(--brand-dark-green)', textDecoration: 'underline decoration-black decoration-4' }}>PEOPLE</span>.<br />
                CREATING <span style={{ backgroundColor: 'var(--accent-yellow)', padding: '0 8px', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}>IMPACT</span>.
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#3A4E44',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  maxWidth: '560px'
                }}
              >
                IMPACT BRIDGE unites passionate volunteers, transparent donors, and grassroots Indian communities through cutting-edge digital operations, real-time telemetry, and accountable community programs.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/donation" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="yellow"
                    size="lg"
                    icon={Heart}
                  >
                    Donate Now (Save Tax)
                  </Button>
                </Link>
                <Link to="/volunteer" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="green"
                    size="lg"
                    icon={Users}
                  >
                    Become a Volunteer
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginTop: '2rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#5A6F64',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={16} color="var(--brand-dark-green)" /> 100% Verified Impact
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} color="var(--brand-dark-green)" /> Form 10BE Issued
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={16} color="var(--brand-dark-green)" /> FCRA Ministry Registered
                </span>
              </div>
            </div>

            {/* Right Neo-Brutalist Visual Card Stack */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  backgroundColor: 'var(--brand-light-green)',
                  border: 'var(--border-thick)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-2xl)',
                  padding: '1.75rem',
                  position: 'relative'
                }}
              >
                {/* Floating Corner Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    right: '-16px',
                    backgroundColor: 'var(--accent-yellow)',
                    border: '2px solid #000',
                    boxShadow: '3px 3px 0 #000',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    transform: 'rotate(4deg)'
                  }}
                >
                  TRANSPARENT NGO 2026
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '220px',
                    border: '2px solid #000',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '1.25rem'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
                    alt="Community Impact"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Grassroots Transformation Across India
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#26332D', fontWeight: 600, lineHeight: 1.5, marginBottom: '1rem' }}>
                  From digital classrooms in Dharavi to rain harvesting in the Thar Desert, our data-backed interventions deliver measurable change.
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#2E7D5B', borderRadius: '50%', border: '1.5px solid #000' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Next Volunteer Orientation</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--brand-dark-green)' }}>
                    This Sunday 11 AM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATISTICS SECTION */}
      <section className="nb-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Badge variant="yellow">REAL-TIME METRICS</Badge>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
            Audited Impact Across Grassroots India
          </h2>
          <p style={{ color: '#5A6F64', fontWeight: 600, maxWidth: '600px', margin: '0.4rem auto 0' }}>
            Every rupee donated and volunteer hour committed is tracked with mathematical precision and field transparency.
          </p>
        </div>

        <div className="grid-4">
          <StatCard
            title="Total Registered Volunteers"
            value={formatNumber(ngoProfile.stats.totalVolunteers)}
            subtitle="Engaged in 140+ communities"
            icon={Users}
            variant="lightgreen"
            trend={{ value: '+18% this quarter', isPositive: true }}
          />
          <StatCard
            title="Beneficiaries Supported"
            value={formatNumber(ngoProfile.stats.beneficiariesSupported)}
            subtitle="Directly verified individuals"
            icon={Smile}
            variant="yellow"
            trend={{ value: '+3,400 this month', isPositive: true }}
          />
          <StatCard
            title="Active Programs"
            value={formatNumber(ngoProfile.stats.activePrograms)}
            subtitle="64 successfully completed"
            icon={Building2}
            variant="default"
          />
          <StatCard
            title="Total Funds Raised"
            value={formatCurrency(ngoProfile.stats.totalDonationsRaised, true)}
            subtitle="100% Tax Deductible (80G)"
            icon={Heart}
            variant="green"
            trend={{ value: '₹16.5L monthly run-rate', isPositive: true }}
          />
        </div>
      </section>

      {/* 3. MISSION, VISION & 4 CORE PILLARS */}
      <section style={{ backgroundColor: 'var(--white)', borderTop: 'var(--border-thick)', borderBottom: 'var(--border-thick)', padding: '4rem 0' }}>
        <div className="nb-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }} className="hero-grid">
            <div>
              <Badge variant="green">OUR MISSION</Badge>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                Bridging the Divide Between Resources and Need
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#3A4E44', fontWeight: 500 }}>
                Our mission is to engineer transparent, scalable, and technology-driven interventions that break inter-generational cycles of poverty, hunger, and illiteracy across India's most vulnerable rural and urban settlements.
              </p>
            </div>

            <div>
              <Badge variant="yellow">OUR VISION</Badge>
              <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                An Empowered, Self-Sustaining Community Ecosystem
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#3A4E44', fontWeight: 500 }}>
                We envision an equitable society where quality education, primary healthcare, disaster resilience, and economic dignity are universal rights, unlocked by community participation and transparent philanthropy.
              </p>
            </div>
          </div>

          {/* 4 Pillars */}
          <div className="grid-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Radical Transparency',
                desc: 'Audited monthly ledgers, geotagged proof of work, and real-time beneficiary tracking.'
              },
              {
                icon: Zap,
                title: 'Technology-First',
                desc: 'Solar labs, satellite telemedicine, and digital dashboards for rapid ground response.'
              },
              {
                icon: Users,
                title: 'Community Ownership',
                desc: 'Locally elected village committees and women collectives lead all program decisions.'
              },
              {
                icon: Sparkles,
                title: 'Sustainable Impact',
                desc: 'Focus on root-cause eradication rather than short-term emergency band-aids.'
              }
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Card key={i} variant="default" hover={true} style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: 'var(--accent-yellow)',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      boxShadow: '2px 2px 0 #000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {pillar.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#5A6F64', lineHeight: 1.5, fontWeight: 500 }}>
                    {pillar.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROGRAMS SECTION */}
      <section className="nb-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Badge variant="yellow">TRANSFORMATIVE INTERVENTIONS</Badge>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
              Featured Programs & Initiatives
            </h2>
            <p style={{ color: '#5A6F64', fontWeight: 600 }}>
              Discover our active ground initiatives across education, nutrition, health, and emergency support.
            </p>
          </div>

          <Link to="/programs" style={{ textDecoration: 'none' }}>
            <Button
              variant="green"
              iconRight={ArrowRight}
            >
              View All Programs ({programs.length})
            </Button>
          </Link>
        </div>

        <div className="grid-3">
          {featuredPrograms.map((prog) => (
            <ProgramCard key={prog.id} prog={prog} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* 5. IMPACT MAP PREVIEW SECTION */}
      <section
        style={{
          backgroundColor: '#EBF4EF',
          borderTop: 'var(--border-thick)',
          borderBottom: 'var(--border-thick)',
          padding: '4rem 0'
        }}
      >
        <div className="nb-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="hero-grid">
            <div>
              <Badge variant="green">GEOGRAPHIC PRESENCE</Badge>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                Interactive Field Impact Map
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#3A4E44', fontWeight: 500, marginBottom: '1.5rem' }}>
                Explore live geotagged centers, mobile health clinic routes, community kitchens, and disaster response hubs deployed in real-time across urban slums and remote tribal districts.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  '18+ Verified Field Hubs & Telemedicine Outposts',
                  'Coverage across 8 States: Maharashtra, Delhi NCR, UP, Rajasthan, Assam, Karnataka, etc.',
                  'Live Volunteer Task Allocations & Ground Leads'
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                    <CheckCircle2 size={18} color="var(--brand-dark-green)" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <Link to="/impact-map" style={{ textDecoration: 'none' }}>
                <Button
                  variant="yellow"
                  size="lg"
                  icon={MapPin}
                >
                  Launch Full Impact Map
                </Button>
              </Link>
            </div>

            {/* Tactical Map Mockup Card */}
            <Link to="/impact-map" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: 'var(--border-thick)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem' }}>
                    📍 PAN-INDIA COVERAGE
                  </span>
                  <Badge variant="yellow" size="sm">LIVE RADAR</Badge>
                </div>

                <div
                  style={{
                    height: '240px',
                    backgroundColor: '#D6E9DE',
                    border: '2px solid #000',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ textAlign: 'center', zIndex: 10 }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: 'var(--accent-yellow)',
                        border: '2.5px solid #000',
                        boxShadow: '3px 3px 0 #000',
                        borderRadius: '50%',
                        margin: '0 auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MapPin size={28} strokeWidth={2.5} color="var(--black)" />
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900 }}>Click to Open Geographic Map</h4>
                    <p style={{ fontSize: '0.8rem', color: '#5A6F64', fontWeight: 700 }}>Inspect 18 Active Field Centers</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. IMPACT STORIES & TESTIMONIALS */}
      <section className="nb-container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="yellow">GROUND VOICES</Badge>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
            Stories of Resilience and Transformation
          </h2>
          <p style={{ color: '#5A6F64', fontWeight: 600 }}>
            Hear directly from the individuals, mothers, and youth whose lives are reshaped every day.
          </p>
        </div>

        <div className="grid-3">
          {IMPACT_STORIES.map((story) => (
            <Card key={story.id} variant="lightgreen" hover={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <Badge variant="white" size="sm">{story.program}</Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>📍 {story.location}</span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                  "{story.title}"
                </h4>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  "{story.quote}"
                </p>
              </div>

              <div style={{ borderTop: '2px solid #000', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>— {story.author}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5A6F64' }}>{story.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. DONATION CALL TO ACTION BANNER */}
      <section className="nb-container">
        <div
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            color: '#FFFFFF',
            border: 'var(--border-thick)',
            boxShadow: 'var(--shadow-2xl)',
            borderRadius: '8px',
            padding: '3rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <Badge variant="yellow" size="md">EVERY RUPEE COUNTS</Badge>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              Join Hands to Build a Stronger India Today
            </h2>
            <p style={{ color: '#D6E9DE', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
              Your tax-deductible contribution funds child education kits, hot nutritious meals, and rural telemedicine vans. Instant 80G tax receipt issued.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
            <Link to="/donation" style={{ textDecoration: 'none' }}>
              <Button
                variant="yellow"
                size="lg"
                icon={Heart}
                fullWidth
              >
                Make a Donation
              </Button>
            </Link>
            <Link to="/volunteer" style={{ textDecoration: 'none' }}>
              <Button
                variant="white"
                size="md"
                icon={Users}
                fullWidth
              >
                Join as Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
