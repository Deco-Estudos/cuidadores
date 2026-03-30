import { colors, shadows, spacing } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { HeartLogo } from './HeartLogo';
import { Button } from './ui';

export function Header({ variant = 'app' }) {
  const { navigate } = useRouter();

  if (variant === 'landing') {
    return (
      <header style={styles.header}>
        <div style={styles.inner}>
          <div style={styles.logo} onClick={() => navigate(ROUTES.LANDING)}>
            <HeartLogo size={32} />
            <span style={styles.brandText}>Cuidadores de Idosos</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
            Entrar
          </Button>
        </div>
      </header>
    );
  }

  if (variant === 'auth') {
    return null;
  }

  // variant === 'app'
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.logo} onClick={() => navigate(ROUTES.DASHBOARD)}>
          <HeartLogo size={32} />
          <span style={styles.brandText}>Cuidadores de Idosos</span>
        </div>
        <div style={styles.userArea}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>Maria Silva</span>
            <span style={styles.userEmail}>maria.silva@email.com</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LANDING)}>
            ↩ Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SubHeader({ title, backLabel, backRoute }) {
  const { navigate } = useRouter();
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.logo} onClick={() => navigate(ROUTES.DASHBOARD)}>
          <HeartLogo size={32} />
          <span style={styles.brandText}>Cuidadores de Idosos</span>
        </div>
        {backLabel && backRoute && (
          <Button variant="outline" size="sm" onClick={() => navigate(backRoute)}>
            ← {backLabel}
          </Button>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    height: spacing.headerH,
    display: 'flex', alignItems: 'center',
    boxShadow: shadows.header,
    position: 'sticky', top: 0, zIndex: 100,
  },
  inner: {
    width: '100%', maxWidth: '1536px',
    margin: '0 auto',
    padding: '0 128px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '12px',
    cursor: 'pointer',
  },
  brandText: {
    fontSize: '22px', fontWeight: 400,
    color: colors.heading, fontFamily: 'Inter, sans-serif',
  },
  userArea: {
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  userInfo: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
  },
  userName: { fontSize: '14px', color: colors.heading },
  userEmail: { fontSize: '12px', color: colors.muted },
};
