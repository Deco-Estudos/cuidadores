import { createContext, useContext, useState } from 'react';
import { ROUTES } from '../../domain/constants/routes';

const RouterContext = createContext(null);

export function RouterProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState(ROUTES.LANDING);
  const [routeParams, setRouteParams] = useState({});

  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentRoute, routeParams, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
