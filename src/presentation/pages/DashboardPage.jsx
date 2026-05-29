import { useState } from 'react';
import { colors, gradients, radius, shadows } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { AppLayout } from '../layouts/AppLayout';
import { Button, Badge, Card, Divider, Modal } from '../components/ui';
import { useAssistidos } from '../../infrastructure/state/AssistidosContext';
import { useAuth } from '../../infrastructure/state/AuthContext';
import { useSolicitacoes } from '../../infrastructure/state/SolicitacoesContext';

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
  const { usuarioLogado } = useAuth();
  const { solicitacoes, resumo, agendamentos } = useSolicitacoes();
  const [supportOpen, setSupportOpen] = useState(false);
  const recentes = solicitacoes.slice(0, 2);
  const completos = assistidos.filter(a => a.cadastroCompleto).length;
  const incompletos = assistidos.length - completos;
  const proximoAgendamento = agendamentos[0];

  return (
    <AppLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Bem vindo, {usuarioLogado?.nome || 'usuário'}!</h1>
      </div>

      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <ActionCard label="Nova Solicitação" sub={incompletos ? `${incompletos} cadastro(s) para completar` : 'Escolha um perfil e um cuidador'} icon="➕" highlight onClick={() => navigate(ROUTES.PERFIS)} />
        <ActionCard label="Minhas Solicitações" sub={`${resumo.total} solicitação(ões)`} icon="📋" onClick={() => navigate(ROUTES.MINHAS_SOLICITACOES)} />
        <ActionCard label="Perfis de Assistidos" sub={`${completos}/${assistidos.length} prontos para solicitar`} icon="👥" onClick={() => navigate(ROUTES.PERFIS)} />
        <ActionCard label="Agendamentos" sub={`${agendamentos.length} atendimento(s) confirmado(s)`} icon="📅" onClick={() => navigate(ROUTES.AGENDAMENTOS)} />
      </div>

      <div className="grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 384px', gap: '24px' }}>
        <Card padding="0">
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.heading, margin: 0 }}>Solicitações Recentes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.MINHAS_SOLICITACOES)}>Ver todas</Button>
          </div>
          {recentes.length === 0 ? (
            <div style={{ padding: '36px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <p style={{ fontSize: '14px', color: colors.secondary, margin: '0 0 16px' }}>Você ainda não fez solicitações.</p>
              <Button variant="primary" onClick={() => navigate(ROUTES.PERFIS)}>Criar primeira solicitação</Button>
            </div>
          ) : recentes.map((s, i) => (
            <div key={s.id} style={{ padding: '20px 24px', borderBottom: i < recentes.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 4px' }}>{s.assistidoNome}</p>
                  <p style={{ fontSize: '13px', color: colors.muted, margin: '0 0 4px' }}>Solicitado em {s.dataSolicitacao}</p>
                  <p style={{ fontSize: '13px', color: colors.secondary, margin: 0 }}>Cuidador: <strong>{s.cuidadorNome}</strong></p>
                </div>
                <Badge variant={statusVariant[s.status]}>{statusLabel[s.status]}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DETALHE_SOLICITACAO, { solicitacaoId: s.id })}>
                Ver Detalhes
              </Button>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 2px' }}>Meu Perfil</p>
                <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>Informações pessoais</p>
              </div>
            </div>
            {[['Nome', usuarioLogado?.nome || '-'], ['E-mail', usuarioLogado?.email || '-'], ['Telefone', usuarioLogado?.telefone || 'Não informado']].map(([l, v]) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: colors.muted, margin: '0 0 2px' }}>{l}</p>
                <p style={{ fontSize: '14px', color: colors.heading, margin: 0 }}>{v}</p>
              </div>
            ))}
            <Divider style={{ margin: '16px 0' }} />
            <Button variant="outline" fullWidth size="sm" onClick={() => navigate(ROUTES.MEU_PERFIL)}>✏ Editar Perfil</Button>
          </Card>

          <div style={{
            background: 'linear-gradient(151deg, #EEF2FF 0%, #FAF5FF 100%)',
            border: '1px solid #C6D2FF',
            borderRadius: radius.xl, padding: '24px',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>💜</div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 6px' }}>Precisa de Ajuda?</p>
            <p style={{ fontSize: '13px', color: colors.secondary, margin: '0 0 16px' }}>Veja como os fluxos funcionam nesta versão local</p>
            <Button variant="outline" fullWidth size="sm" onClick={() => setSupportOpen(true)}>Falar com Suporte</Button>
          </div>

          <Card>
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 16px' }}>Estatísticas</p>
            {[
              ['Total de Solicitações', resumo.total, colors.heading],
              ['Aprovadas', resumo.aprovadas, colors.okText],
              ['Pendentes', resumo.pendentes, colors.pendingText],
              ['Canceladas', resumo.canceladas, colors.red],
              ['Cadastros incompletos', incompletos, colors.pendingText],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: '14px', color: colors.secondary }}>{l}</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </Card>

          {proximoAgendamento && (
            <div style={{ background: gradients.primary, color: colors.white, borderRadius: radius.xl, padding: '20px' }}>
              <p style={{ fontSize: '13px', opacity: 0.82, margin: '0 0 8px' }}>Próximo atendimento</p>
              <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>{proximoAgendamento.cuidadorNome}</p>
              <p style={{ fontSize: '13px', opacity: 0.88, margin: 0 }}>{proximoAgendamento.data} · {proximoAgendamento.horario}</p>
            </div>
          )}
        </div>
      </div>

      {supportOpen && (
        <Modal onClose={() => setSupportOpen(false)} width="520px">
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 10px' }}>Suporte da demonstração</h2>
            <p style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 18px' }}>
              Entre em contato com suporte@cuidadores.com.br <br /> ou ligue para (79) 91234-5678.
            </p>

            <Button variant="primary" fullWidth onClick={() => setSupportOpen(false)}>Entendi</Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
