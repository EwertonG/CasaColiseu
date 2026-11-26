import type { Morador } from '@casacoliseu/shared';
import { Button } from '../../components/ui';
import { useAlterarStatus } from './api';

type ConfirmarStatusProps = {
  morador: Morador;
  aoConcluir: () => void;
};

export function ConfirmarStatus({ morador, aoConcluir }: ConfirmarStatusProps) {
  const alterar = useAlterarStatus();
  const desativando = morador.ativo;

  const confirmar = () =>
    alterar.mutate({ id: morador.id, ativo: !desativando }, { onSuccess: aoConcluir });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px]">
        {desativando
          ? `${morador.nome} não vai mais conseguir entrar no sistema, deixa de entrar na divisão das contas e sai da escala da casa. Você pode reativar depois.`
          : `${morador.nome} volta a entrar no sistema com o mesmo usuário e senha, entra na divisão das contas e na escala da casa.`}
      </p>

      {alterar.error && (
        <p role="alert" className="rounded-lg bg-perigo-claro px-3 py-2 text-sm text-perigo">
          {alterar.error.message}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <Button variante="secundario" onClick={aoConcluir}>
          Cancelar
        </Button>
        <Button
          onClick={confirmar}
          disabled={alterar.isPending}
          variante={desativando ? 'perigo' : 'primario'}
        >
          {alterar.isPending ? 'Salvando...' : desativando ? 'Desativar' : 'Reativar'}
        </Button>
      </div>
    </div>
  );
}
