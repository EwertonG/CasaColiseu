import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardProps = ComponentProps<'section'> & {
  escuro?: boolean;
};

export function Card({ escuro, className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-card p-5',
        escuro ? 'bg-tinta text-creme' : 'border border-borda bg-white',
        className,
      )}
      {...props}
    />
  );
}

type CardHeaderProps = {
  titulo: ReactNode;
  lateral?: ReactNode;
  className?: string;
};

export function CardHeader({ titulo, lateral, className }: CardHeaderProps) {
  return (
    <header className={cn('mb-3 flex items-baseline justify-between gap-4', className)}>
      <h2 className="text-[15px] font-semibold">{titulo}</h2>
      {lateral && <span className="text-sm opacity-70">{lateral}</span>}
    </header>
  );
}
