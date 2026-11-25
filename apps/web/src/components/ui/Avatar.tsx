import { cn } from '../../lib/cn';

const cores = [
  'bg-[#f6dcdc] text-[#8a2f2f]',
  'bg-[#dcf0e0] text-[#2f6b3a]',
  'bg-[#e7ddf3] text-[#5b3f86]',
  'bg-[#f3ecd6] text-[#7a6420]',
  'bg-[#d9eef3] text-[#2c6573]',
  'bg-[#f6dcec] text-[#8a2f63]',
  'bg-[#e0efd8] text-[#3e6b2f]',
  'bg-[#dde0f6] text-[#3f4a8a]',
];

function corDe(texto: string) {
  let soma = 0;
  for (const letra of texto) soma = (soma * 31 + letra.charCodeAt(0)) >>> 0;
  return cores[soma % cores.length];
}

type AvatarProps = {
  nome: string;
  semente?: string;
  className?: string;
};

export function Avatar({ nome, semente, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium',
        corDe(semente ?? nome),
        className,
      )}
    >
      {nome.trim().charAt(0).toUpperCase()}
    </span>
  );
}
