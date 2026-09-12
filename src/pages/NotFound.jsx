import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Mascot from '../components/common/Mascot';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        backgroundColor: '#EBF4EF'
      }}
    >
      <Card
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: 'var(--border-thick)',
          boxShadow: 'var(--shadow-2xl)',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Mascot variant="curious" size={100} animate={true} />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--brand-dark-green)',
            marginBottom: '0.25rem'
          }}
        >
          404
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Badge variant="yellow" size="md">
            PAGE NOT FOUND
          </Badge>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.65rem', marginBottom: '0.75rem', color: '#26332D' }}>
          Looks like this bridge hasn't been built yet!
        </h2>

        <p style={{ color: '#5A6F64', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 2rem', lineHeight: 1.5, fontWeight: 500 }}>
          Bridgie searched every blueprint, but this route could not be found. Let's get you back on safe ground!
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button variant="yellow" size="lg" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/programs" style={{ textDecoration: 'none' }}>
            <Button variant="white" size="lg" icon={Compass}>
              Explore Programs
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
