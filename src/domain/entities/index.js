// Entidade Usuário
export const createUser = ({ id, nome, email, telefone }) => ({
  id, nome, email, telefone,
});

// Entidade Assistido
export const createAssistido = ({
  id, nome, idade, genero, mobilidade,
  condicao, alimentacao, observacoes, criadoEm,
}) => ({
  id, nome, idade, genero, mobilidade,
  condicao, alimentacao, observacoes, criadoEm,
});

// Entidade Cuidador
export const createCuidador = ({
  id, nome, especialidade, experiencia,
  avaliacao, totalAvaliacoes, especialidades,
  turnos, descricao, verificado, atendimentos,
}) => ({
  id, nome, especialidade, experiencia,
  avaliacao, totalAvaliacoes, especialidades,
  turnos, descricao, verificado, atendimentos,
});

// Entidade Solicitação
export const createSolicitacao = ({
  id, assistidoNome, cuidadorNome, dataSolicitacao,
  status, turno, frequencia, local,
}) => ({
  id, assistidoNome, cuidadorNome, dataSolicitacao,
  status, turno, frequencia, local,
});

// Entidade Agendamento
export const createAgendamento = ({
  id, data, horario, cuidadorNome, assistidoNome,
  turno, status,
}) => ({
  id, data, horario, cuidadorNome, assistidoNome,
  turno, status,
});
