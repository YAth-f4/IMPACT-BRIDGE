import React from 'react';

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <div className={`nb-form-group ${className}`} style={{ marginBottom: '1.25rem', width: '100%', ...style }}>
      {label && (
        <label className="nb-label">
          {label} {required && <span style={{ color: 'var(--danger-red)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-dark)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="nb-input"
          style={{
            paddingLeft: Icon ? '2.5rem' : '1rem',
            borderColor: error ? 'var(--danger-red)' : 'var(--black)'
          }}
          {...rest}
        />
      </div>
      {error && (
        <p style={{ color: 'var(--danger-red)', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.3rem' }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p style={{ color: '#5A6F64', fontSize: '0.78rem', fontWeight: 500, marginTop: '0.3rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helperText,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <div className={`nb-form-group ${className}`} style={{ marginBottom: '1.25rem', width: '100%', ...style }}>
      {label && (
        <label className="nb-label">
          {label} {required && <span style={{ color: 'var(--danger-red)' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="nb-select"
        style={{
          borderColor: error ? 'var(--danger-red)' : 'var(--black)',
          cursor: 'pointer'
        }}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ color: 'var(--danger-red)', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.3rem' }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p style={{ color: '#5A6F64', fontSize: '0.78rem', fontWeight: 500, marginTop: '0.3rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
  helperText,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <div className={`nb-form-group ${className}`} style={{ marginBottom: '1.25rem', width: '100%', ...style }}>
      {label && (
        <label className="nb-label">
          {label} {required && <span style={{ color: 'var(--danger-red)' }}>*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="nb-textarea"
        style={{
          borderColor: error ? 'var(--danger-red)' : 'var(--black)',
          resize: 'vertical'
        }}
        {...rest}
      />
      {error && (
        <p style={{ color: 'var(--danger-red)', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.3rem' }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p style={{ color: '#5A6F64', fontSize: '0.78rem', fontWeight: 500, marginTop: '0.3rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
