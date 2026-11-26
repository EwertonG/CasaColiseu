import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router';
import { LoginPage } from './modules/auth/LoginPage';
import { RequireAdmin, RequireAuth } from './modules/auth/RotasProtegidas';
import { InicioPage } from './modules/inicio/InicioPage';
import { MoradoresPage } from './modules/moradores/MoradoresPage';
import { EmBreve } from './pages/EmBreve';
import { AppLayout } from './components/layout/AppLayout';

const Vitrine = import.meta.env.DEV
  ? lazy(() => import('./pages/Vitrine').then((m) => ({ default: m.Vitrine })))
  : null;

const rotas: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/inicio', element: <InicioPage /> },
          { path: '/contas', element: <EmBreve titulo="Contas da casa" /> },
          { path: '/maquina', element: <EmBreve titulo="Máquina de lavar" /> },
          { path: '/tarefas', element: <EmBreve titulo="Tarefas" /> },
          { path: '/compras', element: <EmBreve titulo="Compras da casa" /> },
          { path: '/documentos', element: <EmBreve titulo="Documentos" /> },
          {
            element: <RequireAdmin />,
            children: [{ path: '/moradores', element: <MoradoresPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/inicio" replace /> },
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
