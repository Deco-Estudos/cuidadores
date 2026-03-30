import { useState } from 'react';
import { ROUTES } from '../../domain/constants/routes';
import { colors } from '../../domain/constants/tokens';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Input } from '../components/ui';

// ─── LOGIN ────────────────────────────────────────────────
export function LoginPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <AuthLayout title="Login">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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

        <Button variant="green" fullWidth size="lg" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Entrar
        </Button>

        {/* Google */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: `1px solid ${colors.border}` }} />
          <span style={{ fontSize: '12px', color: colors.muted }}>ou</span>
          <hr style={{ flex: 1, border: 'none', borderTop: `1px solid ${colors.border}` }} />
        </div>
        <Button variant="outline" fullWidth onClick={() => navigate(ROUTES.DASHBOARD)}>
          🔵 Entrar com o Google
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
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <AuthLayout title="Criar Conta" subtitle="Cadastre-se para encontrar o cuidador ideal.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Input label="Nome completo" placeholder="Digite seu nome completo" value={form.nome} onChange={set('nome')} />
        <Input label="E-mail" placeholder="Digite seu e-mail" type="email" value={form.email} onChange={set('email')} />
        <Input label="Senha" placeholder="Crie uma senha" type="password" value={form.senha} onChange={set('senha')} />
        <Input label="Confirmar senha" placeholder="Confirme sua senha" type="password" value={form.confirmar} onChange={set('confirmar')} />

        <Button variant="green" fullWidth size="lg" onClick={() => navigate(ROUTES.CADASTRO_STEP_1)}>
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
