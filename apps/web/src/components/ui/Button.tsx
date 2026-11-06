import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

const variantes = {
  primario: 'bg-tinta text-creme hover:bg-tinta-suave',
  destaque: 'bg-amarelo text-tinta hover:brightness-95',
  secundario: 'border border-borda-forte bg-white text-texto hover:bg-creme',
  link: 'h-auto px-0 underline decoration-borda-forte underline-offset-4 hover:decoration-texto',
} as const;

const tamanhos = {
  md: 'h-11 px-5 text-[15px]',
  sm: 'h-9 px-4 text-sm',
} as const;

type ButtonProps = ComponentProps<'button'> & {
  variante?: keyof typeof variantes;
  tamanho?: keyof typeof tamanhos;
  larguraTotal?: boolean;
};

export function Button({
  variante = 'primario',
  tamanho = 'md',
  larguraTotal,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta',
        'disabled:cursor-not-allowed disabled:opacity-50',
        tamanhos[tamanho],
        variantes[variante],
        larguraTotal && 'w-full',
        className,
      )}
      {...props}
    />
  );
}
