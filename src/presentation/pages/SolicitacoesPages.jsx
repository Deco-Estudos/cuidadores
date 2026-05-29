import { useState } from 'react';
import { colors, radius, gradients } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Badge, Card, Divider, Modal } from '../components/ui';
import { mockCuidadores } from '../../infrastructure/data/mockCuidadores';
import { useSolicitacoes } from '../../infrastructure/state/SolicitacoesContext';

const statusVariant = { pendente: 'pending', aprovada: 'ok', cancelada: 'cancel' };
const statusLabel = { pendente: '⏱ Pendente', aprovada: '✓ Aprovada', cancelada: '✕ Cancelada' };

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Card style={{ padding: '48px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
      <p style={{ fontSize: '17px', fontWeight: 700, color: colors.heading, margin: '0 0 8px' }}>{title}</p>
      <p style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 20px' }}>{description}</p>
      {actionLabel && <Button variant="primary" onClick={onAction}>{actionLabel}</Button>}
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary, minWidth: '105px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '13px', color: colors.heading }}>{value}</span>
    </div>
  );
}

export function ConfirmacaoSolicitacaoPage() {
  const { navigate, routeParams } = useRouter();
  const { criarSolicitacao } = useSolicitacoes();
  const cuidador = routeParams?.cuidador || mockCuidadores.find((item) => String(item.id) === String(routeParams?.cuidadorId)) || null;
  const assistido = routeParams?.assistido || null;
  const [error, setError] = useState('');

  const confirmar = () => {
    const result = criarSolicitacao({ cuidador, assistido });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(ROUTES.DETALHE_SOLICITACAO, {
      solicitacaoId: result.solicitacao.id,
      mensagem: 'Solicitação criada com sucesso. Ela ficará pendente até aprovação.',
    });
  };

  if (!cuidador || !assistido) {
    return (
      <AuthLayout title="Solicitação incompleta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <p style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.6, margin: 0 }}>
            Para criar uma solicitação, escolha um perfil de assistido completo e depois selecione um cuidador.
          </p>
          <Button variant="primary" fullWidth onClick={() => navigate(ROUTES.PERFIS)}>Escolher assistido</Button>
          <Button variant="outline" fullWidth onClick={() => navigate(ROUTES.DASHBOARD)}>Voltar ao Dashboard</Button>
        </div>
      </AuthLayout>
    );
  }

  const rows = [
    ['Cuidador:', `${cuidador.nome} — ${cuidador.especialidade}`],
    ['Assistido:', `${assistido.nome} — ${assistido.idade}`],
    ['Condição:', assistido.condicao || 'Não informada'],
    ['Mobilidade:', assistido.mobilidade || 'Não informada'],
    ['Turno:', assistido.turno || cuidador.turnos?.[0] || 'A combinar'],
    ['Frequência:', assistido.frequencia || 'A combinar'],
    ['Local:', assistido.local || 'Residência do assistido'],
  ];

  return (
    <AuthLayout title="Confirmar Solicitação">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: colors.red, borderRadius: radius.md, padding: '10px 12px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: radius.lg, padding: '20px' }}>
          {rows.map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}
        </div>

        <p style={{ fontSize: '13px', color: colors.muted, lineHeight: 1.5, margin: 0 }}>
          Esta versão não envia dados para servidor. Ao confirmar, a solicitação será salva no localStorage do navegador e aparecerá em Minhas Solicitações.
        </p>

        <Divider />

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="green" fullWidth size="lg" onClick={confirmar}>
            Confirmar Solicitação
          </Button>
          <Button variant="outline" fullWidth size="lg" onClick={() => navigate(ROUTES.PERFIL_CUIDADOR, { cuidador, assistido })}>
            Cancelar
          </Button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: colors.muted, margin: 0 }}>
          Você poderá cancelar ou simular aprovação pela tela de detalhes.
        </p>
      </div>
    </AuthLayout>
  );
}

export function MinhasSolicitacoesPage() {
  const { navigate } = useRouter();
  const { solicitacoes } = useSolicitacoes();
  const [activeTab, setActiveTab] = useState('todas');

  const tabs = [
    { key: 'todas', label: 'Todas', count: solicitacoes.length },
    { key: 'pendente', label: 'Pendentes', count: solicitacoes.filter(s => s.status === 'pendente').length },
    { key: 'aprovada', label: 'Aprovadas', count: solicitacoes.filter(s => s.status === 'aprovada').length },
    { key: 'cancelada', label: 'Canceladas', count: solicitacoes.filter(s => s.status === 'cancelada').length },
  ];

  const filtered = activeTab === 'todas' ? solicitacoes : solicitacoes.filter(s => s.status === activeTab);

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Minhas Solicitações</h1>
          <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Acompanhe o status de todas as suas solicitações locais</p>
        </div>
        <Button variant="primary" onClick={() => navigate(ROUTES.PERFIS)}>+ Nova Solicitação</Button>
      </div>

      <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: '24px', overflowX: 'auto' }}>
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
              whiteSpace: 'nowrap',
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma solicitação encontrada"
            description="Crie uma solicitação selecionando um assistido completo e um cuidador disponível."
            actionLabel="Criar solicitação"
            onAction={() => navigate(ROUTES.PERFIS)}
          />
        ) : filtered.map(s => (
          <Card key={s.id} style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 4px' }}>{s.assistidoNome}</p>
                <p style={{ fontSize: '13px', color: colors.muted, margin: '0 0 6px' }}>Solicitado em {s.dataSolicitacao}</p>
                <p style={{ fontSize: '13px', color: colors.secondary, margin: 0 }}>
                  Cuidador: <strong>{s.cuidadorNome}</strong> · Turno: {s.turno} · {s.frequencia}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                <Badge variant={statusVariant[s.status]}>{statusLabel[s.status]}</Badge>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DETALHE_SOLICITACAO, { solicitacaoId: s.id })}>
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

export function DetalheSolicitacaoPage() {
  const { navigate, routeParams } = useRouter();
  const { getSolicitacao, cancelarSolicitacao, aprovarSolicitacaoDemo } = useSolicitacoes();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [mensagem, setMensagem] = useState(routeParams?.mensagem || '');
  const solicitacao = getSolicitacao(routeParams?.solicitacaoId);

  if (!solicitacao) {
    return (
      <AppLayout>
        <EmptyState
          title="Solicitação não encontrada"
          description="A solicitação pode ter sido removida, pertencer a outro usuário ou o navegador pode ter perdido o estado da rota."
          actionLabel="Ver minhas solicitações"
          onAction={() => navigate(ROUTES.MINHAS_SOLICITACOES)}
        />
      </AppLayout>
    );
  }

  const aprovar = () => {
    aprovarSolicitacaoDemo(solicitacao.id);
    setMensagem('Solicitação aprovada na simulação. Um agendamento foi gerado automaticamente.');
  };

  const cancelar = () => {
    cancelarSolicitacao(solicitacao.id);
    setShowCancelModal(false);
    setMensagem('Solicitação cancelada.');
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Detalhes da Solicitação</h1>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.MINHAS_SOLICITACOES)}>← Voltar</Button>
      </div>

      {mensagem && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: radius.lg, padding: '14px 18px', color: colors.primary, fontSize: '14px', marginBottom: '20px' }}>
          {mensagem}
        </div>
      )}

      <div className="grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>{solicitacao.assistidoNome}</h2>
              <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>Solicitado em {solicitacao.dataSolicitacao}</p>
            </div>
            <Badge variant={statusVariant[solicitacao.status]}>{statusLabel[solicitacao.status]}</Badge>
          </div>

          <Divider style={{ margin: '0 0 20px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px', marginBottom: '24px' }}>
            <InfoRow label="Cuidador:" value={`${solicitacao.cuidadorNome} — ${solicitacao.cuidadorEspecialidade}`} />
            <InfoRow label="Assistido:" value={`${solicitacao.assistidoNome} — ${solicitacao.assistidoIdade || 'idade não informada'}`} />
            <InfoRow label="Condição:" value={solicitacao.condicao} />
            <InfoRow label="Mobilidade:" value={solicitacao.mobilidade} />
            <InfoRow label="Turno:" value={solicitacao.turno} />
            <InfoRow label="Frequência:" value={solicitacao.frequencia} />
            <InfoRow label="Local:" value={solicitacao.local} />
            <InfoRow label="Início:" value={solicitacao.atendimentoInicio || 'Aguardando aprovação'} />
          </div>

          <div style={{ background: colors.bgPage, borderRadius: radius.md, padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Observações do assistido</p>
            <p style={{ fontSize: '13px', color: colors.secondary, lineHeight: 1.6, margin: 0 }}>{solicitacao.observacoes}</p>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.heading, margin: '0 0 12px' }}>Ações</h2>
            <p style={{ fontSize: '13px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 16px' }}>
              Como não há backend, a aprovação abaixo é apenas uma simulação para testar o agendamento.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button variant="primary" fullWidth disabled={solicitacao.status === 'aprovada'} onClick={aprovar}>
                {solicitacao.status === 'aprovada' ? 'Já aprovada' : 'Simular aprovação'}
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate(ROUTES.AGENDAMENTOS)} disabled={solicitacao.status !== 'aprovada'}>
                Ver agendamento
              </Button>
              <Button variant="danger" fullWidth disabled={solicitacao.status === 'cancelada'} onClick={() => setShowCancelModal(true)}>
                {solicitacao.status === 'cancelada' ? 'Cancelada' : 'Cancelar solicitação'}
              </Button>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.heading, margin: '0 0 12px' }}>Status</h2>
            <p style={{ fontSize: '13px', color: colors.secondary, lineHeight: 1.6, margin: 0 }}>
              Pendente: aguardando confirmação.<br /> Aprovada: gera agendamento.<br /> Cancelada: permanece no histórico, mas não gera atendimento.
            </p>
          </Card>
        </div>
      </div>

      {showCancelModal && (
        <Modal onClose={() => setShowCancelModal(false)} width="520px">
          <div style={{ background: '#FEE2E2', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>!</div>
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#DC2626', margin: 0 }}>Cancelar Solicitação</p>
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '15px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 24px' }}>
              Tem certeza que deseja cancelar a solicitação para <strong>{solicitacao.assistidoNome}</strong> com <strong>{solicitacao.cuidadorNome}</strong>?
            </p>
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '20px', display: 'flex', gap: '12px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowCancelModal(false)}>Voltar</Button>
              <Button variant="danger" fullWidth onClick={cancelar}>Cancelar Solicitação</Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}

export function AgendamentosPage() {
  const { navigate } = useRouter();
  const { agendamentos } = useSolicitacoes();
  const proximoAgendamento = agendamentos[0];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Agendamentos</h1>
          <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Seus próximos atendimentos gerados por solicitações aprovadas</p>
        </div>
        <Button variant="primary" onClick={() => navigate(ROUTES.MINHAS_SOLICITACOES)}>Ver solicitações</Button>
      </div>

      <div className="grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agendamentos.length === 0 ? (
            <EmptyState
              title="Nenhum agendamento confirmado"
              description="Aprove uma solicitação na simulação para gerar automaticamente um agendamento."
              actionLabel="Ver solicitações"
              onAction={() => navigate(ROUTES.MINHAS_SOLICITACOES)}
            />
          ) : agendamentos.map(ag => (
            <Card key={ag.id} style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: colors.primary, margin: '0 0 6px' }}>
                📅 {ag.data} · {ag.horario}
              </p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 4px' }}>{ag.cuidadorNome}</p>
              <p style={{ fontSize: '13px', color: colors.muted, margin: '0 0 10px' }}>
                Assistido: {ag.assistidoNome} · Turno: {ag.turno} · {ag.frequencia}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Badge variant="ok">✓ Confirmado</Badge>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DETALHE_SOLICITACAO, { solicitacaoId: ag.solicitacaoId })}>
                  Ver solicitação
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          <Card>
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 16px' }}>Resumo do Mês</p>
            {[
              ['Total de atendimentos', agendamentos.length, colors.heading],
              ['Confirmados', agendamentos.filter(a => a.status === 'confirmado').length, colors.okText],
              ['Pendentes', 0, colors.pendingText],
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
