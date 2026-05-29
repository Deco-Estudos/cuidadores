import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'cuidadores_assistidos_demo';
const AssistidosContext = createContext(null);

const demoAssistidos = [
  {
    id: 'assistido_pedro_vo',
    usuarioId: 'user_pedro',
    nome: 'Maria Aparecida',
    parentesco: 'Avó',
    idade: '78 anos',
    genero: 'Feminino',
    mobilidade: 'Com ajuda',
    alimentacao: 'Alimentação oral normal',
    generoCuidador: 'Feminino',
    frequencia: 'Diária',
    turno: 'Manhã',
    interditado: 'Não',
    local: 'Residência do assistido',
    estadoSaude: 'Idosa lúcida, precisa de apoio para banho, alimentação e pequenas caminhadas.',
    condicao: 'Hipertensão',
    tipoCuidador: 'Cuidador de Idosos',
    observacoes: 'Vó do Pedro. Necessita acompanhamento durante a manhã.',
    criadoEm: '28/02/2026',
    cadastroCompleto: true,
    etapaAtual: 5,
    percentualCadastro: 100,
  },
  {
    id: 'assistido_pedro_tiavo',
    usuarioId: 'user_pedro',
    nome: 'Ana Costa',
    parentesco: 'Tia-avó',
    idade: '82 anos',
    genero: 'Feminino',
    mobilidade: 'Cadeira de rodas',
    alimentacao: 'Dieta pastosa',
    generoCuidador: 'Indiferente',
    frequencia: 'Semanal',
    turno: 'Tarde',
    interditado: 'Não',
    local: 'Residência do assistido',
    estadoSaude: 'Mobilidade reduzida e necessidade de auxílio para transferências.',
    condicao: 'Pós-AVC',
    tipoCuidador: 'Técnico de Enfermagem',
    observacoes: 'Tia-avó do Pedro. Usa cadeira de rodas.',
    criadoEm: '14/02/2026',
    cadastroCompleto: true,
    etapaAtual: 5,
    percentualCadastro: 100,
  },
  {
    id: 'assistido_marcus_proprio',
    usuarioId: 'user_marcus',
    nome: 'Marcus',
    parentesco: 'Próprio',
    idade: '68 anos',
    genero: 'Masculino',
    mobilidade: 'Independente',
    alimentacao: 'Alimentação oral normal',
    generoCuidador: 'Indiferente',
    frequencia: 'Mensal',
    turno: 'Manhã',
    interditado: 'Não',
    local: 'Residência do assistido',
    estadoSaude: 'Precisa de acompanhamento eventual em consultas e rotina.',
    condicao: 'Diabetes',
    tipoCuidador: 'Cuidador de Idosos',
    observacoes: 'Perfil do próprio Marcus.',
    criadoEm: '10/03/2026',
    cadastroCompleto: true,
    etapaAtual: 5,
    percentualCadastro: 100,
  },
  {
    id: 'assistido_marcus_tia',
    usuarioId: 'user_marcus',
    nome: 'Cláudia Mendes',
    parentesco: 'Tia',
    idade: '73 anos',
    genero: 'Feminino',
    mobilidade: 'Com ajuda',
    alimentacao: 'Alimentação oral normal',
    generoCuidador: 'Feminino',
    frequencia: 'Diária',
    turno: 'Noite',
    interditado: 'Não',
    local: 'Residência do assistido',
    estadoSaude: 'Necessita companhia noturna e auxílio com medicação.',
    condicao: 'Alzheimer',
    tipoCuidador: 'Auxiliar de Enfermagem',
    observacoes: 'Tia do Marcus. Necessita atenção principalmente à noite.',
    criadoEm: '08/03/2026',
    cadastroCompleto: true,
    etapaAtual: 5,
    percentualCadastro: 100,
  },
];

function loadInitialAssistidos() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoAssistidos));
  } catch {
    // Mantém os dados em memória caso o navegador bloqueie localStorage.
  }
  return demoAssistidos;
}

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function calculateProgress(data) {
  const requiredGroups = [
    ['idade'],
    ['genero', 'mobilidade', 'alimentacao'],
    ['generoCuidador', 'frequencia', 'turno'],
    ['interditado', 'local'],
    ['estadoSaude', 'condicao', 'tipoCuidador'],
  ];
  const completedGroups = requiredGroups.filter((group) => group.every((key) => Boolean(data[key]))).length;
  return Math.max(20, Math.round((completedGroups / requiredGroups.length) * 100));
}

export function AssistidosProvider({ children }) {
  const { usuarioLogado } = useAuth();
  const [todosAssistidos, setTodosAssistidos] = useState(loadInitialAssistidos);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todosAssistidos));
    } catch {
      // O app continua funcionando em memória.
    }
  }, [todosAssistidos]);

  const assistidos = useMemo(() => {
    if (!usuarioLogado) return [];
    return todosAssistidos.filter((assistido) => String(assistido.usuarioId) === String(usuarioLogado.id));
  }, [todosAssistidos, usuarioLogado]);

  const createDraftProfile = (payload) => {
    if (!usuarioLogado) return null;

    const novo = {
      id: createId('assistido'),
      usuarioId: usuarioLogado.id,
      nome: payload.isAssistido === 'sim' ? usuarioLogado.nome : payload.nome,
      parentesco: payload.isAssistido === 'sim' ? 'Próprio' : payload.parentesco || 'Familiar',
      idade: `${payload.idade} anos`,
      isAssistido: payload.isAssistido,
      mobilidade: 'Pendente',
      condicao: 'Pendente',
      observacoes: 'Cadastro iniciado. Complete as informações para solicitar um cuidador.',
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      cadastroCompleto: false,
      etapaAtual: 2,
      percentualCadastro: 20,
    };
    setTodosAssistidos((current) => [novo, ...current]);
    return novo;
  };

  const updateProfile = (id, payload, options = {}) => {
    let updatedProfile = null;
    setTodosAssistidos((current) => current.map((assistido) => {
      if (String(assistido.id) !== String(id) || String(assistido.usuarioId) !== String(usuarioLogado?.id)) return assistido;
      const merged = { ...assistido, ...payload };
      const percentualCadastro = options.complete ? 100 : calculateProgress(merged);
      updatedProfile = {
        ...merged,
        cadastroCompleto: options.complete ? true : Boolean(merged.cadastroCompleto),
        etapaAtual: options.nextStep || merged.etapaAtual,
        percentualCadastro,
        mobilidade: merged.mobilidade || merged.deambulacao || assistido.mobilidade,
        condicao: merged.condicao || assistido.condicao,
        observacoes: merged.observacoes || assistido.observacoes,
      };
      return updatedProfile;
    }));
    return updatedProfile;
  };

  const deleteProfile = (id) => {
    setTodosAssistidos((current) => current.filter(
      (assistido) => !(String(assistido.id) === String(id) && String(assistido.usuarioId) === String(usuarioLogado?.id))
    ));
  };

  const getProfile = (id) => assistidos.find((assistido) => String(assistido.id) === String(id));

  const value = useMemo(() => ({
    assistidos,
    todosAssistidos,
    createDraftProfile,
    updateProfile,
    deleteProfile,
    getProfile,
  }), [assistidos, todosAssistidos, usuarioLogado]);

  return <AssistidosContext.Provider value={value}>{children}</AssistidosContext.Provider>;
}

export function useAssistidos() {
  const ctx = useContext(AssistidosContext);
  if (!ctx) throw new Error('useAssistidos must be used within AssistidosProvider');
  return ctx;
}
