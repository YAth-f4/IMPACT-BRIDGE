import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  danger = true
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="480px"
      footer={
        <>
          <Button variant="white" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={danger ? 'danger' : 'yellow'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div
          style={{
            backgroundColor: danger ? '#FFCCD5' : '#FFF3BF',
            border: '2px solid #000',
            boxShadow: '2px 2px 0px #000',
            borderRadius: '4px',
            padding: '0.6rem',
            color: danger ? '#E63946' : '#26332D',
            flexShrink: 0
          }}
        >
          <AlertTriangle size={28} strokeWidth={2.5} />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.98rem', color: 'var(--text-dark)' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
