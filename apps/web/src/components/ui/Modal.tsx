import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

type ModalProps = {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: ReactNode;
  children: ReactNode;
};

export function Modal({ aberto, aoFechar, titulo, descricao, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => e.target === ref.current && aoFechar()}
      aria-labelledby="modal-titulo"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-card bg-white p-0 text-texto backdrop:bg-tinta/50"
    >
      {aberto && (
        <div className="p-6">
          <header className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id="modal-titulo" className="text-xl font-semibold">
                {titulo}
              </h2>
              {descricao && <p className="mt-1 text-sm text-texto-suave">{descricao}</p>}
            </div>
            <IconButton rotulo="Fechar" onClick={aoFechar}>
              <X />
            </IconButton>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
