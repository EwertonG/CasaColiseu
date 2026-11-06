import { cn } from '../lib/cn';

type LogoProps = {
  tamanho?: number;
  className?: string;
};

export function Logo({ tamanho = 40, className }: LogoProps) {
  return (
    <img
      src={tamanho > 192 ? '/logo.png' : '/logo-192.png'}
      alt="Escudo da República Coliseu"
      width={tamanho}
      height={tamanho}
      className={cn('shrink-0 select-none', className)}
      draggable={false}
    />
  );
}

type MarcaProps = {
  subtitulo?: string;
  className?: string;
};

/** Logo + nome "CasaColiseu", como no topo da barra lateral. */
export function Marca({ subtitulo = 'República Coliseu', className }: MarcaProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Logo tamanho={40} />
      <div className="leading-tight">
        <p className="font-serif text-2xl text-amarelo">CasaColiseu</p>
        {subtitulo && <p className="text-sm text-creme/70">{subtitulo}</p>}
      </div>
    </div>
  );
}
