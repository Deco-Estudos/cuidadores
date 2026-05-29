import { useRouter } from '../../infrastructure/router/RouterContext';
import { useAuth } from '../../infrastructure/state/AuthContext';
import { ROUTES } from '../../domain/constants/routes';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage, CadastroPage, RecuperarSenhaPage } from '../pages/AuthPages';
import { DashboardPage } from '../pages/DashboardPage';
import { MeuPerfilPage } from '../pages/MeuPerfilPage';
import { PerfisPage, PerfisEmptyPage } from '../pages/PerfisPage';
import {
  CadastroStep1,
  CadastroStep2,
  CadastroStep3,
  CadastroStep4,
  CadastroStep5,
} from '../pages/cadastro-assistido/CadastroSteps';
import { ListaCuidadoresPage, PerfilCuidadorPage } from '../pages/CuidadoresPages';
import {
  ConfirmacaoSolicitacaoPage,
  MinhasSolicitacoesPage,
  DetalheSolicitacaoPage,
  AgendamentosPage,
} from '../pages/SolicitacoesPages';

const routeMap = {
  [ROUTES.LANDING]:                  LandingPage,
  [ROUTES.LOGIN]:                    LoginPage,
  [ROUTES.CADASTRO]:                 CadastroPage,
  [ROUTES.RECUPERAR_SENHA]:          RecuperarSenhaPage,
  [ROUTES.DASHBOARD]:                DashboardPage,
  [ROUTES.MEU_PERFIL]:               MeuPerfilPage,
  [ROUTES.PERFIS]:                   PerfisPage,
  [ROUTES.PERFIS_VAZIO]:             PerfisEmptyPage,
  [ROUTES.CADASTRO_STEP_1]:          CadastroStep1,
  [ROUTES.CADASTRO_STEP_2]:          CadastroStep2,
  [ROUTES.CADASTRO_STEP_3]:          CadastroStep3,
  [ROUTES.CADASTRO_STEP_4]:          CadastroStep4,
  [ROUTES.CADASTRO_STEP_5]:          CadastroStep5,
  [ROUTES.LISTA_CUIDADORES]:         ListaCuidadoresPage,
  [ROUTES.PERFIL_CUIDADOR]:          PerfilCuidadorPage,
  [ROUTES.CONFIRMACAO_SOLICITACAO]:  ConfirmacaoSolicitacaoPage,
  [ROUTES.MINHAS_SOLICITACOES]:      MinhasSolicitacoesPage,
  [ROUTES.DETALHE_SOLICITACAO]:      DetalheSolicitacaoPage,
  [ROUTES.AGENDAMENTOS]:             AgendamentosPage,
};

const publicRoutes = [
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.CADASTRO,
  ROUTES.RECUPERAR_SENHA,
];

export function AppRouter() {
  const { currentRoute } = useRouter();
  const { estaLogado } = useAuth();
  const isPublicRoute = publicRoutes.includes(currentRoute);

  if (!estaLogado && !isPublicRoute) {
    return <LoginPage />;
  }

  const Page = routeMap[currentRoute] ?? LandingPage;
  return <Page />;
}
