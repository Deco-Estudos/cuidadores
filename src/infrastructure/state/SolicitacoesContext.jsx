import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'cuidadores_solicitacoes_demo';

const demoSolicitacoes = [
  {
    id: 'sol_pedro_maria_ana',
    usuarioId: 'user_pedro',
    assistidoId: 'assistido_pedro_vo',
    assistidoNome: 'Maria Aparecida',
    assistidoIdade: '78 anos',
    cuidadorId: 1,
    cuidadorNome: 'Ana Oliveira',
    cuidadorEspecialidade: 'Técnica de Enfermagem',
    dataSolicitacao: '20/05/2026',
    criadaEm: '2026-05-20T10:00:00.000Z',
    status: 'aprovada',
    turno: 'Manhã',
    frequencia: 'Diária',
    local: 'Residência do assistido',
    condicao: 'Hipertensão',
    mobilidade: 'Com ajuda',
    observacoes: 'Acompanhamento matinal com auxílio para banho, caminhada leve e medicação.',
    atendimentoInicio: '30/05/2026',
    horario: '06h00',
  },
  {
    id: 'sol_pedro_ana_carlos',
    usuarioId: 'user_pedro',
    assistidoId: 'assistido_pedro_tiavo',
    assistidoNome: 'Ana Costa',
    assistidoIdade: '82 anos',
    cuidadorId: 2,
    cuidadorNome: 'Carlos Mendes',
    cuidadorEspecialidade: 'Auxiliar de Enfermagem',
    dataSolicitacao: '23/05/2026',
    criadaEm: '2026-05-23T14:30:00.000Z',
    status: 'pendente',
    turno: 'Tarde',
    frequencia: 'Semanal',
    local: 'Residência do assistido',
    condicao: 'Pós-AVC',
    mobilidade: 'Cadeira de rodas',
    observacoes: 'Necessita apoio para transferências e reabilitação domiciliar.',
    atendimentoInicio: null,
    horario: null,
  },
  {
    id: 'sol_marcus_proprio_marcia',
    usuarioId: 'user_marcus',
    assistidoId: 'assistido_marcus_proprio',
    assistidoNome: 'Marcus',
    assistidoIdade: '68 anos',
    cuidadorId: 3,
    cuidadorNome: 'Márcia Santos',
    cuidadorEspecialidade: 'Cuidadora Sênior',
    dataSolicitacao: '18/05/2026',
    criadaEm: '2026-05-18T09:20:00.000Z',
    status: 'aprovada',
    turno: 'Manhã',
    frequencia: 'Mensal',
    local: 'Residência do assistido',
    condicao: 'Diabetes',
    mobilidade: 'Independente',
    observacoes: 'Acompanhamento eventual em consultas e rotina.',
    atendimentoInicio: '02/06/2026',
    horario: '06h00',
  },
];

const SolicitacoesContext = createContext(null);

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function loadSolicitacoes() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return safeParse(stored, demoSolicitacoes);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSolicitacoes));
  } catch {
    // O app continua funcionando em memória.
  }
  return demoSolicitacoes;
}

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR');
}

function getHorarioPorTurno(turno) {
  const normalizado = String(turno || '').toLowerCase();
  if (normalizado.includes('tarde')) return '14h00';
  if (normalizado.includes('noite')) return '22h00';
  if (normalizado.includes('integral')) return '08h00';
  return '06h00';
}

function getProximaDataAtendimento() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

function compareByCreatedAtDesc(a, b) {
  return new Date(b.criadaEm || 0).getTime() - new Date(a.criadaEm || 0).getTime();
}

export function SolicitacoesProvider({ children }) {
  const { usuarioLogado } = useAuth();
  const [todasSolicitacoes, setTodasSolicitacoes] = useState(loadSolicitacoes);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todasSolicitacoes));
    } catch {
      // O app continua funcionando em memória.
    }
  }, [todasSolicitacoes]);

  const solicitacoes = useMemo(() => {
    if (!usuarioLogado) return [];
    return todasSolicitacoes
      .filter((solicitacao) => String(solicitacao.usuarioId) === String(usuarioLogado.id))
      .sort(compareByCreatedAtDesc);
  }, [todasSolicitacoes, usuarioLogado]);

  const criarSolicitacao = ({ assistido, cuidador }) => {
    if (!usuarioLogado || !assistido || !cuidador) {
      return { ok: false, message: 'Escolha um assistido e um cuidador para criar a solicitação.' };
    }

    const agora = new Date();
    const novaSolicitacao = {
      id: createId('sol'),
      usuarioId: usuarioLogado.id,
      assistidoId: assistido.id,
      assistidoNome: assistido.nome,
      assistidoIdade: assistido.idade,
      cuidadorId: cuidador.id,
      cuidadorNome: cuidador.nome,
      cuidadorEspecialidade: cuidador.especialidade,
      dataSolicitacao: formatDate(agora),
      criadaEm: agora.toISOString(),
      status: 'pendente',
      turno: assistido.turno || cuidador.turnos?.[0] || 'Manhã',
      frequencia: assistido.frequencia || 'A combinar',
      local: assistido.local || 'Residência do assistido',
      condicao: assistido.condicao || 'Não informada',
      mobilidade: assistido.mobilidade || 'Não informada',
      observacoes: assistido.observacoes || 'Sem observações adicionais.',
      atendimentoInicio: null,
      horario: null,
    };

    setTodasSolicitacoes((current) => [novaSolicitacao, ...current]);
    return { ok: true, solicitacao: novaSolicitacao };
  };

  const atualizarStatus = (id, status) => {
    let solicitacaoAtualizada = null;
    setTodasSolicitacoes((current) => current.map((solicitacao) => {
      const pertenceAoUsuario = String(solicitacao.usuarioId) === String(usuarioLogado?.id);
      if (String(solicitacao.id) !== String(id) || !pertenceAoUsuario) return solicitacao;

      const payload = { status };
      if (status === 'aprovada' && !solicitacao.atendimentoInicio) {
        payload.atendimentoInicio = getProximaDataAtendimento();
        payload.horario = getHorarioPorTurno(solicitacao.turno);
      }
      if (status === 'cancelada') {
        payload.canceladaEm = new Date().toISOString();
      }

      solicitacaoAtualizada = { ...solicitacao, ...payload };
      return solicitacaoAtualizada;
    }));
    return solicitacaoAtualizada;
  };

  const cancelarSolicitacao = (id) => atualizarStatus(id, 'cancelada');
  const aprovarSolicitacaoDemo = (id) => atualizarStatus(id, 'aprovada');

  const getSolicitacao = (id) => solicitacoes.find((solicitacao) => String(solicitacao.id) === String(id));

  const agendamentos = useMemo(() => solicitacoes
    .filter((solicitacao) => solicitacao.status === 'aprovada')
    .map((solicitacao) => ({
      id: `ag_${solicitacao.id}`,
      solicitacaoId: solicitacao.id,
      data: solicitacao.atendimentoInicio || 'A combinar',
      horario: solicitacao.horario || getHorarioPorTurno(solicitacao.turno),
      cuidadorNome: solicitacao.cuidadorNome,
      cuidadorEspecialidade: solicitacao.cuidadorEspecialidade,
      assistidoNome: solicitacao.assistidoNome,
      turno: solicitacao.turno,
      frequencia: solicitacao.frequencia,
      status: 'confirmado',
    })), [solicitacoes]);

  const resumo = useMemo(() => ({
    total: solicitacoes.length,
    aprovadas: solicitacoes.filter((s) => s.status === 'aprovada').length,
    pendentes: solicitacoes.filter((s) => s.status === 'pendente').length,
    canceladas: solicitacoes.filter((s) => s.status === 'cancelada').length,
    agendamentos: agendamentos.length,
  }), [solicitacoes, agendamentos]);

  const value = useMemo(() => ({
    solicitacoes,
    todasSolicitacoes,
    agendamentos,
    resumo,
    criarSolicitacao,
    cancelarSolicitacao,
    aprovarSolicitacaoDemo,
    getSolicitacao,
  }), [solicitacoes, todasSolicitacoes, agendamentos, resumo, usuarioLogado]);

  return <SolicitacoesContext.Provider value={value}>{children}</SolicitacoesContext.Provider>;
}

export function useSolicitacoes() {
  const ctx = useContext(SolicitacoesContext);
  if (!ctx) throw new Error('useSolicitacoes must be used within SolicitacoesProvider');
  return ctx;
}
