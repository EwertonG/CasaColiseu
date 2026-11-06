import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

const variantes = {
  contorno: 'border border-borda-forte bg-white text-texto hover:bg-creme',
  escuro: 'bg-tinta text-creme hover:bg-tinta-suave',
  perigo: 'border border-perigo/30 bg-white text-perigo hover:bg-perigo-claro',
} as const;

type IconButtonProps = ComponentProps<'button'> & {
  /** Texto lido por leitores de tela (o botão só mostra o ícone). */
  rotulo: string;
  variante?: keyof typeof variantes;
};

export function IconButton({
  rotulo,
  variante = 'contorno',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={rotulo}
      title={rotulo}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta',
        'disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4',
        variantes[variante],
        className,
      )}
      {...props}
    />
  );
}
