import { colors, gradients, shadows, radius } from '../../domain/constants/tokens';
import { HeartLogo } from '../components/HeartLogo';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: gradients.modalBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 16px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: '#FFFAFA',
        borderRadius: radius.lg,
        boxShadow: shadows.modal,
        width: '100%', maxWidth: '520px',
        overflow: 'hidden',
      }}>
        {/* Popup header */}
        <div style={{ padding: '32px 40px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <HeartLogo size={28} />
            <span style={{ fontSize: '14px', color: colors.secondary }}>Cuidadores de Idosos</span>
          </div>
          <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: '0 0 24px' }} />
          {title && (
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A0A0A', margin: '0 0 8px' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ fontSize: '15px', color: colors.secondary, margin: '0 0 24px', lineHeight: '1.5' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ padding: '0 40px 40px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
