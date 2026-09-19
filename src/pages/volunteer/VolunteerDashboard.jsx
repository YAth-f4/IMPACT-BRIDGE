import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import {
  Users,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock3,
  MapPin,
  Send,
  Plus,
  BookOpen,
  LogOut,
  Bell,
  Settings,
  Briefcase,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function VolunteerDashboard() {
  const {
    currentUser,
    logoutUser,
    addToast,
    fetchMyVolunteerApplications,
    submitVolunteerHours,
    programs
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'applications' | 'opportunities' | 'hours' | 'profile'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Log hours modal state
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logHours, setLogHours] = useState('2.5');
  const [logProgram, setLogProgram] = useState('GyanSetu: Digital Classrooms');
  const [isSubmittingHours, setIsSubmittingHours] = useState(false);

  // Load real applications for this volunteer from backend
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const userApps = await fetchMyVolunteerApplications();
      if (isMounted) {
        setApplications(userApps);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [fetchMyVolunteerApplications]);

  const activeApp = applications[0] || null;
  const totalHoursLogged = applications.reduce((acc, a) => acc + (a.hoursLogged || 0), 0) + (activeApp ? 0 : 45);

  const handleLogHours = async (e) => {
    e.preventDefault();
    if (!logHours || Number(logHours) <= 0) {
      addToast('Please enter a valid number of hours', 'error');
      return;
    }

    setIsSubmittingHours(true);
    const res = await submitVolunteerHours(Number(logHours), logProgram);
    setIsSubmittingHours(false);

    if (res.success) {
      setLogModalOpen(false);
      // Reload applications
      const updated = await fetchMyVolunteerApplications();
      setApplications(updated);
    }
  };

  const opportunities = [
    {
      id: 'OPP-01',
      title: 'Digital Literacy & Coding Mentor',
      program: 'GyanSetu: Digital Classrooms',
      location: 'Mumbai Slum Innovation Lab (Dharavi)',
      timing: 'Saturdays, 10:00 AM - 1:00 PM',
      category: 'Education & Tech',
      spots: 4,
      skills: 'Basic Computer, Scratch, Motivation'
    },
    {
      id: 'OPP-02',
      title: 'Weekend Nutrition Ration Distribution',
      program: 'Annapurna Seva: Poshan & Daily Meals',
      location: 'Okhla Mega Nutrition Kitchen, New Delhi',
      timing: 'Sundays, 11:30 AM - 2:30 PM',
      category: 'Nutrition & Food Relief',
      spots: 6,
      skills: 'Packing, Logistics, Community Interaction'
    },
    {
      id: 'OPP-03',
      title: 'Mobile Healthcare Camp Assistant',
      program: 'Sundarbans Floating Clinic',
      location: 'Sundarbans, West Bengal',
      timing: 'Alternate Fridays, Full Day',
      category: 'Healthcare & Aid',
      spots: 2,
      skills: 'First Aid, Patient Record Registration'
    }
  ];

  return (
    <div style={{ minHeight: '88vh', backgroundColor: 'var(--bg-offwhite)', padding: 'clamp(1rem, 3vw, 2.5rem) 1rem' }}>
      <div className="nb-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Header Card */}
        <div
          style={{
            backgroundColor: 'var(--brand-dark-green)',
            color: '#FFFFFF',
            border: 'var(--border-thick)',
            borderRadius: '6px',
            boxShadow: '6px 6px 0px #000000',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-yellow)',
                border: '2.5px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '3px 3px 0px #000'
              }}
            >
              🌱
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
                  Welcome back, {currentUser?.name || 'Changemaker'}!
                </h1>
                <Badge variant="yellow" size="sm">VOLUNTEER PORTAL</Badge>
              </div>
              <p style={{ color: 'var(--brand-light-green)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                Empowering communities one hour at a time. Verified Member ID: {currentUser?.id}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="yellow"
              size="sm"
              icon={Plus}
              onClick={() => setLogModalOpen(true)}
            >
              Log Hours
            </Button>
            <Button
              variant="white"
              size="sm"
              icon={LogOut}
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            borderBottom: '2.5px solid #000',
            paddingBottom: '0.5rem'
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Stats', icon: Users },
            { id: 'applications', label: 'My Applications', icon: Briefcase },
            { id: 'opportunities', label: 'Volunteer Opportunities', icon: BookOpen },
            { id: 'hours', label: 'Participation & Hours', icon: Clock },
            { id: 'profile', label: 'My Profile', icon: Award }
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
                  padding: '0.5rem 0.9rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: isActive ? '3px 3px 0px #000' : '1px 1px 0px #000',
                  transition: 'all 0.1s ease'
                }}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stat Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <StatCard
                title="Service Hours"
                value={`${totalHoursLogged}h`}
                change="+5h this month"
                isPositive={true}
                icon={Clock}
                variant="green"
              />
              <StatCard
                title="Application Status"
                value={activeApp ? activeApp.status : 'APPROVED'}
                change="Verified Member"
                isPositive={true}
                icon={Award}
                variant="yellow"
              />
              <StatCard
                title="Enrolled Programs"
                value="2 Active"
                change="GyanSetu, Annapurna"
                isPositive={true}
                icon={Briefcase}
                variant="white"
              />
              <StatCard
                title="Badges Earned"
                value="4 Badges"
                change="Star Changemaker"
                isPositive={true}
                icon={Sparkles}
                variant="lightgreen"
              />
            </div>

            {/* Application Status Banner */}
            <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📋</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>
                      Latest Volunteer Application Status
                    </h3>
                  </div>
                  <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.35rem 0 0 0' }}>
                    Application ID: <strong>{activeApp?.id || 'REQ-VOL-2026-001'}</strong> • Registered under{' '}
                    <strong>{currentUser?.email}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '4px',
                      border: '2px solid #000',
                      fontWeight: 900,
                      fontSize: '0.82rem',
                      backgroundColor:
                        (activeApp?.status || 'APPROVED') === 'APPROVED'
                          ? 'var(--brand-light-green)'
                          : (activeApp?.status || 'APPROVED') === 'PENDING'
                          ? 'var(--accent-yellow)'
                          : '#FFEAEA',
                      boxShadow: '2px 2px 0px #000'
                    }}
                  >
                    STATUS: {(activeApp?.status || 'APPROVED')}
                  </span>
                  <Button variant="white" size="sm" onClick={() => setActiveTab('applications')}>
                    View Application History
                  </Button>
                </div>
              </div>

              {activeApp?.adminNotes && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#E8F3EE',
                    border: '1.5px solid #2E7D5B',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}
                >
                  <strong>Admin Note:</strong> {activeApp.adminNotes}
                </div>
              )}
            </Card>

            {/* Upcoming Schedule */}
            <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1rem' }}>
                📅 Upcoming Volunteering Sessions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    title: 'Scratch Coding Lab for Dharavi Youth',
                    date: 'This Sunday, 10:00 AM - 1:00 PM',
                    loc: 'Mumbai Slum Innovation Lab, Dharavi',
                    type: 'Teaching & Mentorship'
                  },
                  {
                    title: 'Dry Ration Packing & Quality Audit',
                    date: 'Next Saturday, 2:00 PM - 5:00 PM',
                    loc: 'Okhla Community Shed, Delhi',
                    type: 'Field Operations'
                  }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{s.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#5A6F64', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                        <span>🕒 {s.date}</span>
                        <span>📍 {s.loc}</span>
                      </div>
                    </div>
                    <Badge variant="green" size="sm">{s.type}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Applications */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                  My Volunteer Applications
                </h2>
                <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                  Track review status of your volunteer profiles and role applications.
                </p>
              </div>
              <Link to="/volunteer" style={{ textDecoration: 'none' }}>
                <Button variant="yellow" size="sm" icon={Plus}>
                  Submit New Application
                </Button>
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading application status...</div>
            ) : applications.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p>No active applications on record. Submit an application to volunteer with our field hubs!</p>
                <Link to="/volunteer" style={{ textDecoration: 'none' }}>
                  <Button variant="yellow" size="sm">Apply Now</Button>
                </Link>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                          {app.name}
                        </h3>
                        <Badge
                          variant={app.status === 'APPROVED' ? 'green' : app.status === 'PENDING' ? 'yellow' : 'red'}
                          size="sm"
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <div style={{ color: '#5A6F64', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                        ID: {app.id} • Submitted: {new Date(app.createdAt).toLocaleDateString()} • City: {app.city}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div><strong>Email:</strong> {app.email}</div>
                    <div><strong>Phone:</strong> {app.phone}</div>
                    <div><strong>Availability:</strong> {app.availability}</div>
                    <div><strong>Hours Logged:</strong> {app.hoursLogged || 0} hrs</div>
                  </div>

                  {app.skills && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.82rem' }}>Skills:</strong>
                      {app.skills.map((sk, idx) => (
                        <span key={idx} style={{ backgroundColor: '#EDF4F0', border: '1px solid #000', borderRadius: '3px', padding: '1px 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {app.adminNotes && (
                    <div style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', backgroundColor: '#F2F8F4', border: '1px solid #2E7D5B', borderRadius: '4px', fontSize: '0.82rem' }}>
                      <strong>Coordinator Remarks:</strong> {app.adminNotes}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Opportunities */}
        {activeTab === 'opportunities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                Volunteer Opportunities
              </h2>
              <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                Open callings from verified Impact Bridge centers looking for dedicated volunteers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {opportunities.map((opp) => (
                <Card key={opp.id} style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <Badge variant="lightgreen" size="sm">{opp.category}</Badge>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-dark-green)' }}>
                        {opp.spots} Open Spots
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      {opp.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#5A6F64', marginBottom: '0.5rem' }}>
                      <strong>Program:</strong> {opp.program}
                    </div>

                    <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                      <div>📍 {opp.location}</div>
                      <div>🕒 {opp.timing}</div>
                      <div>🛠️ <em>Skills needed:</em> {opp.skills}</div>
                    </div>
                  </div>

                  <Button
                    variant="yellow"
                    size="sm"
                    style={{ width: '100%' }}
                    onClick={() => addToast(`Interest registered for "${opp.title}". Field lead notified!`, 'success')}
                  >
                    Express Interest
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Participation & Hours */}
        {activeTab === 'hours' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                  Service Hours & Participation
                </h2>
                <p style={{ color: '#5A6F64', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                  Log and audit your volunteer hours to earn certificates and badges.
                </p>
              </div>

              <Button variant="yellow" size="sm" icon={Plus} onClick={() => setLogModalOpen(true)}>
                Log Service Hours
              </Button>
            </div>

            <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#F7FAF8', border: '1.5px solid #000', borderRadius: '4px', marginBottom: '1rem' }}>
                <Clock size={36} color="var(--brand-dark-green)" strokeWidth={2.5} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                    {totalHoursLogged} Total Verified Hours
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#5A6F64' }}>
                    Recognized under National Community Service Volunteer Certificate 2026
                  </div>
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Recent Logged Activities
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { hours: 2.5, prog: 'GyanSetu: Digital Classrooms', date: '2026-09-15', task: 'Conducted Scratch coding orientation' },
                  { hours: 2.0, prog: 'Annapurna Seva: Poshan & Daily Meals', date: '2026-09-10', task: 'Meal box packing & community distribution' },
                  { hours: 3.5, prog: 'GyanSetu: Digital Classrooms', date: '2026-09-02', task: 'Tablet kit software updates & tutoring' }
                ].map((l, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', border: '1px solid #000', borderRadius: '4px', backgroundColor: '#FFFFFF', fontSize: '0.85rem' }}>
                    <div>
                      <strong>{l.prog}</strong> — <span>{l.task}</span>
                      <div style={{ fontSize: '0.75rem', color: '#5A6F64' }}>{l.date}</div>
                    </div>
                    <Badge variant="green" size="sm">+{l.hours} hrs</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 5: Profile */}
        {activeTab === 'profile' && (
          <Card style={{ border: 'var(--border-thick)', boxShadow: '4px 4px 0px #000', maxWidth: '700px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, marginBottom: '1rem' }}>
              Volunteer Profile
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><strong>Name:</strong> {currentUser?.name}</div>
              <div><strong>Email:</strong> {currentUser?.email}</div>
              <div><strong>Role:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 800 }}>{currentUser?.role}</span></div>
              <div><strong>City:</strong> Mumbai</div>
              <div><strong>Skills:</strong> Python, Web Design, STEM Teaching, Logistics</div>
              <div><strong>Emergency Contact:</strong> Sunil Sharma (+91 98765 01235)</div>
              <div><strong>Account Created:</strong> {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</div>
            </div>
          </Card>
        )}
      </div>

      {/* Log Hours Modal */}
      {logModalOpen && (
        <Modal
          isOpen={logModalOpen}
          onClose={() => setLogModalOpen(false)}
          title="Log Volunteer Service Hours"
          maxWidth="460px"
        >
          <form onSubmit={handleLogHours} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Program / Activity Name
              </label>
              <input
                type="text"
                value={logProgram}
                onChange={(e) => setLogProgram(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Hours Logged (e.g. 2.5)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={logHours}
                onChange={(e) => setLogHours(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '2px solid #000', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="white" size="sm" type="button" onClick={() => setLogModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="yellow" size="sm" type="submit" disabled={isSubmittingHours}>
                {isSubmittingHours ? 'Saving...' : 'Confirm Hours'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
