import React from 'react';

export default function Button({
  children,
  variant = 'yellow', // 'yellow' | 'green' | 'lightgreen' | 'white' | 'dark' | 'danger' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style = {},
  fullWidth = false,
  ...rest
}) {
  const sizeClass = size === 'sm' ? 'nb-btn-sm' : size === 'lg' ? 'nb-btn-lg' : '';
  const variantClass = `nb-btn-${variant}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`nb-btn ${variantClass} ${sizeClass} ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        ...style
      }}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2.5} />}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2.5} />}
    </button>
  );
}
