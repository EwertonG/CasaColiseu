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
    <main>
      <h1>{APP_NAME}</h1>
      <p>API: {api}</p>
    </main>
  );
}
