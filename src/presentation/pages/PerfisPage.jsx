import { useState } from 'react';
import { colors, radius, shadows } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { useAssistidos } from '../../infrastructure/state/AssistidosContext';
import { SubHeader } from '../components/Header';
import { Button, Badge, Modal } from '../components/ui';

function CompletionBar({ percent }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: colors.secondary }}>Progresso do cadastro</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: percent === 100 ? colors.okText : colors.pendingText }}>{percent}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: radius.full, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: percent === 100 ? colors.okText : colors.pendingText, borderRadius: radius.full }} />
      </div>
    </div>
  );
}

function AssistidoCard({ assistido, onSolicitar, onCompletar, onExcluir }) {
  const completo = Boolean(assistido.cadastroCompleto);
  const percent = assistido.percentualCadastro || (completo ? 100 : 20);

  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${completo ? colors.border : '#FDE68A'}`,
      borderRadius: radius.xl,
      boxShadow: shadows.card,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '17px', fontWeight: 600, color: colors.heading, margin: '0 0 2px' }}>{assistido.nome}</p>
            <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>{assistido.idade}</p>
          </div>
          <Badge variant={completo ? 'ok' : 'pending'}>{completo ? 'Completo' : 'Incompleto'}</Badge>
        </div>

        <CompletionBar percent={percent} />

        {!completo && (
          <div style={{ background: '#FEF9C2', border: '1px solid #FDE68A', borderRadius: radius.md, padding: '10px 12px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: colors.pendingText, lineHeight: 1.5, margin: 0 }}>
              Você já pode sair e voltar depois. Para solicitar um cuidador, conclua saúde, mobilidade, preferências, local e tipo de cuidador.
            </p>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: colors.secondary }}>Mobilidade:</span>
            <span style={{ fontSize: '13px', color: colors.heading, fontWeight: 500 }}>{assistido.mobilidade || 'Pendente'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.secondary }}>Condição:</span>
            <span style={{ fontSize: '13px', color: colors.heading, fontWeight: 500 }}>{assistido.condicao || 'Pendente'}</span>
          </div>
        </div>

        <div style={{ background: colors.bgPage, borderRadius: radius.md, padding: '10px 14px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: colors.secondary, margin: 0 }}>{assistido.observacoes}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {completo ? (
            <button
              onClick={onSolicitar}
              style={{ flex: 1, background: 'linear-gradient(150deg, #155DFC 0%, #4F39F6 100%)', color: colors.white, border: 'none', borderRadius: radius.md, padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Solicitar Cuidador →
            </button>
          ) : (
            <button
              onClick={onCompletar}
              style={{ flex: 1, background: colors.white, color: colors.primary, border: `1px solid ${colors.primary}`, borderRadius: radius.md, padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Completar para Solicitar →
            </button>
          )}
          <button onClick={onCompletar} style={{ width: '44px', height: '40px', border: `1px solid ${colors.inputBorder}`, borderRadius: radius.md, background: colors.white, cursor: 'pointer', fontSize: '16px' }}>
            ✏
          </button>
          <button
            onClick={onExcluir}
            style={{ width: '44px', height: '40px', border: '1px solid #DC2626', borderRadius: radius.md, background: '#FEF2F2', cursor: 'pointer', fontSize: '16px' }}
          >
            🗑
          </button>
        </div>
      </div>

      <div style={{ background: colors.bgPage, borderTop: `1px solid ${colors.border}`, padding: '10px 24px' }}>
        <p style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>
          Criado em {assistido.criadoEm} {completo ? '· Pronto para solicitação' : `· Retomar na etapa ${assistido.etapaAtual || 2}`}
        </p>
      </div>
    </div>
  );
}

export function PerfisPage() {
  const { navigate, routeParams } = useRouter();
  const { assistidos, deleteProfile } = useAssistidos();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    deleteProfile(deleteTarget.id);
    setDeleteTarget(null);
  };

  const resumeRoute = (assistido) => {
    if (assistido.cadastroCompleto) return ROUTES.CADASTRO_STEP_2;
    const step = Math.min(Math.max(assistido.etapaAtual || 2, 2), 5);
    return ROUTES[`CADASTRO_STEP_${step}`] || ROUTES.CADASTRO_STEP_2;
  };

  if (assistidos.length === 0) return <PerfisEmptyPage />;

  return (
    <>
      <div style={{ minHeight: '100vh', background: colors.bgPage, fontFamily: 'Inter, sans-serif' }}>
        <SubHeader backLabel="Voltar ao Dashboard" backRoute={ROUTES.DASHBOARD} />
        <main className="page-main" style={{ maxWidth: '1536px', margin: '0 auto', padding: '32px 128px 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Perfis de Assistidos</h1>
              <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Gerencie perfis completos e rascunhos. Só cadastros completos podem solicitar cuidador.</p>
            </div>
            <Button variant="primary" onClick={() => navigate(ROUTES.CADASTRO_STEP_1)}>
              + Adicionar Novo Perfil
            </Button>
          </div>

          {routeParams?.mensagem && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: radius.lg, padding: '14px 18px', color: colors.primary, fontSize: '14px', marginBottom: '20px' }}>
              {routeParams.mensagem}
            </div>
          )}

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {assistidos.map(a => (
              <AssistidoCard
                key={a.id}
                assistido={a}
                onSolicitar={() => navigate(ROUTES.LISTA_CUIDADORES, { assistido: a, assistidoId: a.id })}
                onCompletar={() => navigate(resumeRoute(a), { assistidoId: a.id })}
                onExcluir={() => setDeleteTarget(a)}
              />
            ))}
          </div>
        </main>
      </div>

      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)} width="520px">
          <div style={{ background: '#FEE2E2', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>!</div>
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#DC2626', margin: 0 }}>Excluir Perfil</p>
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '15px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 24px' }}>
              Tem certeza que deseja excluir o perfil de <strong>{deleteTarget.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '20px', display: 'flex', gap: '12px' }}>
              <Button variant="outline" fullWidth onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button variant="danger" fullWidth onClick={handleDelete}>Excluir Perfil</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export function PerfisEmptyPage() {
  const { navigate } = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: colors.bgPage, fontFamily: 'Inter, sans-serif' }}>
      <SubHeader backLabel="Voltar ao Dashboard" backRoute={ROUTES.DASHBOARD} />
      <main className="page-main" style={{ maxWidth: '1536px', margin: '0 auto', padding: '32px 128px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Perfis de Assistidos</h1>
          <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Gerencie os perfis das pessoas que necessitam de cuidado</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '480px' }}>
          <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: radius.xl, boxShadow: shadows.card, padding: '64px 48px', textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px', color: '#D4D4D4' }}>👤</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: colors.heading, margin: '0 0 12px' }}>
              Nenhum perfil cadastrado ainda
            </h2>
            <p style={{ fontSize: '15px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 28px' }}>
              Preencha apenas a primeira etapa para criar um rascunho. Depois, complete o cadastro quando quiser solicitar um cuidador.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.CADASTRO_STEP_1)}>
              + Adicionar Primeiro Perfil
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
