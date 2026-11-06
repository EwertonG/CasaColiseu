import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';
import { Field, estiloCampo } from './Field';

type InputProps = ComponentProps<'input'> & {
  id: string;
  label?: string;
  erro?: string;
};

export function Input({ id, label, erro, className, ...props }: InputProps) {
  return (
    <Field id={id} label={label} erro={erro}>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={cn(estiloCampo, className)}
        {...props}
      />
    </Field>
  );
}
