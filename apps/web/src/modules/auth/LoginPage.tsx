import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { loginSchema, type LoginInput } from '@casacoliseu/shared';
import { Button, Input } from '../../components/ui';
import { Logo } from '../../components/Logo';
import { useEntrar, useSessao } from './useSessao';

type EstadoRota = { de?: string } | null;

export function LoginPage() {
  const { usuario } = useSessao();
  const entrar = useEntrar();
  const navigate = useNavigate();
  const destino = (useLocation().state as EstadoRota)?.de ?? '/inicio';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  if (usuario) return <Navigate to={destino} replace />;

  const enviar = handleSubmit((dados) =>
    entrar.mutate(dados, { onSuccess: () => navigate(destino, { replace: true }) }),
  );

  return (
    <main className="flex min-h-dvh items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-[875px] overflow-hidden rounded-card border border-borda bg-white md:grid-cols-2">
        <section className="flex flex-col justify-between gap-10 bg-tinta p-8 md:min-h-[455px] md:p-10">
          <Logo tamanho={96} className="size-16 md:size-24" />
          <div>
            <p className="font-serif text-5xl text-amarelo">CasaColiseu</p>
            <p className="mt-3 max-w-xs text-[15px] text-creme/70">
              Contas, escala da máquina, tarefas e compras da república em um só lugar.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 md:p-10">
          <h1 className="font-sans text-3xl font-semibold">Entrar</h1>
          <p className="mt-1 text-texto-suave">Use o acesso que a república criou para você.</p>

          <form onSubmit={enviar} noValidate className="mt-6 flex flex-col gap-5">
            <Input
              id="login"
              label="Usuário ou e-mail"
              placeholder="ex.: bruno"
              autoComplete="username"
              autoCapitalize="none"
              erro={errors.login?.message}
              {...register('login')}
            />
            <Input
              id="senha"
              label="Senha"
              type="password"
              placeholder="Sua senha"
              autoComplete="current-password"
              erro={errors.senha?.message}
              {...register('senha')}
            />

            {entrar.error && (
              <p role="alert" className="rounded-lg bg-perigo-claro px-3 py-2 text-sm text-perigo">
                {entrar.error.message}
              </p>
            )}

            <Button type="submit" larguraTotal disabled={entrar.isPending}>
              {entrar.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
