# Cuidadores de Idosos — Frontend

Web-app para que idosos possam encontrar cuidadores baseado em suas necessidades.

## 🚀 Como rodar

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

Acesse: http://localhost:3000

---

## 🗂️ Estrutura do projeto (Clean Architecture)

```
src/
├── domain/                         # Regras de negócio (sem dependências externas)
│   ├── constants/
│   │   ├── routes.js               # Constantes de rotas
│   │   └── tokens.js               # Design tokens (cores, espaçamentos, sombras)
│   └── entities/
│       └── index.js                # Entidades de domínio (User, Assistido, Cuidador...)
│
├── infrastructure/                 # Camada de infraestrutura
│   ├── data/
│   │   ├── mockCuidadores.js       # Mock data de cuidadores e assistidos
│   │   └── mockSolicitacoes.js     # Mock data de solicitações e agendamentos
│   └── router/
│       └── RouterContext.jsx       # Context de navegação (sem react-router)
│
└── presentation/                   # Camada de apresentação (UI)
    ├── components/
    │   ├── ui/
    │   │   └── index.jsx           # Componentes base: Button, Input, Badge, Card, Modal...
    │   ├── Header.jsx              # Header e SubHeader
    │   ├── HeartLogo.jsx           # Ícone de coração (logo)
    │   └── ProgressBar.jsx         # Barra de progresso multi-step
    ├── layouts/
    │   ├── AppLayout.jsx           # Layout para telas autenticadas
    │   └── AuthLayout.jsx          # Layout para telas modais (login style)
    ├── pages/
    │   ├── LandingPage.jsx         # Tela inicial (landing)
    │   ├── AuthPages.jsx           # Login, Cadastro, Recuperar Senha
    │   ├── DashboardPage.jsx       # Dashboard principal
    │   ├── PerfisPage.jsx          # Perfis de Assistidos + Estado vazio + Modal exclusão
    │   ├── CuidadoresPages.jsx     # Lista de Cuidadores + Perfil do Cuidador
    │   ├── SolicitacoesPages.jsx   # Confirmação, Minhas Solicitações, Agendamentos
    │   └── cadastro-assistido/
    │       └── CadastroSteps.jsx   # Etapas 1-5 do cadastro multi-step
    └── router/
        └── AppRouter.jsx           # Mapeamento rota → componente
```

## 🗺️ Fluxo de telas

```
Landing Page
  └── Login → Dashboard
  └── Cadastro → Etapa 1 → 2 → 3 → 4 → 5 → Perfis
  └── Recuperar Senha → Login

Dashboard
  ├── Nova Solicitação → Perfis
  ├── Minhas Solicitações
  ├── Cuidadores → Lista de Cuidadores
  └── Agendamentos

Perfis de Assistidos
  ├── [Estado vazio] → Cadastro Etapa 1
  ├── [Modal] Excluir Perfil
  └── Solicitar Cuidador → Lista de Cuidadores
                              └── Perfil do Cuidador
                                    └── Confirmação de Solicitação → Dashboard
```

## 🎨 Design System

Todos os tokens de design estão centralizados em `src/domain/constants/tokens.js`:

- **Cor primária:** `#155DFC → #4F39F6` (gradiente 150°)
- **CTA Verde:** `#13E124` com borda preta (telas de auth)
- **Fontes:** Inter 400/500/600/700
- **Radius:** 8px (inputs/botões), 16px (cards), 9999px (badges)

## 📦 Tecnologias

- **React 18** com Hooks
- **Vite** como bundler
- **CSS-in-JS** via `style` props (zero dependências de estilo)
- **Sem react-router** — navegação via Context próprio
