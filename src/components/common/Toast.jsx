import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 240);
  };

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  const bgColor = isSuccess ? '#A8D5BA' : isError ? '#FFCCD5' : isWarning ? '#FDE68A' : '#F4B942';
  const iconColor = isSuccess ? '#1E523A' : isError ? '#E63946' : isWarning ? '#B45309' : '#26332D';

  return (
    <div
      className={`nb-toast-item ${isExiting ? 'toast-exiting' : ''}`}
      style={{
        backgroundColor: bgColor
      }}
      role="alert"
      aria-live="polite"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <div style={{ color: iconColor, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {isSuccess && <CheckCircle2 size={20} strokeWidth={2.5} />}
          {isError && <AlertCircle size={20} strokeWidth={2.5} />}
          {isWarning && <AlertTriangle size={20} strokeWidth={2.5} />}
          {isInfo && <Info size={20} strokeWidth={2.5} />}
        </div>
        <span style={{ flex: 1, minWidth: 0 }}>{toast.message}</span>
      </div>

      <button
        type="button"
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          color: '#000000',
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'transform 0.1s ease'
        }}
        aria-label="Dismiss notification"
      >
        <X size={16} strokeWidth={3} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || !toasts.length) return null;

  return (
    <div className="nb-toast-container" aria-label="System Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
}

