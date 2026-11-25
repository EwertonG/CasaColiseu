import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router';
import { LoginPage } from './modules/auth/LoginPage';
import { InicioPage } from './modules/inicio/InicioPage';

const Vitrine = import.meta.env.DEV
  ? lazy(() => import('./pages/Vitrine').then((m) => ({ default: m.Vitrine })))
  : null;

const rotas: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/inicio', element: <InicioPage /> },
  { path: '*', element: <Navigate to="/login" replace /> },
];

if (Vitrine) {
  rotas.unshift({
    path: '/ui',
    element: (
      <Suspense>
        <Vitrine />
      </Suspense>
    ),
  });
}

const router = createBrowserRouter(rotas);

export function App() {
  return <RouterProvider router={router} />;
}
