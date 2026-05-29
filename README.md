# Cuidadores de Idosos — Frontend

Web-app em React/Vite para simular o fluxo de uma plataforma de cuidadores de idosos.

Esta versão é **100% frontend**: não usa banco, API, backend, autenticação real, envio de e-mail ou OAuth. Os dados de demonstração ficam no `localStorage` do navegador e podem ser apagados limpando os dados do site.

## Como rodar

```bash
npm install
npm run dev
npm run build
```

Acesse em desenvolvimento: http://localhost:3000

## Login demo

```txt
E-mail: pedro@email.com
Senha: 123456
```

Também existe o usuário `marcus@email.com` com a mesma senha.

## O que foi ajustado

- Login, cadastro e edição de perfil funcionando somente no navegador.
- Recuperação de senha transformada em simulação, sem promessa de envio real de e-mail.
- Cadastro de assistido com validação por etapa, salvamento parcial e retomada posterior.
- Perfis incompletos bloqueiam solicitação até o cadastro ser finalizado.
- Filtros de cuidadores agora funcionam por gênero, turno e especialidade.
- Solicitação de cuidador agora cria um registro local em `localStorage`.
- Tela de detalhes de solicitação adicionada.
- Cancelamento e aprovação demo de solicitações adicionados.
- Agendamentos agora são gerados a partir de solicitações aprovadas.
- Dashboard usa os dados locais reais do usuário logado, não apenas mocks fixos.
- Página “Meu Perfil” adicionada para editar dados da conta demo.

## Estrutura principal

```txt
src/
├── domain/
│   ├── constants/
│   │   ├── routes.js
│   │   └── tokens.js
│   └── entities/
├── infrastructure/
│   ├── data/
│   │   ├── mockCuidadores.js
│   │   └── mockSolicitacoes.js
│   ├── router/
│   │   └── RouterContext.jsx
│   └── state/
│       ├── AuthContext.jsx
│       ├── AssistidosContext.jsx
│       └── SolicitacoesContext.jsx
└── presentation/
    ├── components/
    ├── layouts/
    ├── pages/
    │   ├── AuthPages.jsx
    │   ├── CuidadoresPages.jsx
    │   ├── DashboardPage.jsx
    │   ├── LandingPage.jsx
    │   ├── MeuPerfilPage.jsx
    │   ├── PerfisPage.jsx
    │   ├── SolicitacoesPages.jsx
    │   └── cadastro-assistido/
    └── router/
        └── AppRouter.jsx
```

## Fluxo de telas

```txt
Landing
  ├── Login → Dashboard
  ├── Cadastro de usuário → Cadastro do assistido etapa 1
  └── Recuperar senha simulada → Login

Dashboard
  ├── Nova Solicitação → Perfis de Assistidos
  ├── Minhas Solicitações → Detalhe da Solicitação
  ├── Perfis de Assistidos
  ├── Agendamentos
  └── Meu Perfil

Perfis de Assistidos
  ├── Criar rascunho do assistido
  ├── Salvar e continuar depois
  ├── Completar cadastro
  └── Solicitar cuidador → Lista de Cuidadores → Perfil do Cuidador → Confirmar Solicitação

Solicitações
  ├── Criar solicitação pendente
  ├── Ver detalhes
  ├── Cancelar solicitação
  └── Simular aprovação → Gera agendamento
```

## Observações técnicas

- Navegação feita por `RouterContext`, sem `react-router`.
- Estado global simples com Context API.
- Persistência local em `localStorage`:
  - `cuidadores_usuarios_demo`
  - `cuidadores_usuario_logado_demo`
  - `cuidadores_assistidos_demo`
  - `cuidadores_solicitacoes_demo`
- Build validado com `npm run build`.
