import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Input } from '../common/Input';
import { Lock, Mail, User, ShieldCheck, Heart, Users } from 'lucide-react';

export default function AuthModal() {
  const { authModal, setAuthModal, switchRole, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('donor');

  if (!authModal.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    setAuthModal({ isOpen: false, mode: 'login' });
    addToast(`Logged in successfully as ${selectedRole.toUpperCase()}!`, 'success');
  };

  const isLogin = authModal.mode === 'login';

  return (
    <Modal
      isOpen={authModal.isOpen}
      onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      title={isLogin ? 'Sign In to IMPACT BRIDGE' : 'Create Free Supporter Account'}
      maxWidth="500px"
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#5A6F64', fontWeight: 600 }}>
          {isLogin
            ? 'Access your donor receipts, volunteer task rosters, or NGO administration portal.'
            : 'Join our grassroots movement across 140+ Indian communities.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input
            label="Full Name"
            icon={User}
            required
            placeholder="e.g. Radhika Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          required
          placeholder="your.email@example.com"
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

        {/* Demo Role Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="nb-label">Select Demo Access Role</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'admin', label: 'Admin', icon: ShieldCheck },
              { id: 'volunteer', label: 'Volunteer', icon: Users },
              { id: 'donor', label: 'Donor', icon: Heart }
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                    boxShadow: isSelected ? '3px 3px 0px #000' : '1.5px 1.5px 0px #000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" variant="yellow" size="lg" fullWidth>
          {isLogin ? 'Sign In to Portal' : 'Complete Registration'}
        </Button>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                style={{ color: 'var(--brand-dark-green)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register Now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                style={{ color: 'var(--brand-dark-green)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}
