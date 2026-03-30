import { useState } from 'react';
import { colors, radius, shadows, gradients } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { SubHeader } from '../components/Header';
import { Button, Badge, Card, Stars, Select, Divider } from '../components/ui';
import { mockCuidadores } from '../../infrastructure/data/mockCuidadores';

// ─── CARD DO CUIDADOR ─────────────────────────────────────
function CuidadorCard({ cuidador, onVerPerfil }) {
  return (
    <div style={{
      background: colors.white, border: `1px solid ${colors.border}`,
      borderRadius: radius.xl, boxShadow: shadows.card,
      padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'transform .15s, box-shadow .15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = shadows.lg; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = shadows.card; }}
    >
      {/* Avatar + nome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
          👩‍⚕️
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.heading, margin: '0 0 3px' }}>{cuidador.nome}</p>
          <p style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>{cuidador.especialidade} · {cuidador.experiencia}</p>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {cuidador.badges.map(b => <Badge key={b} variant="indigo">{b}</Badge>)}
        {cuidador.verificado && <Badge variant="verified">✓ Verificada</Badge>}
      </div>

      {/* Stars */}
      <Stars rating={cuidador.avaliacao} />

      {/* Desc */}
      <p style={{ fontSize: '13px', color: colors.secondary, lineHeight: 1.5, margin: 0 }}>
        {cuidador.descricao.slice(0, 110)}...
      </p>

      {/* CTA */}
      <Button variant="primary" fullWidth onClick={onVerPerfil}>
        Ver Perfil →
      </Button>
    </div>
  );
}

// ─── LISTA DE CUIDADORES ──────────────────────────────────
export function ListaCuidadoresPage() {
  const { navigate, routeParams } = useRouter();
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');

  const assistido = routeParams?.assistido;

  return (
    <div style={{ minHeight: '100vh', background: colors.bgPage, fontFamily: 'Inter, sans-serif' }}>
      <SubHeader backLabel="Voltar aos Perfis" backRoute={ROUTES.PERFIS} />
      <main style={{ maxWidth: '1536px', margin: '0 auto', padding: '32px 128px 64px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 10px' }}>Cuidadores Disponíveis</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', color: colors.secondary }}>Compatíveis com:</span>
            {assistido ? (
              <Badge variant="blue">{assistido.nome} — {assistido.condicao} · {assistido.mobilidade}</Badge>
            ) : (
              <Badge variant="blue">João Silva — Parkinson · Cadeira de rodas</Badge>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '180px' }}>
            <Select label="" value={filtroGenero} onChange={e => setFiltroGenero(e.target.value)}
              options={[{ value: '', label: 'Gênero: Todos' }, { value: 'feminino', label: 'Feminino' }, { value: 'masculino', label: 'Masculino' }]}
            />
          </div>
          <div style={{ minWidth: '180px' }}>
            <Select label="" value={filtroTurno} onChange={e => setFiltroTurno(e.target.value)}
              options={[{ value: '', label: 'Turno: Todos' }, { value: 'manha', label: 'Manhã' }, { value: 'tarde', label: 'Tarde' }, { value: 'noite', label: 'Noite' }]}
            />
          </div>
          <Button variant="primary">Filtrar</Button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {mockCuidadores.map(c => (
            <CuidadorCard
              key={c.id}
              cuidador={c}
              onVerPerfil={() => navigate(ROUTES.PERFIL_CUIDADOR, { cuidador: c })}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── PERFIL DO CUIDADOR ───────────────────────────────────
export function PerfilCuidadorPage() {
  const { navigate, routeParams } = useRouter();
  const cuidador = routeParams?.cuidador || mockCuidadores[0];

  return (
    <div style={{ minHeight: '100vh', background: colors.bgPage, fontFamily: 'Inter, sans-serif' }}>
      <SubHeader backLabel="Voltar aos Cuidadores" backRoute={ROUTES.LISTA_CUIDADORES} />
      <main style={{ maxWidth: '1536px', margin: '0 auto', padding: '32px 128px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px' }}>

          {/* Sidebar */}
          <Card style={{ alignSelf: 'start' }}>
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: '#DBEAFE', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px' }}>
                👩‍⚕️
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 4px' }}>{cuidador.nome}</h2>
              <p style={{ fontSize: '14px', color: colors.muted, margin: '0 0 10px' }}>{cuidador.especialidade}</p>
              {cuidador.verificado && <Badge variant="verified">✓ Verificada</Badge>}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: '8px' }}>
              <Stars rating={cuidador.avaliacao} />
              <span style={{ fontSize: '12px', color: colors.muted, display: 'block', marginTop: '4px' }}>({cuidador.totalAvaliacoes} avaliações)</span>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {[['Experiência', cuidador.experiencia], ['Atendimentos', cuidador.atendimentos], ['Disponibilidade', cuidador.diasDisponiveis]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: '13px', color: colors.secondary }}>{l}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.heading }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Main content */}
          <Card>
            {/* Sobre */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.heading, margin: '0 0 12px', paddingBottom: '10px', borderBottom: `1px solid ${colors.border}` }}>
                Sobre {cuidador.nome.split(' ')[0]}
              </h3>
              <p style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.7, margin: 0 }}>{cuidador.descricao}</p>
            </div>

            {/* Especialidades */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.heading, margin: '0 0 14px', paddingBottom: '10px', borderBottom: `1px solid ${colors.border}` }}>
                Especialidades
              </h3>
              {cuidador.especialidades.map(e => (
                <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: colors.primary, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: '14px', color: colors.secondary }}>{e}</span>
                </div>
              ))}
            </div>

            {/* Disponibilidade */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.heading, margin: '0 0 14px', paddingBottom: '10px', borderBottom: `1px solid ${colors.border}` }}>
                Disponibilidade
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cuidador.turnos.map(t => (
                  <span key={t} style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', borderRadius: radius.md, padding: '6px 14px', fontSize: '13px', fontWeight: 600 }}>
                    {t}
                  </span>
                ))}
                <span style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', borderRadius: radius.md, padding: '6px 14px', fontSize: '13px', fontWeight: 600 }}>
                  {cuidador.diasDisponiveis}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(ROUTES.CONFIRMACAO_SOLICITACAO, { cuidador })}
              style={{
                width: '100%', background: gradients.primary, color: colors.white,
                border: 'none', borderRadius: radius.md, padding: '16px',
                fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Solicitar Este Cuidador →
            </button>
          </Card>
        </div>
      </main>
    </div>
  );
}
