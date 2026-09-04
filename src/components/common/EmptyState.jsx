import React from 'react';
import Card from './Card';
import Button from './Button';
import { Search, FolderOpen, RefreshCw } from 'lucide-react';

export function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search terms or filter criteria.',
  onReset,
  resetLabel = 'Reset Filters',
  icon: Icon = Search
}) {
  return (
    <Card
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        border: 'var(--border-thick)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#FFF3BF',
          border: '2.5px solid #000',
          boxShadow: '3px 3px 0 #000',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Icon size={30} strokeWidth={2.5} color="#000000" />
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: '#5A6F64', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem', fontWeight: 500 }}>
        {description}
      </p>
      {onReset && (
        <Button variant="yellow" size="md" icon={RefreshCw} onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </Card>
  );
}

export function LoadingState({ message = 'Loading records...' }) {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #000',
          borderTopColor: 'var(--accent-yellow)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
