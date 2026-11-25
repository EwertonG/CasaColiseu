import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Button } from '../../components/ui';
import { Logo } from '../../components/Logo';
import { useSessao } from './useSessao';

export function RequireAuth() {
  const { usuario, carregando, erro, tentarDeNovo } = useSessao();
  const { pathname } = useLocation();

  if (carregando) return <TelaCentral>Carregando...</TelaCentral>;

  if (erro) {
    return (
      <TelaCentral>
        <p>Não foi possível falar com o servidor.</p>
        <Button variante="secundario" tamanho="sm" onClick={() => tentarDeNovo()}>
          Tentar de novo
        </Button>
      </TelaCentral>
    );
  }

  if (!usuario) return <Navigate to="/login" replace state={{ de: pathname }} />;

  return <Outlet />;
}

export function RequireAdmin() {
  const { ehAdmin } = useSessao();
  return ehAdmin ? <Outlet /> : <Navigate to="/inicio" replace />;
}

function TelaCentral({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 text-texto-suave">
      <Logo tamanho={64} />
      {children}
    </main>
  );
}
