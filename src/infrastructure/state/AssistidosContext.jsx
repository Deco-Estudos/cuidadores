import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockAssistidos } from '../data/mockCuidadores';

const STORAGE_KEY = 'cuidadores_assistidos_demo';
const AssistidosContext = createContext(null);

const completeMockAssistidos = mockAssistidos.map((assistido) => ({
  ...assistido,
  cadastroCompleto: true,
  etapaAtual: 5,
  percentualCadastro: 100,
  genero: assistido.genero || 'Não informado',
  alimentacao: assistido.alimentacao || 'Alimentação oral normal',
  frequencia: assistido.frequencia || 'Diária',
  turno: assistido.turno || 'Manhã',
  local: assistido.local || 'Residência do assistido',
  tipoCuidador: assistido.tipoCuidador || 'Cuidador de Idosos',
}));

function loadInitialAssistidos() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Mantém o mock caso o navegador bloqueie localStorage.
  }
  return completeMockAssistidos;
}

function calculateProgress(data) {
  const requiredGroups = [
    ['isAssistido', 'idade'],
    ['genero', 'mobilidade', 'alimentacao'],
    ['generoCuidador', 'frequencia', 'turno'],
    ['interditado', 'local'],
    ['estadoSaude', 'condicao', 'tipoCuidador'],
  ];
  const completedGroups = requiredGroups.filter((group) => group.every((key) => Boolean(data[key]))).length;
  return Math.max(20, Math.round((completedGroups / requiredGroups.length) * 100));
}

export function AssistidosProvider({ children }) {
  const [assistidos, setAssistidos] = useState(loadInitialAssistidos);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assistidos));
    } catch {
      // O app continua funcionando em memória.
    }
  }, [assistidos]);

  const createDraftProfile = (payload) => {
    const novo = {
      id: Date.now(),
      nome: payload.isAssistido === 'sim' ? 'Eu mesmo(a)' : payload.nome,
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
    setAssistidos((current) => [novo, ...current]);
    return novo;
  };

  const updateProfile = (id, payload, options = {}) => {
    let updatedProfile = null;
    setAssistidos((current) => current.map((assistido) => {
      if (String(assistido.id) !== String(id)) return assistido;
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
    setAssistidos((current) => current.filter((assistido) => String(assistido.id) !== String(id)));
  };

  const getProfile = (id) => assistidos.find((assistido) => String(assistido.id) === String(id));

  const value = useMemo(() => ({
    assistidos,
    createDraftProfile,
    updateProfile,
    deleteProfile,
    getProfile,
  }), [assistidos]);

  return <AssistidosContext.Provider value={value}>{children}</AssistidosContext.Provider>;
}

export function useAssistidos() {
  const ctx = useContext(AssistidosContext);
  if (!ctx) throw new Error('useAssistidos must be used within AssistidosProvider');
  return ctx;
}
