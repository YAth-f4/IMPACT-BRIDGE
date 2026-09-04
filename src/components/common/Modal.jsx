import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '650px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="nb-modal-backdrop" onClick={onClose}>
      <div
        className="nb-modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nb-modal-header">
          <h3>{title}</h3>
          <button
            onClick={onClose}
            className="nb-btn nb-btn-yellow nb-btn-sm"
            style={{ padding: '4px', width: '32px', height: '32px' }}
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>
        <div className="nb-modal-body">{children}</div>
        {footer && <div className="nb-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
