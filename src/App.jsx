import { RouterProvider } from './infrastructure/router/RouterContext';
import { AppRouter } from './presentation/router/AppRouter';
import { AssistidosProvider } from './infrastructure/state/AssistidosContext';

export default function App() {
  return (
    <RouterProvider>
      <AssistidosProvider>
        <AppRouter />
      </AssistidosProvider>
    </RouterProvider>
  );
}
