import React from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'lightgreen' | 'yellow' | 'green'
  hover = true,
  className = '',
  style = {},
  onClick,
  ...rest
}) {
  const variantClass = variant === 'lightgreen' ? 'nb-card-lightgreen' 
    : variant === 'yellow' ? 'nb-card-yellow' 
    : variant === 'green' ? 'nb-card-green' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`nb-card ${variantClass} ${hover ? 'nb-card-hover' : ''} ${className}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
