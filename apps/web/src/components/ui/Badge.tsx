import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

const tons = {
  neutro: 'bg-neutro-claro text-neutro',
  aviso: 'bg-aviso-claro text-aviso',
  sucesso: 'bg-sucesso-claro text-sucesso',
  perigo: 'bg-perigo-claro text-perigo',
} as const;

type BadgeProps = ComponentProps<'span'> & {
  tom?: keyof typeof tons;
};

export function Badge({ tom = 'neutro', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium whitespace-nowrap',
        tons[tom],
        className,
      )}
      {...props}
    />
  );
}
