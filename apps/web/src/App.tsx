import { lazy, Suspense, useEffect, useState } from 'react';
import { APP_NAME } from '@casacoliseu/shared';

// Só existe em desenvolvimento: no build de produção esse import é removido.
const Vitrine = import.meta.env.DEV
  ? lazy(() => import('./pages/Vitrine').then((m) => ({ default: m.Vitrine })))
  : null;

type Health = { status: string };

export function App() {
  if (Vitrine && window.location.pathname === '/ui') {
    return (
      <Suspense>
        <Vitrine />
      </Suspense>
    );
  }

  return <Inicio />;
}

function Inicio() {
  const [api, setApi] = useState<string>('verificando...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json() as Promise<Health>)
      .then((data) => setApi(data.status))
      .catch(() => setApi('fora do ar'));
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="text-5xl">{APP_NAME}</h1>
      <p className="mt-2 text-texto-suave">API: {api}</p>
    </main>
  );
}
