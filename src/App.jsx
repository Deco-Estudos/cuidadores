import { RouterProvider } from './infrastructure/router/RouterContext';
import { AppRouter } from './presentation/router/AppRouter';
import { AuthProvider } from './infrastructure/state/AuthContext';
import { AssistidosProvider } from './infrastructure/state/AssistidosContext';

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AssistidosProvider>
          <AppRouter />
        </AssistidosProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
