import { RouterProvider } from './infrastructure/router/RouterContext';
import { AppRouter } from './presentation/router/AppRouter';

export default function App() {
  return (
    <RouterProvider>
      <AppRouter />
    </RouterProvider>
  );
}
