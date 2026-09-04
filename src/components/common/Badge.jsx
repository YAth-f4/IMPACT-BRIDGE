import React from 'react';

export default function Badge({
  children,
  variant = 'yellow', // 'yellow' | 'green' | 'lightgreen' | 'red' | 'blue' | 'white'
  size = 'md',
  icon: Icon,
  className = '',
  style = {}
}) {
  const variantClass = `nb-badge-${variant}`;

  return (
    <span
      className={`nb-badge ${variantClass} ${className}`}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.75rem',
        ...style
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
