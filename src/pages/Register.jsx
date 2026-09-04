import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Input } from '../components/common/Input';
import BrandLogo from '../components/common/BrandLogo';
import { Lock, Mail, User, ShieldCheck, Heart, Users, ArrowRight } from 'lucide-react';

export default function Register() {
  const { switchRole, addToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('donor');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    switchRole(selectedRole);
    addToast(`Account created successfully as ${selectedRole.toUpperCase()}!`, 'success');
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
          maxWidth: '540px',
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
          <Badge variant="yellow" size="md">JOIN THE COMMUNITY</Badge>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.75rem', marginTop: '0.5rem' }}>
            Create Your Supporter Account
          </h2>
          <p style={{ color: '#5A6F64', fontSize: '0.88rem', fontWeight: 600, marginTop: '0.3rem' }}>
            Be part of verified grassroots change across 140+ Indian communities.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <Input
            label="Full Name"
            icon={User}
            required
            placeholder="e.g. Radhika Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            required
            placeholder="radhika@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid-2">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Account Role Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="nb-label">Choose Your Primary Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'donor', label: 'Donor / Philanthropist', icon: Heart },
                { id: 'volunteer', label: 'Field Volunteer', icon: Users },
                { id: 'admin', label: 'NGO Staff / Admin', icon: ShieldCheck }
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      padding: '0.65rem 0.4rem',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                      boxShadow: isSelected ? '3px 3px 0 #000' : '1.5px 1.5px 0 #000',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.78rem',
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

          <Button type="submit" variant="yellow" size="lg" fullWidth iconRight={ArrowRight}>
            Complete Registration
          </Button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-dark-green)', fontWeight: 800, textDecoration: 'underline' }}>
              Sign In Here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
