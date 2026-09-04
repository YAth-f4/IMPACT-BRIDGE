import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Input } from '../components/common/Input';
import BrandLogo from '../components/common/BrandLogo';
import { Lock, Mail, ShieldCheck, Heart, Users, ArrowRight } from 'lucide-react';

export default function Login() {
  const { switchRole, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('sunita.rao@impactbridge.org');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState('admin');

  const handleLogin = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    addToast(`Signed in successfully as ${selectedRole.toUpperCase()}`, 'success');
    if (selectedRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (selectedRole === 'volunteer') {
      navigate('/volunteer');
    } else {
      navigate('/donation');
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        backgroundColor: '#EBF4EF'
      }}
    >
      <Card
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          border: 'var(--border-thick)',
          boxShadow: 'var(--shadow-2xl)',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <BrandLogo size="md" />
          </div>
          <Badge variant="yellow" size="md">SECURE PORTAL ACCESS</Badge>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.75rem', marginTop: '0.5rem' }}>
            Sign In to Impact Bridge
          </h2>
          <p style={{ color: '#5A6F64', fontSize: '0.88rem', fontWeight: 600, marginTop: '0.3rem' }}>
            Access donor tax receipts, volunteer schedules, or NGO admin portal.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Quick Demo Role Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="nb-label">Select Demo Access Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
                { id: 'volunteer', label: 'Volunteer', icon: Users },
                { id: 'donor', label: 'Donor', icon: Heart }
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.id);
                      if (r.id === 'admin') setEmail('sunita.rao@impactbridge.org');
                      if (r.id === 'volunteer') setEmail('aarav.sharma@example.com');
                      if (r.id === 'donor') setEmail('aditya.singhania@corp.in');
                    }}
                    style={{
                      padding: '0.65rem 0.4rem',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                      boxShadow: isSelected ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Remember me</span>
            </label>

            <span style={{ color: 'var(--brand-dark-green)', fontWeight: 800, cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <Button type="submit" variant="yellow" size="lg" fullWidth iconRight={ArrowRight}>
            Sign In to Account
          </Button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--brand-dark-green)', fontWeight: 800, textDecoration: 'underline' }}>
              Register Here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
