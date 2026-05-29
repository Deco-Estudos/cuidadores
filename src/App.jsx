import { RouterProvider } from './infrastructure/router/RouterContext';
import { AppRouter } from './presentation/router/AppRouter';
import { AuthProvider } from './infrastructure/state/AuthContext';
import { AssistidosProvider } from './infrastructure/state/AssistidosContext';
import { SolicitacoesProvider } from './infrastructure/state/SolicitacoesContext';

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AssistidosProvider>
          <SolicitacoesProvider>
            <AppRouter />
          </SolicitacoesProvider>
        </AssistidosProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
