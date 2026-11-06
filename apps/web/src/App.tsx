import { useEffect, useState } from 'react';
import { APP_NAME } from '@casacoliseu/shared';

type Health = { status: string };

export function App() {
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
