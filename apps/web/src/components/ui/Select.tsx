import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';
import { Field, estiloCampo } from './Field';

type SelectProps = ComponentProps<'select'> & {
  id: string;
  label?: string;
  erro?: string;
};

export function Select({ id, label, erro, className, ...props }: SelectProps) {
  return (
    <Field id={id} label={label} erro={erro}>
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={cn(estiloCampo, 'pr-8', className)}
        {...props}
      />
    </Field>
  );
}
