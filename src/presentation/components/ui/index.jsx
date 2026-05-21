import { colors, gradients, radius, shadows } from '../../../domain/constants/tokens';

// ─── BUTTON ───────────────────────────────────────────────
export function Button({
  children, variant = 'primary', onClick,
  fullWidth = false, size = 'md', style: extraStyle = {}, disabled = false,
}) {
  const base = {
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, sans-serif', fontWeight: 500,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'opacity .15s, transform .1s',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...(size === 'sm' ? { padding: '7px 14px', fontSize: '13px', borderRadius: radius.md } : {}),
    ...(size === 'md' ? { padding: '11px 20px', fontSize: '14px', borderRadius: radius.md } : {}),
    ...(size === 'lg' ? { padding: '14px 28px', fontSize: '16px', borderRadius: radius.xl } : {}),
  };

  const variants = {
    primary: { background: gradients.primary, color: colors.white },
    green: { background: colors.green, color: colors.heading, border: `1px solid ${colors.heading}`, borderRadius: radius.full, fontWeight: 400, fontSize: '17px' },
    outline: { background: colors.white, color: colors.heading, border: `1px solid ${colors.inputBorder}` },
    danger: { background: colors.red, color: colors.white },
    ghost: { background: 'transparent', color: colors.primary, border: 'none', padding: 0, fontWeight: 400 },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...extraStyle }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.88'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >
      {children}
    </button>
  );
}

// ─── INPUT ────────────────────────────────────────────────
export function Input({ label, placeholder, type = 'text', value, onChange, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: colors.muted }}>
          {label}{required && ' *'}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          border: `1px solid ${colors.inputBorder}`,
          borderRadius: radius.md,
          padding: '11px 14px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: colors.heading,
          background: colors.white,
          outline: 'none',
          transition: 'border-color .15s',
          width: '100%',
        }}
        onFocus={e => { e.target.style.borderColor = colors.primary; }}
        onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
      />
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────
export function Select({ label, options, value, onChange, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: colors.muted }}>
          {label}{required && ' *'}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          border: `1px solid ${colors.inputBorder}`,
          borderRadius: radius.md,
          padding: '11px 14px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: value ? colors.heading : colors.placeholder,
          background: colors.white,
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── TEXTAREA ─────────────────────────────────────────────
export function Textarea({ label, placeholder, value, onChange, rows = 4, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: colors.muted }}>
          {label}{required && ' *'}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{
          border: `1px solid ${colors.inputBorder}`,
          borderRadius: radius.md,
          padding: '11px 14px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: colors.heading,
          background: colors.white,
          outline: 'none',
          resize: 'vertical',
          width: '100%',
        }}
        onFocus={e => { e.target.style.borderColor = colors.primary; }}
        onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
      />
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────
const badgeVariants = {
  pending: { bg: colors.pendingBg, color: colors.pendingText },
  ok: { bg: colors.okBg, color: colors.okText },
  cancel: { bg: colors.cancelBg, color: colors.cancelText },
  blue: { bg: colors.blueBg, color: colors.primary },
  indigo: { bg: colors.indigoBg, color: '#4338CA' },
  gray: { bg: '#F1F5F9', color: colors.secondary },
  verified: { bg: colors.okBg, color: colors.okText },
};

export function Badge({ children, variant = 'blue', style: extra = {} }) {
  const v = badgeVariants[variant] || badgeVariants.blue;
  return (
    <span style={{
      background: v.bg, color: v.color,
      borderRadius: radius.full,
      padding: '3px 12px',
      fontSize: '12px', fontWeight: 600,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      ...extra,
    }}>
      {children}
    </span>
  );
}

// ─── CARD ─────────────────────────────────────────────────
export function Card({ children, style: extra = {}, padding = '24px' }) {
  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.xl,
      boxShadow: shadows.card,
      padding,
      ...extra,
    }}>
      {children}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────
export function Modal({ children, onClose, width = '560px' }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: colors.white,
          borderRadius: radius.lg,
          boxShadow: shadows.modal,
          width, maxWidth: '95vw',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────
export function Divider({ style: extra = {} }) {
  return <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: '0', ...extra }} />;
}

// ─── STARS ────────────────────────────────────────────────
export function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: '#F59E0B', fontSize: '14px' }}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: colors.secondary, fontSize: '13px', marginLeft: '4px' }}>{rating}</span>
    </span>
  );
}

// ─── RADIO GROUP ──────────────────────────────────────────
export function RadioGroup({ label, options, value, onChange, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: colors.muted }}>
          {label}{required && ' *'}
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map(opt => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: colors.heading }}>
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              style={{ accentColor: colors.primary, width: '16px', height: '16px' }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
