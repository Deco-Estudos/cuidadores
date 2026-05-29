import { useState } from 'react';
import { colors, radius } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { useAuth } from '../../infrastructure/state/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { Button, Card, Divider, Input } from '../components/ui';

function Message({ type = 'info', children }) {
  const variants = {
    info: { background: '#EFF6FF', border: '#BFDBFE', color: colors.primary },
    success: { background: '#DCFCE7', border: '#BBF7D0', color: colors.okText },
    error: { background: '#FEF2F2', border: '#FECACA', color: colors.red },
  };
  const style = variants[type] || variants.info;

  return (
    <div style={{ background: style.background, border: `1px solid ${style.border}`, color: style.color, borderRadius: radius.md, padding: '10px 12px', fontSize: '13px', lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

export function MeuPerfilPage() {
  const { navigate } = useRouter();
  const { usuarioLogado, atualizarUsuario, alterarSenha } = useAuth();
  const [dados, setDados] = useState({
    nome: usuarioLogado?.nome || '',
    email: usuarioLogado?.email || '',
    telefone: usuarioLogado?.telefone || '',
  });
  const [senhas, setSenhas] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const setCampo = (key) => (event) => {
    setDados((current) => ({ ...current, [key]: event.target.value }));
    setProfileMessage(null);
  };

  const setCampoSenha = (key) => (event) => {
    setSenhas((current) => ({ ...current, [key]: event.target.value }));
    setPasswordMessage(null);
  };

  const salvarPerfil = () => {
    const result = atualizarUsuario(dados);
    setProfileMessage({ type: result.ok ? 'success' : 'error', text: result.ok ? 'Perfil atualizado com sucesso.' : result.message });
  };

  const salvarSenha = () => {
    const result = alterarSenha(senhas);
    setPasswordMessage({ type: result.ok ? 'success' : 'error', text: result.ok ? 'Senha alterada com sucesso.' : result.message });
    if (result.ok) setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.heading, margin: '0 0 6px' }}>Meu Perfil</h1>
          <p style={{ fontSize: '15px', color: colors.secondary, margin: 0 }}>Edite os dados usados apenas nesta demonstração frontend.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>← Voltar ao Dashboard</Button>
      </div>

      <div className="grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.heading, margin: '0 0 18px' }}>Dados pessoais</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profileMessage && <Message type={profileMessage.type}>{profileMessage.text}</Message>}
            <Input label="Nome completo" required value={dados.nome} onChange={setCampo('nome')} />
            <Input label="E-mail" required type="email" value={dados.email} onChange={setCampo('email')} />
            <Input label="Telefone" value={dados.telefone} onChange={setCampo('telefone')} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={salvarPerfil}>Salvar alterações</Button>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.heading, margin: '0 0 18px' }}>Alterar senha</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {passwordMessage && <Message type={passwordMessage.type}>{passwordMessage.text}</Message>}
              <Input label="Senha atual" type="password" value={senhas.senhaAtual} onChange={setCampoSenha('senhaAtual')} />
              <Input label="Nova senha" type="password" value={senhas.novaSenha} onChange={setCampoSenha('novaSenha')} />
              <Input label="Confirmar nova senha" type="password" value={senhas.confirmarSenha} onChange={setCampoSenha('confirmarSenha')} />
              <Button variant="outline" fullWidth onClick={salvarSenha}>Atualizar senha</Button>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.heading, margin: '0 0 12px' }}>Conta demo</h2>
            <p style={{ fontSize: '13px', color: colors.secondary, lineHeight: 1.6, margin: 0 }}>
              Os dados são salvos no navegador via localStorage. Não há banco, API ou backend nesta versão.
            </p>
            <Divider style={{ margin: '16px 0' }} />
            <p style={{ fontSize: '12px', color: colors.muted, lineHeight: 1.5, margin: 0 }}>
              Login demo: pedro@email.com / 123456
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
