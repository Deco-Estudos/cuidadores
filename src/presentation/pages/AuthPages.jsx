import { useState } from 'react';
import { ROUTES } from '../../domain/constants/routes';
import { colors } from '../../domain/constants/tokens';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { useAuth } from '../../infrastructure/state/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Input } from '../components/ui';

function AlertMessage({ children }) {
  return (
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: colors.red, borderRadius: '8px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function InfoMessage({ children }) {
  return (
    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: colors.primary, borderRadius: '8px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────
export function LoginPage() {
  const { navigate } = useRouter();
  const { fazerLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const result = fazerLogin({ email, senha });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError('');
    navigate(ROUTES.DASHBOARD);
  };

  const handleDemoLogin = () => {
    const result = fazerLogin({ email: 'pedro@email.com', senha: '123456' });
    if (result.ok) navigate(ROUTES.DASHBOARD);
  };

  return (
    <AuthLayout title="Login">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {error && <AlertMessage>{error}</AlertMessage>}

        <Input label="E-mail" placeholder="Digite seu e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input label="Senha" placeholder="Digite sua senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />

        <div style={{ textAlign: 'right', marginTop: '-8px' }}>
          <button
            onClick={() => navigate(ROUTES.RECUPERAR_SENHA)}
            style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontSize: '14px' }}
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button variant="green" fullWidth size="lg" onClick={handleLogin}>
          Entrar
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: `1px solid ${colors.border}` }} />
          <span style={{ fontSize: '12px', color: colors.muted }}>ou</span>
          <hr style={{ flex: 1, border: 'none', borderTop: `1px solid ${colors.border}` }} />
        </div>
        <Button variant="outline" fullWidth onClick={handleDemoLogin}>
          Entrar com o Google
        </Button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: colors.secondary, margin: '8px 0 0' }}>
          Não tem conta?{' '}
          <button
            onClick={() => navigate(ROUTES.CADASTRO)}
            style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            Fazer cadastro
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

// ─── CADASTRO DE USUÁRIO ───────────────────────────────────
export function CadastroPage() {
  const { navigate } = useRouter();
  const { cadastrarUsuario } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '', confirmar: '' });
  const [error, setError] = useState('');
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleCadastro = () => {
    if (form.senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (form.senha !== form.confirmar) {
      setError('A confirmação de senha não confere.');
      return;
    }

    const result = cadastrarUsuario(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError('');
    navigate(ROUTES.CADASTRO_STEP_1);
  };

  return (
    <AuthLayout title="Criar Conta" subtitle="Cadastre-se para encontrar o cuidador ideal.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {error && <AlertMessage>{error}</AlertMessage>}
        <Input label="Nome completo" placeholder="Digite seu nome completo" value={form.nome} onChange={set('nome')} />
        <Input label="E-mail" placeholder="Digite seu e-mail" type="email" value={form.email} onChange={set('email')} />
        <Input label="Telefone" placeholder="Digite seu telefone" value={form.telefone} onChange={set('telefone')} />
        <Input label="Senha" placeholder="Crie uma senha" type="password" value={form.senha} onChange={set('senha')} />
        <Input label="Confirmar senha" placeholder="Confirme sua senha" type="password" value={form.confirmar} onChange={set('confirmar')} />

        <Button variant="green" fullWidth size="lg" onClick={handleCadastro}>
          Fazer Cadastro
        </Button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: colors.secondary, margin: '4px 0 0' }}>
          Já tem conta?{' '}
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            Fazer login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

// ─── RECUPERAR SENHA ───────────────────────────────────────
export function RecuperarSenhaPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <AuthLayout title="E-mail Enviado! ✉">
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: '56px', margin: '0 0 16px' }}>📬</div>
          <p style={{ fontSize: '15px', color: colors.secondary, lineHeight: 1.6, marginBottom: '24px' }}>
            Enviamos um link para <strong>{email}</strong>. Verifique sua caixa de entrada e também a pasta de spam.
          </p>
          <Button variant="outline" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
            ← Voltar ao Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Recuperar Senha"
      subtitle="Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Input label="E-mail" placeholder="Digite seu e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <Button variant="green" fullWidth size="lg" onClick={() => setSent(true)}>
          Enviar Instruções
        </Button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: colors.muted }}>
          Verifique também sua caixa de spam.
        </p>

        <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}` }} />

        <p style={{ textAlign: 'center', fontSize: '14px', color: colors.secondary, margin: 0 }}>
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontSize: '14px' }}
          >
            ← Voltar ao Login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
