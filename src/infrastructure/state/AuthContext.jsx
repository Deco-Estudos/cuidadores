import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const USERS_KEY = 'cuidadores_usuarios_demo';
const CURRENT_USER_KEY = 'cuidadores_usuario_logado_demo';

const demoUsers = [
  {
    id: 'user_pedro',
    nome: 'Pedro',
    email: 'pedro@email.com',
    telefone: '(11) 90000-0001',
    senha: '123456',
  },
  {
    id: 'user_marcus',
    nome: 'Marcus',
    email: 'marcus@email.com',
    telefone: '(11) 90000-0002',
    senha: '123456',
  },
];

const AuthContext = createContext(null);

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function loadUsers() {
  try {
    const stored = window.localStorage.getItem(USERS_KEY);
    if (stored) return safeParse(stored, demoUsers);
    window.localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  } catch {
    // O app continua funcionando apenas em memória.
  }
  return demoUsers;
}

function loadCurrentUser() {
  try {
    return safeParse(window.localStorage.getItem(CURRENT_USER_KEY), null);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(loadUsers);
  const [usuarioLogado, setUsuarioLogado] = useState(loadCurrentUser);

  useEffect(() => {
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
    } catch {
      // O app continua funcionando em memória.
    }
  }, [usuarios]);

  useEffect(() => {
    try {
      if (usuarioLogado) {
        window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuarioLogado));
      } else {
        window.localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {
      // O app continua funcionando em memória.
    }
  }, [usuarioLogado]);

  const cadastrarUsuario = ({ nome, email, senha, telefone = '' }) => {
    const emailNormalizado = normalizeEmail(email);

    if (!nome?.trim() || !emailNormalizado || !senha) {
      return { ok: false, message: 'Preencha nome, e-mail e senha.' };
    }

    const emailJaExiste = usuarios.some((usuario) => normalizeEmail(usuario.email) === emailNormalizado);
    if (emailJaExiste) {
      return { ok: false, message: 'Este e-mail já está cadastrado.' };
    }

    const novoUsuario = {
      id: crypto?.randomUUID ? crypto.randomUUID() : `user_${Date.now()}`,
      nome: nome.trim(),
      email: emailNormalizado,
      telefone,
      senha,
    };

    setUsuarios((current) => [...current, novoUsuario]);
    setUsuarioLogado(novoUsuario);
    return { ok: true, usuario: novoUsuario };
  };

  const fazerLogin = ({ email, senha }) => {
    const emailNormalizado = normalizeEmail(email);
    const usuarioEncontrado = usuarios.find(
      (usuario) => normalizeEmail(usuario.email) === emailNormalizado && usuario.senha === senha
    );

    if (!usuarioEncontrado) {
      return { ok: false, message: 'E-mail ou senha inválidos.' };
    }

    setUsuarioLogado(usuarioEncontrado);
    return { ok: true, usuario: usuarioEncontrado };
  };

  const sair = () => {
    setUsuarioLogado(null);
  };

  const value = useMemo(() => ({
    usuarios,
    usuarioLogado,
    estaLogado: Boolean(usuarioLogado),
    cadastrarUsuario,
    fazerLogin,
    sair,
  }), [usuarios, usuarioLogado]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
