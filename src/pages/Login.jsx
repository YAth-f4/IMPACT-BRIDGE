import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import BrandLogo from '../components/common/BrandLogo';
import Modal from '../components/common/Modal';
import BridgeLoader from '../components/common/BridgeLoader';
import {
  Lock,
  Mail,
  ShieldCheck,
  Heart,
  Users,
  ArrowRight,
  HandHeart,
  Globe,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Phone
} from 'lucide-react';

export default function Login() {
  const { loginUser, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Guard refs to prevent duplicate toast execution in React StrictMode and on re-renders
  const hasHandledRedirectState = useRef(false);
  const returnUrlRef = useRef(location.state?.from || null);

  // Form State
  const [email, setEmail] = useState('sunita.rao@impactbridge.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState('admin');

  // Interactive UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Field validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check if redirected with registration state or message — consume ONCE and immediately clear state
  useEffect(() => {
    if (hasHandledRedirectState.current) return;

    if (location.state?.registeredEmail || location.state?.registrationSuccess) {
      hasHandledRedirectState.current = true;
      if (location.state.registeredEmail) {
        setEmail(location.state.registeredEmail);
      }
      setPassword('');
      if (location.state.registeredRole) {
        setSelectedRole(location.state.registeredRole);
      }
      addToast('Registration successful! Please sign in with your password.', 'success');

      // Immediately clear state from browser history so typing, role switches, or refresh never re-trigger
      navigate(location.pathname, { replace: true, state: null });
    } else if (location.state?.message) {
      hasHandledRedirectState.current = true;
      setErrorMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, addToast, navigate]);

  // Demo accounts for 5 roles
  const DEMO_ROLES = [
    { id: 'admin', label: 'Admin', icon: ShieldCheck, email: 'sunita.rao@impactbridge.org', defaultPass: 'admin123' },
    { id: 'volunteer', label: 'Volunteer', icon: Users, email: 'aarav.sharma@example.com', defaultPass: 'volunteer123' },
    { id: 'beneficiary', label: 'Beneficiary', icon: HandHeart, email: 'laxmi.devi@example.com', defaultPass: 'help123' },
    { id: 'donor', label: 'Donor', icon: Heart, email: 'aditya.singhania@corp.in', defaultPass: 'donor123' },
    { id: 'guest', label: 'Public', icon: Globe, email: 'visitor@example.com', defaultPass: 'guest123' }
  ];

  const handleRoleSelect = (roleItem) => {
    setSelectedRole(roleItem.id);
    setEmail(roleItem.email);
    setPassword(roleItem.defaultPass);
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');
  };

  const validateForm = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your email address.');
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setEmailError('Please enter a valid email address (e.g. name@domain.com).');
        valid = false;
      }
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      valid = false;
    }

    return valid;
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setErrorMessage('');

    if (!validateForm()) {
      triggerShake();
      return;
    }

    setIsLoading(true);

    const result = await loginUser({
      email: email.trim(),
      password,
      rememberMe
    });

    if (!result.success) {
      setIsLoading(false);
      setErrorMessage(result.message || 'Invalid email or password.');
      triggerShake();
      return;
    }

    // Success State & Animation
    setIsLoading(false);
    setIsSuccess(true);
    setSuccessUser(result.user);
    addToast(`Signed in successfully as ${result.user.name} (${result.user.role.toUpperCase()})`, 'success');

    // Smooth transition delay (650ms) before navigating
    setTimeout(() => {
      const targetRoute = returnUrlRef.current || (
        result.user.role === 'admin'
          ? '/admin/dashboard'
          : result.user.role === 'volunteer'
          ? '/volunteer'
          : result.user.role === 'beneficiary'
          ? '/beneficiary'
          : result.user.role === 'donor'
          ? '/donation'
          : '/home'
      );

      navigate(targetRoute, { replace: true });
    }, 700);
  };

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
          maxWidth: '510px',
          width: '100%'
        }}
      >
        <Card
          style={{
            width: '100%',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            border: 'var(--border-thick)',
            boxShadow: '8px 8px 0px #000000',
            backgroundColor: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* SUCCESS OVERLAY ANIMATION */}
          {isSuccess && successUser && (
            <div
              className="animate-stagger-item delay-0"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div
                className="animate-success-pop"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-dark-green)',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0 #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#FFFFFF'
                }}
              >
                <CheckCircle2 size={38} strokeWidth={3} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 0.35rem 0' }}>
                Welcome, {successUser.name}!
              </h3>
              <p style={{ color: '#5A6F64', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 1.25rem 0' }}>
                Verified role: <span style={{ textTransform: 'uppercase', color: 'var(--brand-dark-green)' }}>{successUser.role}</span>
              </p>
              <BridgeLoader size="md" label="Redirecting to your dashboard..." showMascot={false} />
            </div>
          )}

          {/* Card Header (Staggered Intro) */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div className="animate-logo-entrance delay-0" style={{ display: 'inline-block', marginBottom: '0.85rem' }}>
              <BrandLogo size="md" />
            </div>
            <br />
            <div className="animate-stagger-item delay-60" style={{ display: 'inline-block' }}>
              <Badge variant="yellow" size="md">SECURE PORTAL ACCESS</Badge>
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
              Sign In to Impact Bridge
            </h2>
            <p className="animate-stagger-item delay-180" style={{ color: '#5A6F64', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>
              Access donor tax receipts, volunteer schedules, or NGO administration.
            </p>
          </div>

          {/* Top Error Alert Banner */}
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

          <form onSubmit={handleLogin} noValidate>
            {/* 1. Email Input (Staggered Entrance + Focus Lift Micro-interaction) */}
            <div className="animate-stagger-item delay-220" style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontWeight: 800,
                  fontSize: '0.85rem',
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
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className="nb-input-interactive"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.6rem',
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
                <div style={{ color: '#E63946', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  {emailError}
                </div>
              )}
            </div>

            {/* 2. Password Input with Visibility Toggle */}
            <div className="animate-stagger-item delay-280" style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem'
                }}
              >
                Password
              </label>
              <div className="nb-input-group">
                <div className="nb-input-icon">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="nb-input-interactive"
                  style={{
                    width: '100%',
                    padding: '0.8rem 2.8rem 0.8rem 2.6rem',
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
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span key={showPassword ? 'show' : 'hide'} className="password-icon-enter">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </button>
              </div>
              {passwordError && (
                <div style={{ color: '#E63946', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  {passwordError}
                </div>
              )}
            </div>

            {/* 3. Demo Role Selector (Staggered Entrance + Tactile Pill Micro-interactions) */}
            <div className="animate-stagger-item delay-340" style={{ marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#5A6F64' }}>
                  Quick Fill Demo Persona:
                </label>
                <span style={{ fontSize: '0.72rem', color: '#777', fontWeight: 600 }}>5 Verified Roles</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
                {DEMO_ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`nb-role-pill ${isSelected ? 'active' : ''}`}
                      style={{
                        padding: '0.55rem 0.2rem',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #000000',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                        boxShadow: isSelected ? '3.5px 3.5px 0px #000000' : '1px 1px 0px #000000',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                      title={`Fill ${r.label} credentials`}
                      aria-pressed={isSelected}
                    >
                      <span className="role-icon" style={{ display: 'inline-flex', transition: 'transform 0.15s ease' }}>
                        <Icon size={16} strokeWidth={2.5} />
                      </span>
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Remember Me & Forgot Password */}
            <div
              className="animate-stagger-item delay-400"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="nb-btn-tactile"
                style={{
                  color: 'var(--brand-dark-green)',
                  fontWeight: 800,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  boxShadow: 'none'
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* 5. Submit Button with Animated Loading State */}
            <div className="animate-stagger-item delay-460">
              <Button
                type="submit"
                variant="yellow"
                size="lg"
                fullWidth
                disabled={isLoading || isSuccess}
                className="nb-btn-tactile"
                iconRight={!isLoading && !isSuccess ? ArrowRight : null}
              >
                {isLoading ? (
                  <BridgeLoader inline={true} label="Signing In to Impact Bridge..." />
                ) : isSuccess ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#1E523A', fontWeight: 900 }}>
                    <CheckCircle2 size={20} strokeWidth={3} />
                    <span>Login Successful!</span>
                  </span>
                ) : (
                  <span>Sign In to Account</span>
                )}
              </Button>
            </div>

            {/* 6. Register Link */}
            <div className="animate-stagger-item delay-520" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
              Don't have an account yet?{' '}
              <Link
                to="/register"
                style={{
                  color: 'var(--brand-dark-green)',
                  fontWeight: 800,
                  textDecoration: 'underline'
                }}
              >
                Register Here
              </Link>
            </div>
          </form>
        </Card>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Account Recovery & Assistance"
        maxWidth="480px"
        footer={
          <Button variant="yellow" onClick={() => setForgotModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '2px solid #000',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <HelpCircle size={24} color="var(--brand-dark-green)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>How Password Recovery Works:</strong>
              To protect community records and field data, account credentials can be reset by our support team or local center lead.
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontWeight: 800, margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Immediate Options:</h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Call Toll-Free Helpline:</strong> Call <a href="tel:18002026000" style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>1800-202-6000</a> (Available 24/7).
              </li>
              <li>
                <strong>Email Support:</strong> Send request from your registered email to <a href="mailto:support@impactbridge.org" style={{ fontWeight: 800, color: 'var(--brand-dark-green)' }}>support@impactbridge.org</a>.
              </li>
              <li>
                <strong>Testing / Demo Accounts:</strong> You can click any role button above to use default verified credentials.
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
