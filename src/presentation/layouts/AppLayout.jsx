import { colors } from '../../domain/constants/tokens';
import { Header, SubHeader } from '../components/Header';

export function AppLayout({ children, headerVariant = 'app', subHeaderProps = null }) {
  return (
    <div style={{ minHeight: '100vh', background: colors.bgPage, fontFamily: 'Inter, sans-serif' }}>
      {subHeaderProps ? (
        <SubHeader {...subHeaderProps} />
      ) : (
        <Header variant={headerVariant} />
      )}
      <main className="page-main" style={{ maxWidth: '1536px', margin: '0 auto', padding: '32px 128px 64px' }}>
        {children}
      </main>
    </div>
  );
}
