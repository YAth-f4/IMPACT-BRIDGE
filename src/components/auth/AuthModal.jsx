import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Input } from '../common/Input';
import { Lock, Mail } from 'lucide-react';

export default function AuthModal() {
  const { authModal = { isOpen: false, mode: 'login' }, setAuthModal, loginUser, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!authModal || !authModal.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginUser) {
      if (setAuthModal) setAuthModal({ isOpen: false, mode: 'login' });
      navigate('/login');
      return;
    }

    setLoading(true);
    const res = await loginUser({ email, password });
    setLoading(false);

    if (res.success) {
      if (setAuthModal) setAuthModal({ isOpen: false, mode: 'login' });
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'volunteer') navigate('/volunteer/dashboard');
      else if (res.user.role === 'donor') navigate('/donor/dashboard');
      else if (res.user.role === 'beneficiary') navigate('/beneficiary/dashboard');
    } else {
      addToast(res.message || 'Login failed.', 'error');
    }
  };

  const isLogin = authModal.mode === 'login';

  return (
    <Modal
      isOpen={authModal.isOpen}
      onClose={() => setAuthModal && setAuthModal({ isOpen: false, mode: 'login' })}
      title={isLogin ? 'Sign In to IMPACT BRIDGE' : 'Create Free Supporter Account'}
      maxWidth="440px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="yellow" size="md" style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Authenticating...' : (isLogin ? 'Sign In to Dashboard' : 'Register Account')}
        </Button>
      </form>
    </Modal>
  );
}
