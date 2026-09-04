import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: 'calc(100% - 48px)'
      }}
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isInfo = t.type === 'info';

        const bgColor = isSuccess ? '#A8D5BA' : isError ? '#FFCCD5' : '#F4B942';
        const iconColor = isSuccess ? '#1E523A' : isError ? '#E63946' : '#26332D';

        return (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: bgColor,
              border: '2.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '6px',
              color: '#000000',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              animation: 'scaleUp 0.15s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ color: iconColor, flexShrink: 0 }}>
                {isSuccess && <CheckCircle2 size={20} strokeWidth={2.5} />}
                {isError && <AlertCircle size={20} strokeWidth={2.5} />}
                {isInfo && <Info size={20} strokeWidth={2.5} />}
              </div>
              <span>{t.message}</span>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                color: '#000000'
              }}
              aria-label="Dismiss notification"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
