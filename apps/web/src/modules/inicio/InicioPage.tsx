import { useSessao } from '../auth/useSessao';

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export function InicioPage() {
  const { usuario } = useSessao();
  const hoje = formatoData.format(new Date());

  return (
    <header>
      <h1 className="text-5xl">Olá, {usuario?.nome.split(' ')[0]}.</h1>
      <p className="mt-2 text-lg text-texto-suave first-letter:uppercase">{hoje}</p>
    </header>
  );
}
