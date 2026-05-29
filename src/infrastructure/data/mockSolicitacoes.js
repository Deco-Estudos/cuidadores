export const mockSolicitacoes = [
  {
    id: 1,
    assistidoNome: 'João Silva (Avô)',
    cuidadorNome: 'Aguardando atribuição',
    dataSolicitacao: '12/03/2026',
    status: 'pendente',
    turno: 'Manhã',
    frequencia: 'Diária',
    local: 'Residência do assistido',
  },
  {
    id: 2,
    assistidoNome: 'Eu mesmo(a)',
    cuidadorNome: 'Ana Oliveira',
    dataSolicitacao: '01/03/2026',
    status: 'aprovada',
    turno: 'Manhã',
    frequencia: 'Diária',
    local: 'Residência do assistido',
  },
  {
    id: 3,
    assistidoNome: 'Ana Costa (Avó)',
    cuidadorNome: 'Aguardando atribuição',
    dataSolicitacao: '28/02/2026',
    status: 'pendente',
    turno: 'Tarde',
    frequencia: 'Semanal',
    local: 'Residência do assistido',
  },
];

export const mockAgendamentos = [
  {
    id: 1,
    data: 'Amanhã · 27/03/2026',
    horario: '06h00',
    cuidadorNome: 'Ana Oliveira',
    assistidoNome: 'Eu mesmo(a)',
    turno: 'Manhã',
    status: 'confirmado',
  },
  {
    id: 2,
    data: '28/03/2026',
    horario: '06h00',
    cuidadorNome: 'Ana Oliveira',
    assistidoNome: 'Eu mesmo(a)',
    turno: 'Manhã',
    status: 'confirmado',
  },
  {
    id: 3,
    data: '01/04/2026',
    horario: '14h00',
    cuidadorNome: 'Carlos Mendes',
    assistidoNome: 'João Silva (Avô)',
    turno: 'Tarde',
    status: 'confirmado',
  },
];

export const mockResumoMes = {
  total: 12,
  confirmados: 10,
  pendentes: 2,
};
