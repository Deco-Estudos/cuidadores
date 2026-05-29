import { useState } from 'react';
import { colors, radius } from '../../../domain/constants/tokens';
import { ROUTES } from '../../../domain/constants/routes';
import { useRouter } from '../../../infrastructure/router/RouterContext';
import { useAssistidos } from '../../../infrastructure/state/AssistidosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { HeartLogo } from '../../components/HeartLogo';
import { Button, Input, Select, Textarea, RadioGroup } from '../../components/ui';

function Notice({ children, variant = 'info' }) {
  const styles = variant === 'warning'
    ? { background: '#FEF9C2', border: '#FDE68A', color: '#894B00' }
    : { background: '#EFF6FF', border: '#BFDBFE', color: colors.primary };

  return (
    <div style={{ background: styles.background, border: `1px solid ${styles.border}`, borderRadius: radius.lg, padding: '12px 14px', color: styles.color, fontSize: '13px', lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function StepLayout({ step, children, onNext, nextLabel = 'Próximo →', backRoute, backParams = {}, secondaryAction }) {
  const { navigate } = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#FFFAFA', borderRadius: '12px', boxShadow: '6px 6px 24px rgba(0,0,0,0.18)', width: '100%', maxWidth: '680px', overflow: 'hidden' }}>
        <div style={{ padding: '28px 40px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <HeartLogo size={28} />
            <span style={{ fontSize: '14px', color: colors.secondary }}>Cuidadores de Idosos</span>
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: colors.heading, marginBottom: '20px' }}>
            Cadastro de Cliente
          </div>
          <ProgressBar currentStep={step} totalSteps={5} />
          <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: '24px 0 0' }} />
        </div>

        <div style={{ padding: '24px 40px 32px' }}>{children}</div>

        <div style={{ padding: '0 40px 32px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => navigate(backRoute || ROUTES.PERFIS, backParams)}>← Voltar</Button>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {secondaryAction}
            <Button variant="primary" onClick={onNext}>{nextLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function useCurrentAssistido() {
  const { routeParams, navigate } = useRouter();
  const { getProfile } = useAssistidos();
  const assistido = routeParams?.assistidoId ? getProfile(routeParams.assistidoId) : routeParams?.assistido;

  const ensureAssistido = () => {
    if (!assistido) navigate(ROUTES.PERFIS);
    return assistido;
  };

  return { assistido, ensureAssistido };
}

function hasRequired(values) {
  return values.every((value) => Boolean(String(value || '').trim()));
}

export function CadastroStep1() {
  const { navigate } = useRouter();
  const { createDraftProfile } = useAssistidos();
  const [isAssistido, setIsAssistido] = useState('');
  const [idade, setIdade] = useState('');
  const [nome, setNome] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [error, setError] = useState('');

  const idadeValida = Number(idade) > 0 && Number(idade) <= 130;
  const canSave = isAssistido && idadeValida && (isAssistido === 'sim' || (nome.trim() && parentesco));

  const saveDraft = () => {
    if (!canSave) {
      setError('Preencha os campos obrigatórios e informe uma idade válida para salvar o perfil.');
      return null;
    }
    setError('');
    return createDraftProfile({ isAssistido, idade, nome: nome.trim(), parentesco });
  };

  const saveAndExit = () => {
    const profile = saveDraft();
    if (profile) navigate(ROUTES.PERFIS, { mensagem: 'Perfil salvo como cadastro incompleto.' });
  };

  const saveAndContinue = () => {
    const profile = saveDraft();
    if (profile) navigate(ROUTES.CADASTRO_STEP_2, { assistidoId: profile.id });
  };

  return (
    <StepLayout
      step={1}
      onNext={saveAndExit}
      nextLabel="Salvar e terminar depois"
      backRoute={ROUTES.PERFIS}
      secondaryAction={<Button variant="outline" onClick={saveAndContinue}>Continuar preenchendo</Button>}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 10px' }}>Informações básicas do assistido</h2>
      <p style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 18px' }}>
        Agora o cadastro pode ser iniciado apenas com os dados essenciais. O restante fica pendente e poderá ser concluído antes de solicitar um cuidador.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <Notice variant="warning">{error}</Notice>}
        <RadioGroup
          label="Você é o assistido?"
          required
          value={isAssistido}
          onChange={setIsAssistido}
          options={[{ value: 'sim', label: 'Sim, sou eu mesmo(a)' }, { value: 'nao', label: 'Não, é outra pessoa' }]}
        />
        <Input label="Idade do Assistido" type="number" placeholder="Digite a idade" required value={idade} onChange={e => setIdade(e.target.value)} />
        {isAssistido === 'nao' && (
          <>
            <Input label="Nome do Assistido" placeholder="Digite o nome completo" required value={nome} onChange={e => setNome(e.target.value)} />
            <Select label="Parentesco" required value={parentesco} onChange={e => setParentesco(e.target.value)}
              options={[{ value: '', label: 'Selecione...' }, { value: 'Mãe/Pai', label: 'Mãe/Pai' }, { value: 'Avó/Avô', label: 'Avó/Avô' }, { value: 'Tia/Tio', label: 'Tia/Tio' }, { value: 'Cônjuge', label: 'Cônjuge' }, { value: 'Outro familiar', label: 'Outro familiar' }]}
            />
          </>
        )}
        <Notice>
          Obrigatório agora: identificação e idade. Obrigatório para solicitar cuidador: saúde, mobilidade, preferências de atendimento, local e tipo de cuidador.
        </Notice>
      </div>
    </StepLayout>
  );
}

export function CadastroStep2() {
  const { navigate } = useRouter();
  const { updateProfile } = useAssistidos();
  const { assistido, ensureAssistido } = useCurrentAssistido();
  const [genero, setGenero] = useState(assistido?.genero || '');
  const [mobilidade, setMobilidade] = useState(assistido?.mobilidade === 'Pendente' ? '' : assistido?.mobilidade || '');
  const [alimentacao, setAlimentacao] = useState(assistido?.alimentacao || '');
  const [error, setError] = useState('');

  const values = [genero, mobilidade, alimentacao];

  const savePartialAndExit = () => {
    const current = ensureAssistido();
    if (!current) return;
    updateProfile(current.id, { genero, mobilidade, alimentacao }, { nextStep: hasRequired(values) ? 3 : 2 });
    navigate(ROUTES.PERFIS, { mensagem: 'Dados salvos. Você pode continuar o cadastro depois.' });
  };

  const save = () => {
    const current = ensureAssistido();
    if (!current) return;
    if (!hasRequired(values)) {
      setError('Preencha todos os campos obrigatórios para avançar.');
      return;
    }
    updateProfile(current.id, { genero, mobilidade, alimentacao }, { nextStep: 3 });
    navigate(ROUTES.CADASTRO_STEP_3, { assistidoId: current.id });
  };

  return (
    <StepLayout
      step={2}
      onNext={save}
      backRoute={ROUTES.PERFIS}
      secondaryAction={<Button variant="outline" onClick={savePartialAndExit}>Salvar e sair</Button>}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Informações de Saúde do Assistido</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <Notice variant="warning">{error}</Notice>}
        <Select label="Gênero do Assistido" required value={genero} onChange={e => { setGenero(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Masculino', label: 'Masculino' }, { value: 'Feminino', label: 'Feminino' }, { value: 'Outro', label: 'Outro' }]}
        />
        <Select label="Deambulação do Assistido" required value={mobilidade} onChange={e => { setMobilidade(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Independente', label: 'Deambula independentemente' }, { value: 'Com ajuda', label: 'Deambula com ajuda' }, { value: 'Cadeira de rodas', label: 'Cadeira de rodas' }, { value: 'Acamado', label: 'Acamado' }]}
        />
        <Select label="Alimentação do Assistido" required value={alimentacao} onChange={e => { setAlimentacao(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Alimentação oral normal', label: 'Alimentação oral normal' }, { value: 'Dieta pastosa', label: 'Dieta pastosa' }, { value: 'Alimentação por sonda', label: 'Alimentação por sonda' }, { value: 'Dieta líquida', label: 'Dieta líquida' }]}
        />
      </div>
    </StepLayout>
  );
}

export function CadastroStep3() {
  const { navigate } = useRouter();
  const { updateProfile } = useAssistidos();
  const { assistido, ensureAssistido } = useCurrentAssistido();
  const [generoCuidador, setGeneroCuidador] = useState(assistido?.generoCuidador || '');
  const [frequencia, setFrequencia] = useState(assistido?.frequencia || '');
  const [turno, setTurno] = useState(assistido?.turno || '');
  const [error, setError] = useState('');
  const values = [generoCuidador, frequencia, turno];

  const savePartialAndExit = () => {
    const current = ensureAssistido();
    if (!current) return;
    updateProfile(current.id, { generoCuidador, frequencia, turno }, { nextStep: hasRequired(values) ? 4 : 3 });
    navigate(ROUTES.PERFIS, { mensagem: 'Preferências salvas. Você pode continuar o cadastro depois.' });
  };

  const save = () => {
    const current = ensureAssistido();
    if (!current) return;
    if (!hasRequired(values)) {
      setError('Preencha todos os campos obrigatórios para avançar.');
      return;
    }
    updateProfile(current.id, { generoCuidador, frequencia, turno }, { nextStep: 4 });
    navigate(ROUTES.CADASTRO_STEP_4, { assistidoId: current.id });
  };

  return (
    <StepLayout
      step={3}
      onNext={save}
      backRoute={ROUTES.CADASTRO_STEP_2}
      backParams={{ assistidoId: assistido?.id }}
      secondaryAction={<Button variant="outline" onClick={savePartialAndExit}>Salvar e sair</Button>}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Preferências de Cuidador</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <Notice variant="warning">{error}</Notice>}
        <Select label="Gênero do Cuidador Preferido" required value={generoCuidador} onChange={e => { setGeneroCuidador(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Indiferente', label: 'Indiferente' }, { value: 'Masculino', label: 'Masculino' }, { value: 'Feminino', label: 'Feminino' }]}
        />
        <Select label="Frequência de Assistência" required value={frequencia} onChange={e => { setFrequencia(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Diária', label: 'Diária' }, { value: 'Semanal', label: 'Semanal' }, { value: 'Quinzenal', label: 'Quinzenal' }, { value: 'Mensal', label: 'Mensal' }]}
        />
        <Select label="Turno de Atendimento" required value={turno} onChange={e => { setTurno(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Manhã', label: 'Manhã (06h–14h)' }, { value: 'Tarde', label: 'Tarde (14h–22h)' }, { value: 'Noite', label: 'Noite (22h–06h)' }, { value: 'Integral', label: 'Integral (24h)' }]}
        />
      </div>
    </StepLayout>
  );
}

export function CadastroStep4() {
  const { navigate } = useRouter();
  const { updateProfile } = useAssistidos();
  const { assistido, ensureAssistido } = useCurrentAssistido();
  const [interditado, setInterditado] = useState(assistido?.interditado || '');
  const [local, setLocal] = useState(assistido?.local || '');
  const [error, setError] = useState('');
  const values = [interditado, local];

  const savePartialAndExit = () => {
    const current = ensureAssistido();
    if (!current) return;
    updateProfile(current.id, { interditado, local }, { nextStep: hasRequired(values) ? 5 : 4 });
    navigate(ROUTES.PERFIS, { mensagem: 'Local e condições salvos. Você pode continuar o cadastro depois.' });
  };

  const save = () => {
    const current = ensureAssistido();
    if (!current) return;
    if (!hasRequired(values)) {
      setError('Preencha todos os campos obrigatórios para avançar.');
      return;
    }
    updateProfile(current.id, { interditado, local }, { nextStep: 5 });
    navigate(ROUTES.CADASTRO_STEP_5, { assistidoId: current.id });
  };

  return (
    <StepLayout
      step={4}
      onNext={save}
      backRoute={ROUTES.CADASTRO_STEP_3}
      backParams={{ assistidoId: assistido?.id }}
      secondaryAction={<Button variant="outline" onClick={savePartialAndExit}>Salvar e sair</Button>}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Local e Condições de Prestação</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <Notice variant="warning">{error}</Notice>}
        <RadioGroup
          label="Assistido está interditado judicialmente?"
          required
          value={interditado}
          onChange={(value) => { setInterditado(value); setError(''); }}
          options={[{ value: 'Sim', label: 'Sim' }, { value: 'Não', label: 'Não' }]}
        />
        <Select label="Local de Prestação de Serviço" required value={local} onChange={e => { setLocal(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Residência do assistido', label: 'Residência do assistido' }, { value: 'Hospital', label: 'Hospital' }, { value: 'Clínica / Casa de repouso', label: 'Clínica / Casa de repouso' }, { value: 'Outro', label: 'Outro' }]}
        />
      </div>
    </StepLayout>
  );
}

export function CadastroStep5() {
  const { navigate } = useRouter();
  const { updateProfile } = useAssistidos();
  const { assistido, ensureAssistido } = useCurrentAssistido();
  const [estadoSaude, setEstadoSaude] = useState(assistido?.estadoSaude || '');
  const [condicao, setCondicao] = useState(assistido?.condicao === 'Pendente' ? '' : assistido?.condicao || '');
  const [tipoCuidador, setTipoCuidador] = useState(assistido?.tipoCuidador || '');
  const [observacoes, setObservacoes] = useState(assistido?.observacoes?.startsWith('Cadastro iniciado') ? '' : assistido?.observacoes || '');
  const [error, setError] = useState('');
  const values = [estadoSaude, condicao, tipoCuidador];

  const savePartialAndExit = () => {
    const current = ensureAssistido();
    if (!current) return;
    updateProfile(current.id, {
      estadoSaude,
      condicao,
      tipoCuidador,
      observacoes: observacoes || current.observacoes,
    }, { nextStep: 5 });
    navigate(ROUTES.PERFIS, { mensagem: 'Informações salvas. Finalize o cadastro antes de solicitar cuidador.' });
  };

  const save = () => {
    const current = ensureAssistido();
    if (!current) return;
    if (!hasRequired(values)) {
      setError('Preencha estado de saúde, condição e tipo de cuidador para finalizar.');
      return;
    }
    updateProfile(current.id, {
      estadoSaude,
      condicao,
      tipoCuidador,
      observacoes: observacoes || 'Sem observações adicionais.',
      etapaAtual: 5,
    }, { complete: true, nextStep: 5 });
    navigate(ROUTES.PERFIS, { mensagem: 'Cadastro concluído. O perfil já pode solicitar cuidador.' });
  };

  return (
    <StepLayout
      step={5}
      onNext={save}
      nextLabel="Finalizar Cadastro"
      backRoute={ROUTES.CADASTRO_STEP_4}
      backParams={{ assistidoId: assistido?.id }}
      secondaryAction={<Button variant="outline" onClick={savePartialAndExit}>Salvar e sair</Button>}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Informações de Saúde e Tipo de Cuidador</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <Notice variant="warning">{error}</Notice>}
        <Textarea label="Estado Geral de Saúde do Assistido" required placeholder="Descreva o estado geral de saúde do assistido..." value={estadoSaude} onChange={e => { setEstadoSaude(e.target.value); setError(''); }} rows={3} />
        <Select label="Doenças ou Condições de Saúde" required value={condicao} onChange={e => { setCondicao(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Alzheimer', label: 'Alzheimer' }, { value: 'Parkinson', label: 'Parkinson' }, { value: 'Pós-AVC', label: 'Pós-AVC' }, { value: 'Diabetes', label: 'Diabetes' }, { value: 'Hipertensão', label: 'Hipertensão' }, { value: 'Outro', label: 'Outro' }]}
        />
        <Select label="Tipo de Cuidador Necessário" required value={tipoCuidador} onChange={e => { setTipoCuidador(e.target.value); setError(''); }}
          options={[{ value: '', label: 'Selecione...' }, { value: 'Técnico de Enfermagem', label: 'Técnico de Enfermagem' }, { value: 'Auxiliar de Enfermagem', label: 'Auxiliar de Enfermagem' }, { value: 'Cuidador de Idosos', label: 'Cuidador de Idosos' }, { value: 'Fisioterapeuta', label: 'Fisioterapeuta' }]}
        />
        <Textarea label="Observações Gerais (opcional)" placeholder="Informações adicionais: medicações, rotinas específicas, restrições..." value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={3} />
      </div>
    </StepLayout>
  );
}
