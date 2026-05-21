import { colors, radius, shadows, gradients } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Badge, Card, Divider } from '../components/ui';
import { mockSolicitacoes, mockAgendamentos, mockResumoMes } from '../../infrastructure/data/mockSolicitacoes';
import { mockCuidadores } from '../../infrastructure/data/mockCuidadores';
import { useState } from 'react';
import { useAssistidos } from '../../infrastructure/state/AssistidosContext';

const statusVariant = { pendente: 'pending', aprovada: 'ok', cancelada: 'cancel' };
const statusLabel = { pendente: '⏱ Pendente', aprovada: '✓ Aprovada', cancelada: '✕ Cancelada' };

// ─── CONFIRMAÇÃO DE SOLICITAÇÃO ───────────────────────────
export function ConfirmacaoSolicitacaoPage() {
  const { navigate, routeParams } = useRouter();
  const cuidador = routeParams?.cuidador || mockCuidadores[0];
  const assistido = routeParams?.assistido;

  const rows = [
    ['Cuidador:', `${cuidador.nome} — ${cuidador.especialidade}`],
    ['Assistido:', assistido ? `${assistido.nome} — ${assistido.idade}` : 'João Silva (Avô) — 75 anos'],
    ['Condição:', assistido?.condicao || 'Parkinson'],
    ['Mobilidade:', assistido?.mobilidade || 'Cadeira de rodas'],
    ['Turno:', assistido?.turno || cuidador.turnos?.[0] || 'Manhã (06h às 14h)'],
    ['Frequência:', assistido?.frequencia || 'Diária'],
    ['Local:', assistido?.local || 'Residência do assistido'],
  ];

  return (
    <AuthLayout title="Confirmar Solicitação">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Summary card */}
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: radius.lg, padding: '20px' }}>
          {rows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary, minWidth: '90px', flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: '13px', color: colors.heading }}>{value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: colors.muted, lineHeight: 1.5, margin: 0 }}>
          Nossa equipe entrará em contato em até 24h úteis para confirmar a disponibilidade.
        </p>

        <Divider />

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="green" fullWidth size="lg" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Confirmar Solicitação
          </Button>
          <Button variant="outline" fullWidth size="lg" onClick={() => navigate(ROUTES.PERFIL_CUIDADOR, { cuidador, assistido })}>
            Cancelar
          </Button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: colors.muted, margin: 0 }}>
          Ao confirmar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </AuthLayout>
  );
}

// ─── MINHAS SOLICITAÇÕES ──────────────────────────────────
export function MinhasSolicitacoesPage() {
  const { navigate } = useRouter();
  const { assistidos } = useAssistidos();
  const [activeTab, setActiveTab] = useState('todas');
  const nomesAssistidos = assistidos.map((assistido) => assistido.nome);
  const solicitacoesDoUsuario = mockSolicitacoes.filter((solicitacao) =>
    nomesAssistidos.some((nome) => solicitacao.assistidoNome.includes(nome))
  );

  const tabs = [
    { key: 'todas', label: 'Todas', count: solicitacoesDoUsuario.length },
    { key: 'pendente', label: 'Pendentes', count: solicitacoesDoUsuario.filter(s => s.status === 'pendente').length },
    { key: 'aprovada', label: 'Aprovadas', count: solicitacoesDoUsuario.filter(s => s.status === 'aprovada').length },
    { key: 'cancelada', label: 'Canceladas', count: solicitacoesDoUsuario.filter(s => s.status === 'cancelada').length },
  ];

  const filtered = activeTab === 'todas' ? solicitacoesDoUsuario : solicitacoesDoUsuario.filter(s => s.status === activeTab);

  return (
    <AppLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Minhas Solicitações</h1>
        <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Acompanhe o status de todas as suas solicitações</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: '24px' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              background: 'none', border: 'none',
              padding: '10px 20px',
              fontSize: '14px', fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? colors.primary : colors.secondary,
              borderBottom: activeTab === t.key ? `2px solid ${colors.primary}` : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              transition: 'color .15s',
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: colors.muted }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p>Nenhuma solicitação encontrada nesta categoria.</p>
          </div>
        ) : filtered.map(s => (
          <Card key={s.id} style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 4px' }}>{s.assistidoNome}</p>
                <p style={{ fontSize: '13px', color: colors.muted, margin: '0 0 6px' }}>Solicitado em {s.dataSolicitacao}</p>
                <p style={{ fontSize: '13px', color: colors.secondary, margin: 0 }}>
                  Cuidador: <strong>{s.cuidadorNome}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                <Badge variant={statusVariant[s.status]}>{statusLabel[s.status]}</Badge>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.CONFIRMACAO_SOLICITACAO)}>
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

// ─── AGENDAMENTOS ─────────────────────────────────────────
export function AgendamentosPage() {
  const { assistidos } = useAssistidos();
  const nomesAssistidos = assistidos.map((assistido) => assistido.nome);
  const agendamentosDoUsuario = mockAgendamentos.filter((agendamento) =>
    nomesAssistidos.some((nome) => agendamento.assistidoNome.includes(nome))
  );
  const proximoAgendamento = agendamentosDoUsuario[0];

  return (
    <AppLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Agendamentos</h1>
        <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Seus próximos atendimentos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agendamentosDoUsuario.length === 0 ? (
            <Card style={{ padding: '40px', textAlign: 'center', color: colors.muted }}>
              Nenhum agendamento encontrado para os seus assistidos.
            </Card>
          ) : agendamentosDoUsuario.map(ag => (
            <Card key={ag.id} style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: colors.primary, margin: '0 0 6px' }}>
                📅 {ag.data} · {ag.horario}
              </p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 4px' }}>{ag.cuidadorNome}</p>
              <p style={{ fontSize: '13px', color: colors.muted, margin: '0 0 10px' }}>
                Assistido: {ag.assistidoNome} · Turno: {ag.turno}
              </p>
              <Badge variant="ok">✓ Confirmado</Badge>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Próximo atendimento */}
          <div style={{ background: gradients.primary, borderRadius: radius.xl, padding: '24px', color: colors.white }}>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 8px' }}>⚡ Próximo Atendimento</p>
            {proximoAgendamento ? (
              <>
                <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>{proximoAgendamento.cuidadorNome}</p>
                <p style={{ fontSize: '13px', opacity: 0.85, margin: 0 }}>
                  {proximoAgendamento.data} · {proximoAgendamento.horario} · {proximoAgendamento.turno}
                </p>
              </>
            ) : (
              <p style={{ fontSize: '13px', opacity: 0.85, margin: 0 }}>Nenhum atendimento confirmado.</p>
            )}
          </div>

          {/* Resumo do mês */}
          <Card>
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 16px' }}>Resumo do Mês</p>
            {[
              ['Total de atendimentos', agendamentosDoUsuario.length, colors.heading],
              ['Confirmados', agendamentosDoUsuario.filter(a => a.status === 'confirmado').length, colors.okText],
              ['Pendentes', agendamentosDoUsuario.filter(a => a.status !== 'confirmado').length, colors.pendingText],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: '13px', color: colors.secondary }}>{l}</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
