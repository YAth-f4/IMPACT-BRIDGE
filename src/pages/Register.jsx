import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import BrandLogo from '../components/common/BrandLogo';
import BridgeLoader from '../components/common/BridgeLoader';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Heart,
  Users,
  ArrowRight,
  HandHeart,
  Globe,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function Register() {
  const { registerUser, addToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('donor');

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Field validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  const validateForm = () => {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setErrorMessage('');

    if (!name.trim()) {
      setNameError('Please enter your full name.');
      valid = false;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your email address.');
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setEmailError('Please enter a valid email address.');
        valid = false;
      }
    }

    if (!password) {
      setPasswordError('Please enter a password.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match. Please re-enter.');
      valid = false;
    }

    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const result = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      role: selectedRole
    });

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Registration failed.');
      triggerShake();
      return;
    }

    // Redirect to login with prefilled registration state
    navigate('/login', {
      state: {
        registeredEmail: email.trim(),
        registeredRole: selectedRole,
        registrationSuccess: true
      }
    });
  };

  const ROLES = [
    { id: 'donor', label: 'Donor', icon: Heart, desc: 'Support impactful programs' },
    { id: 'volunteer', label: 'Volunteer', icon: Users, desc: 'Contribute skills & time' },
    { id: 'beneficiary', label: 'Beneficiary', icon: HandHeart, desc: 'Request & receive support' }
  ];

  return (
    <div
      style={{
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 3.5rem) 1rem',
        backgroundColor: '#EBF4EF'
      }}
    >
      <div
        className={`animate-login-card ${isShaking ? 'animate-shake' : ''}`}
        style={{
          maxWidth: '530px',
          width: '100%'
        }}
      >
        <Card
          style={{
            width: '100%',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            border: 'var(--border-thick)',
            boxShadow: '8px 8px 0px #000000',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="animate-logo-entrance delay-0" style={{ display: 'inline-block', marginBottom: '0.85rem' }}>
              <BrandLogo size="md" />
            </div>
            <br />
            <div className="animate-stagger-item delay-60" style={{ display: 'inline-block' }}>
              <Badge variant="yellow" size="md">JOIN THE COMMUNITY</Badge>
            </div>
            <h2
              className="animate-stagger-item delay-120"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
                marginTop: '0.5rem',
                marginBottom: '0.35rem'
              }}
            >
              Create Your Impact Account
            </h2>
            <p className="animate-stagger-item delay-180" style={{ color: '#5A6F64', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>
              Be part of verified grassroots change across 140+ Indian communities.
            </p>
          </div>

          {/* Top Error Alert */}
          {errorMessage && (
            <div
              className="animate-stagger-item delay-0"
              style={{
                backgroundColor: '#FFF2F2',
                border: '2px solid #E63946',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#A81824'
              }}
            >
              <AlertTriangle size={18} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>
            {/* Full Name */}
            <div className="animate-stagger-item delay-220" style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="register-name"
                style={{
                  display: 'block',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem'
                }}
              >
                Full Name
              </label>
              <div className="nb-input-group">
                <div className="nb-input-icon">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  className="nb-input-interactive"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    border: nameError ? '2px solid #E63946' : '2px solid #000000',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    backgroundColor: '#FAFDFB',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {nameError && (
                <div style={{ color: '#E63946', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
                  {nameError}
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="animate-stagger-item delay-280" style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="register-email"
                style={{
                  display: 'block',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem'
                }}
              >
                Email Address
              </label>
              <div className="nb-input-group">
                <div className="nb-input-icon">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="radhika@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className="nb-input-interactive"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    border: emailError ? '2px solid #E63946' : '2px solid #000000',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    backgroundColor: '#FAFDFB',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {emailError && (
                <div style={{ color: '#E63946', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
                  {emailError}
                </div>
              )}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="animate-stagger-item delay-340" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.15rem' }}>
              <div>
                <label
                  htmlFor="register-password"
                  style={{
                    display: 'block',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem'
                  }}
                >
                  Password (min 6 chars)
                </label>
                <div className="nb-input-group">
                  <div className="nb-input-icon">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    className="nb-input-interactive"
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.6rem',
                      border: passwordError ? '2px solid #E63946' : '2px solid #000000',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#FAFDFB',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span key={showPassword ? 'show' : 'hide'} className="password-icon-enter">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </span>
                  </button>
                </div>
                {passwordError && (
                  <div style={{ color: '#E63946', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    {passwordError}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  style={{
                    display: 'block',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem'
                  }}
                >
                  Confirm Password
                </label>
                <div className="nb-input-group">
                  <div className="nb-input-icon">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    className="nb-input-interactive"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      border: confirmPasswordError ? '2px solid #E63946' : '2px solid #000000',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#FAFDFB',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                {confirmPasswordError && (
                  <div style={{ color: '#E63946', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    {confirmPasswordError}
                  </div>
                )}
              </div>
            </div>

            {/* Account Role Selector */}
            <div className="animate-stagger-item delay-400" style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                  color: '#5A6F64'
                }}
              >
                Choose Your Community Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.45rem' }}>
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`nb-role-pill ${isSelected ? 'active' : ''}`}
                      style={{
                        padding: '0.65rem 0.35rem',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #000000',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                        boxShadow: isSelected ? '3.5px 3.5px 0 #000' : '1.5px 1.5px 0 #000',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                      title={r.desc}
                      aria-pressed={isSelected}
                    >
                      <span className="role-icon" style={{ display: 'inline-flex', transition: 'transform 0.15s ease' }}>
                        <Icon size={18} strokeWidth={2.5} />
                      </span>
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-stagger-item delay-460">
              <Button
                type="submit"
                variant="yellow"
                size="lg"
                fullWidth
                disabled={isLoading}
                className="nb-btn-tactile"
                iconRight={!isLoading ? ArrowRight : null}
              >
                {isLoading ? (
                  <BridgeLoader inline={true} label="Creating Account..." />
                ) : (
                  <span>Complete Registration</span>
                )}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="animate-stagger-item delay-520" style={{ marginTop: '1.35rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--brand-dark-green)',
                  fontWeight: 800,
                  textDecoration: 'underline'
                }}
              >
                Sign In Here
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
