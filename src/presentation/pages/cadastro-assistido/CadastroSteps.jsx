import { useState } from 'react';
import { colors, radius, shadows, gradients } from '../../../domain/constants/tokens';
import { ROUTES } from '../../../domain/constants/routes';
import { useRouter } from '../../../infrastructure/router/RouterContext';
import { ProgressBar } from '../../components/ProgressBar';
import { HeartLogo } from '../../components/HeartLogo';
import { Button, Input, Select, Textarea, RadioGroup } from '../../components/ui';

function StepLayout({ step, children, onBack, onNext, nextLabel = 'Próximo →', backRoute }) {
  const { navigate } = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#FFFAFA', borderRadius: '12px', boxShadow: '6px 6px 24px rgba(0,0,0,0.18)', width: '100%', maxWidth: '680px', overflow: 'hidden' }}>
        {/* Header */}
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

        {/* Content */}
        <div style={{ padding: '24px 40px 32px' }}>
          {children}
        </div>

        {/* Navigation */}
        <div style={{ padding: '0 40px 32px', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outline" onClick={() => backRoute ? navigate(backRoute) : onBack?.()}>
            ← Voltar
          </Button>
          <Button variant="primary" onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── ETAPA 1 ────────────────────────────────────────────────
export function CadastroStep1() {
  const { navigate } = useRouter();
  const [isAssistido, setIsAssistido] = useState('');
  const [idade, setIdade] = useState('');

  return (
    <StepLayout step={1} onNext={() => navigate(ROUTES.CADASTRO_STEP_2)} backRoute={ROUTES.PERFIS}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Informações do Assistido</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <RadioGroup
          label="Você é o assistido?"
          required
          value={isAssistido}
          onChange={setIsAssistido}
          options={[{ value: 'sim', label: 'Sim, sou eu mesmo(a)' }, { value: 'nao', label: 'Não, é outra pessoa' }]}
        />
        <Input label="Idade do Assistido" placeholder="Digite a idade" required value={idade} onChange={e => setIdade(e.target.value)} />
        {isAssistido === 'nao' && (
          <Input label="Nome do Assistido" placeholder="Digite o nome completo" required />
        )}
      </div>
    </StepLayout>
  );
}

// ── ETAPA 2 ────────────────────────────────────────────────
export function CadastroStep2() {
  const { navigate } = useRouter();
  const [genero, setGenero] = useState('');
  const [deambulacao, setDeambulacao] = useState('');
  const [alimentacao, setAlimentacao] = useState('');

  return (
    <StepLayout step={2} onNext={() => navigate(ROUTES.CADASTRO_STEP_3)} backRoute={ROUTES.CADASTRO_STEP_1}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Informações de Saúde do Assistido</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Select label="Gênero do Assistido" required value={genero} onChange={e => setGenero(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }, { value: 'outro', label: 'Outro' }]}
        />
        <Select label="Deambulação do Assistido" required value={deambulacao} onChange={e => setDeambulacao(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'independente', label: 'Deambula independentemente' }, { value: 'ajuda', label: 'Deambula com ajuda' }, { value: 'cadeira', label: 'Cadeira de rodas' }, { value: 'acamado', label: 'Acamado' }]}
        />
        <Select label="Alimentação do Assistido" required value={alimentacao} onChange={e => setAlimentacao(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'oral', label: 'Alimentação oral normal' }, { value: 'pastosa', label: 'Dieta pastosa' }, { value: 'sonda', label: 'Alimentação por sonda' }, { value: 'liquida', label: 'Dieta líquida' }]}
        />
      </div>
    </StepLayout>
  );
}

// ── ETAPA 3 ────────────────────────────────────────────────
export function CadastroStep3() {
  const { navigate } = useRouter();
  const [genero, setGenero] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [turno, setTurno] = useState('');

  return (
    <StepLayout step={3} onNext={() => navigate(ROUTES.CADASTRO_STEP_4)} backRoute={ROUTES.CADASTRO_STEP_2}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Preferências de Cuidador</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Select label="Gênero do Cuidador Preferido" required value={genero} onChange={e => setGenero(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'indiferente', label: 'Indiferente' }, { value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }]}
        />
        <Select label="Frequência de Assistência" required value={frequencia} onChange={e => setFrequencia(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'diaria', label: 'Diária' }, { value: 'semanal', label: 'Semanal' }, { value: 'quinzenal', label: 'Quinzenal' }, { value: 'mensal', label: 'Mensal' }]}
        />
        <Select label="Turno de Atendimento" required value={turno} onChange={e => setTurno(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'manha', label: 'Manhã (06h–14h)' }, { value: 'tarde', label: 'Tarde (14h–22h)' }, { value: 'noite', label: 'Noite (22h–06h)' }, { value: 'integral', label: 'Integral (24h)' }]}
        />
      </div>
    </StepLayout>
  );
}

// ── ETAPA 4 ────────────────────────────────────────────────
export function CadastroStep4() {
  const { navigate } = useRouter();
  const [interditado, setInterditado] = useState('');
  const [local, setLocal] = useState('');

  return (
    <StepLayout step={4} onNext={() => navigate(ROUTES.CADASTRO_STEP_5)} backRoute={ROUTES.CADASTRO_STEP_3}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Local e Condições de Prestação</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <RadioGroup
          label="Assistido está interditado judicialmente?"
          required
          value={interditado}
          onChange={setInterditado}
          options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
        />
        <Select label="Local de Prestação de Serviço" required value={local} onChange={e => setLocal(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'residencia', label: 'Residência do assistido' }, { value: 'hospital', label: 'Hospital' }, { value: 'clinica', label: 'Clínica / Casa de repouso' }, { value: 'outro', label: 'Outro' }]}
        />
      </div>
    </StepLayout>
  );
}

// ── ETAPA 5 ────────────────────────────────────────────────
export function CadastroStep5() {
  const { navigate } = useRouter();
  const [estado, setEstado] = useState('');
  const [doencas, setDoencas] = useState('');
  const [tipoCuidador, setTipoCuidador] = useState('');
  const [obs, setObs] = useState('');

  return (
    <StepLayout step={5} onNext={() => navigate(ROUTES.PERFIS)} nextLabel="Finalizar Cadastro" backRoute={ROUTES.CADASTRO_STEP_4}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 24px' }}>Informações de Saúde e Tipo de Cuidador</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Textarea label="Estado Geral de Saúde do Assistido" required placeholder="Descreva o estado geral de saúde do assistido..." value={estado} onChange={e => setEstado(e.target.value)} rows={3} />
        <Select label="Doenças ou Condições de Saúde" required value={doencas} onChange={e => setDoencas(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'alzheimer', label: 'Alzheimer' }, { value: 'parkinson', label: 'Parkinson' }, { value: 'avc', label: 'Pós-AVC' }, { value: 'diabete', label: 'Diabetes' }, { value: 'hipertensao', label: 'Hipertensão' }, { value: 'outro', label: 'Outro' }]}
        />
        <Select label="Tipo de Cuidador Necessário" required value={tipoCuidador} onChange={e => setTipoCuidador(e.target.value)}
          options={[{ value: '', label: 'Selecione...' }, { value: 'tecnico', label: 'Técnico de Enfermagem' }, { value: 'auxiliar', label: 'Auxiliar de Enfermagem' }, { value: 'cuidador', label: 'Cuidador de Idosos' }, { value: 'fisio', label: 'Fisioterapeuta' }]}
        />
        <Textarea label="Observações Gerais (opcional)" placeholder="Informações adicionais: medicações, rotinas específicas, restrições..." value={obs} onChange={e => setObs(e.target.value)} rows={3} />
      </div>
    </StepLayout>
  );
}
