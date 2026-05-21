import { colors, gradients, radius, shadows } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { AppLayout } from '../layouts/AppLayout';
import { Button, Badge, Card, Divider } from '../components/ui';
import { mockSolicitacoes } from '../../infrastructure/data/mockSolicitacoes';
import { useAssistidos } from '../../infrastructure/state/AssistidosContext';

const statusVariant = { pendente: 'pending', aprovada: 'ok', cancelada: 'cancel' };
const statusLabel = { pendente: '⏱ Pendente', aprovada: '✓ Aprovada', cancelada: '✕ Cancelada' };

function ActionCard({ label, sub, icon, onClick, highlight }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: highlight ? gradients.primary : colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.xl,
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform .15s, box-shadow .15s',
        boxShadow: shadows.card,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = shadows.lg; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = shadows.card; }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: highlight ? 'rgba(255,255,255,0.2)' : '#EEF2FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', marginBottom: '16px',
      }}>
        {icon}
      </div>
      <p style={{ fontSize: '17px', fontWeight: 600, color: highlight ? colors.white : colors.heading, margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: highlight ? '#DBEAFE' : colors.secondary, margin: 0 }}>{sub}</p>
    </div>
  );
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { assistidos } = useAssistidos();
  const recentes = mockSolicitacoes.slice(0, 2);
  const completos = assistidos.filter(a => a.cadastroCompleto).length;
  const incompletos = assistidos.length - completos;

  return (
    <AppLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Bem-vindo, Maria! 👋</h1>
        <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Gerencie suas solicitações e encontre o cuidador ideal</p>
      </div>

      {/* Action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <ActionCard label="Nova Solicitação" sub={incompletos ? `${incompletos} cadastro(s) para completar` : 'Buscar um novo cuidador'} icon="➕" highlight onClick={() => navigate(ROUTES.PERFIS)} />
        <ActionCard label="Minhas Solicitações" sub={`${mockSolicitacoes.length} solicitações`} icon="📋" onClick={() => navigate(ROUTES.MINHAS_SOLICITACOES)} />
        <ActionCard label="Perfis de Assistidos" sub={`${completos}/${assistidos.length} prontos para solicitar`} icon="👥" onClick={() => navigate(ROUTES.PERFIS)} />
        <ActionCard label="Agendamentos" sub="Próximos atendimentos" icon="📅" onClick={() => navigate(ROUTES.AGENDAMENTOS)} />
      </div>

      {/* Main + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 384px', gap: '24px' }}>
        {/* Solicitações recentes */}
        <Card padding="0">
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.heading, margin: 0 }}>Solicitações Recentes</h2>
          </div>
          {recentes.map((s, i) => (
            <div key={s.id} style={{ padding: '20px 24px', borderBottom: i < recentes.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 4px' }}>{s.assistidoNome}</p>
                  <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>Solicitado em {s.dataSolicitacao}</p>
                </div>
                <Badge variant={statusVariant[s.status]}>{statusLabel[s.status]}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.MINHAS_SOLICITACOES)}>
                Ver Detalhes
              </Button>
            </div>
          ))}
        </Card>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Meu perfil */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 2px' }}>Meu Perfil</p>
                <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>Informações pessoais</p>
              </div>
            </div>
            {[['Nome', 'Maria Silva'], ['E-mail', 'maria.silva@email.com'], ['Telefone', '(11) 98765-4321']].map(([l, v]) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: colors.muted, margin: '0 0 2px' }}>{l}</p>
                <p style={{ fontSize: '14px', color: colors.heading, margin: 0 }}>{v}</p>
              </div>
            ))}
            <Divider style={{ margin: '16px 0' }} />
            <Button variant="outline" fullWidth size="sm">✏ Editar Perfil</Button>
          </Card>

          {/* Ajuda */}
          <div style={{
            background: 'linear-gradient(151deg, #EEF2FF 0%, #FAF5FF 100%)',
            border: '1px solid #C6D2FF',
            borderRadius: radius.xl, padding: '24px',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>💜</div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 6px' }}>Precisa de Ajuda?</p>
            <p style={{ fontSize: '13px', color: colors.secondary, margin: '0 0 16px' }}>Nossa equipe está disponível 24/7 para auxiliar você</p>
            <Button variant="outline" fullWidth size="sm">Falar com Suporte</Button>
          </div>

          {/* Estatísticas */}
          <Card>
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 16px' }}>Estatísticas</p>
            {[['Total de Solicitações', 3, colors.heading], ['Aprovadas', 1, colors.okText], ['Pendentes', 2, colors.pendingText], ['Cadastros incompletos', incompletos, colors.pendingText]].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: '14px', color: colors.secondary }}>{l}</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
