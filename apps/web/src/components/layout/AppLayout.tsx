import type { LucideIcon } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { cn } from '../../lib/cn';
import { iconesMenu } from '../../lib/icones';
import { useSair, useSessao } from '../../modules/auth/useSessao';
import { Logo, Marca } from '../Logo';

type ItemMenu = { rotulo: string; caminho: string; Icone: LucideIcon };

const menuPrincipal: ItemMenu[] = [
  { rotulo: 'Início', caminho: '/inicio', Icone: iconesMenu.inicio },
  { rotulo: 'Contas', caminho: '/contas', Icone: iconesMenu.contas },
  { rotulo: 'Máquina de lavar', caminho: '/maquina', Icone: iconesMenu.maquina },
  { rotulo: 'Tarefas', caminho: '/tarefas', Icone: iconesMenu.tarefas },
  { rotulo: 'Compras', caminho: '/compras', Icone: iconesMenu.compras },
  { rotulo: 'Documentos', caminho: '/documentos', Icone: iconesMenu.documentos },
];

const menuAdmin: ItemMenu[] = [
  { rotulo: 'Moradores', caminho: '/moradores', Icone: iconesMenu.moradores },
];

const rotuloPerfil = { ADMIN: 'Administrador', MORADOR: 'Morador' } as const;

export function AppLayout() {
  const { usuario, ehAdmin } = useSessao();
  const sair = useSair();
  const navigate = useNavigate();

  if (!usuario) return null;

  const fazerLogout = () =>
    sair.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) });

  return (
    <div className="min-h-dvh md:pl-[247px]">
      <aside className="fixed inset-y-0 left-0 hidden w-[247px] flex-col bg-tinta p-3 text-creme md:flex">
        <Marca className="px-2 pt-3 pb-6" />

        <nav aria-label="Menu principal" className="flex flex-1 flex-col gap-1">
          {menuPrincipal.map((item) => (
            <ItemNav key={item.caminho} {...item} />
          ))}

          {ehAdmin && (
            <>
              <p className="mt-6 mb-2 px-3 text-sm text-creme/60">Administração</p>
              {menuAdmin.map((item) => (
                <ItemNav key={item.caminho} {...item} />
              ))}
            </>
          )}
        </nav>

        <footer className="flex items-center gap-3 border-t border-creme/15 px-2 pt-4 pb-2">
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amarelo-claro text-sm font-semibold text-tinta"
          >
            {usuario.nome.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-semibold">{usuario.nome}</p>
            <p className="text-sm text-creme/60">{rotuloPerfil[usuario.perfil]}</p>
          </div>
          <BotaoSair onClick={fazerLogout} disabled={sair.isPending} />
        </footer>
      </aside>

      <header className="flex items-center justify-between bg-tinta px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <Logo tamanho={40} />
          <span className="font-serif text-2xl text-amarelo">CasaColiseu</span>
        </div>
        <BotaoSair onClick={fazerLogout} disabled={sair.isPending} />
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}

function ItemNav({ rotulo, caminho, Icone }: ItemMenu) {
  return (
    <NavLink
      to={caminho}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition',
          isActive ? 'bg-amarelo text-tinta' : 'text-creme/90 hover:bg-creme/10',
        )
      }
    >
      <Icone className="size-4" aria-hidden />
      {rotulo}
    </NavLink>
  );
}

function BotaoSair({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-semibold text-amarelo underline underline-offset-4 hover:brightness-110 disabled:opacity-60"
    >
      Sair
    </button>
  );
}
