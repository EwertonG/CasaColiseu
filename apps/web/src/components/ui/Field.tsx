import type { ReactNode } from 'react';

type FieldProps = {
  id: string;
  label?: ReactNode;
  erro?: string;
  children: ReactNode;
};

export function Field({ id, label, erro, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-[15px] font-medium">
          {label}
        </label>
      )}
      {children}
      {erro && (
        <p id={`${id}-erro`} className="text-sm text-perigo">
          {erro}
        </p>
      )}
    </div>
  );
}

export const estiloCampo =
  'h-11 w-full rounded-lg border border-borda-forte bg-white px-3 text-[15px] text-texto ' +
  'placeholder:text-texto-suave/70 focus:border-tinta focus:outline-none ' +
  'aria-invalid:border-perigo disabled:opacity-60';
