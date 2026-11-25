import { useState } from 'react';
import type { Morador } from '@casacoliseu/shared';
import { Avatar, Badge, Button, Card, CardHeader, IconButton, Modal } from '../../components/ui';
import { iconesAcao } from '../../lib/icones';
import { useSessao } from '../auth/useSessao';
import { useMoradores } from './api';
import { FormMorador } from './FormMorador';

type ModalAberto = { tipo: 'novo' } | { tipo: 'editar'; morador: Morador } | null;

const rotuloPerfil = { ADMIN: 'Administrador', MORADOR: 'Morador' } as const;

function plural(n: number, singular: string, pluralTexto: string) {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}

function listarNomes(nomes: string[]) {
  if (nomes.length <= 1) return nomes.join('');
  return `${nomes.slice(0, -1).join(', ')} e ${nomes.at(-1)}`;
}

export function MoradoresPage() {
  const { usuario } = useSessao();
  const { data: moradores, isPending, error, refetch } = useMoradores();
  const [modal, setModal] = useState<ModalAberto>(null);
  const fecharModal = () => setModal(null);

  const ativos = moradores?.filter((m) => m.ativo) ?? [];
  const inativos = moradores?.filter((m) => !m.ativo) ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-semibold">Moradores</h1>
          <p className="mt-1 text-texto-suave">
            {moradores
              ? `${plural(ativos.length, 'ativo', 'ativos')} e ${plural(inativos.length, 'inativo', 'inativos')} · `
              : ''}
            só o administrador vê esta tela.
          </p>
        </div>
        <Button onClick={() => setModal({ tipo: 'novo' })}>Adicionar morador</Button>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader
            titulo="Moradores da república"
            lateral={moradores && plural(moradores.length, 'pessoa', 'pessoas')}
          />

          {isPending && <p className="py-6 text-texto-suave">Carregando moradores...</p>}

          {error && (
            <div className="flex items-center gap-3 py-6 text-perigo">
              <p>{error.message}</p>
              <Button variante="secundario" tamanho="sm" onClick={() => refetch()}>
                Tentar de novo
              </Button>
            </div>
          )}

          {moradores && (
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[560px] text-left text-[15px]">
                <thead className="text-sm text-texto-suave">
                  <tr className="border-b border-borda">
                    <th className="py-2 font-normal">Nome</th>
                    <th className="py-2 font-normal">Perfil</th>
                    <th className="py-2 font-normal">Situação</th>
                    <th className="py-2 text-right font-normal">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borda">
                  {moradores.map((morador) => (
                    <LinhaMorador
                      key={morador.id}
                      morador={morador}
                      ehVoce={morador.id === usuario?.id}
                      aoEditar={() => setModal({ tipo: 'editar', morador })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader titulo="Quem entra nas contas" />
          <p className="flex items-baseline gap-2">
            <span className="text-4xl">{ativos.length}</span>
            <span className="text-texto-suave">
              {ativos.length === 1 ? 'morador ativo' : 'moradores ativos'}
            </span>
          </p>
          <p className="mt-4 text-sm text-texto-suave">
            Moradores ativos entram na divisão das contas e na escala da casa. Ao desativar alguém,
            os acessos dele deixam de funcionar.
          </p>
          {inativos.length > 0 && (
            <p className="mt-3 text-sm text-texto-suave">
              {listarNomes(inativos.map((m) => m.nome))}{' '}
              {inativos.length === 1 ? 'está inativo' : 'estão inativos'}: não{' '}
              {inativos.length === 1 ? 'entra' : 'entram'} na divisão e não{' '}
              {inativos.length === 1 ? 'aparece' : 'aparecem'} na escala.
            </p>
          )}
        </Card>
      </div>

      <Modal
        aberto={modal !== null}
        aoFechar={fecharModal}
        titulo={modal?.tipo === 'editar' ? `Editar ${modal.morador.nome}` : 'Adicionar morador'}
        descricao={
          modal?.tipo === 'novo'
            ? 'Passe o usuário e a senha inicial para a pessoa entrar no sistema.'
            : undefined
        }
      >
        {modal && (
          <FormMorador
            key={modal.tipo === 'editar' ? modal.morador.id : 'novo'}
            morador={modal.tipo === 'editar' ? modal.morador : undefined}
            ehVoce={modal.tipo === 'editar' && modal.morador.id === usuario?.id}
            aoConcluir={fecharModal}
          />
        )}
      </Modal>
    </div>
  );
}

type LinhaMoradorProps = {
  morador: Morador;
  ehVoce: boolean;
  aoEditar: () => void;
};

function LinhaMorador({ morador, ehVoce, aoEditar }: LinhaMoradorProps) {
  const { editar: Editar, desativar: Desativar, ativar: Ativar } = iconesAcao;

  return (
    <tr>
      <td className="py-3">
        <span className="flex items-center gap-3">
          <Avatar nome={morador.nome} semente={morador.id} />
          <span>
            {morador.nome}
            {ehVoce && ' (você)'}
          </span>
        </span>
      </td>
      <td className="py-3 text-texto-suave">{rotuloPerfil[morador.perfil]}</td>
      <td className="py-3 text-texto-suave">{morador.ativo ? 'Ativo' : <Badge>Inativo</Badge>}</td>
      <td className="py-3">
        <span className="flex justify-end gap-2">
          <IconButton rotulo={`Editar ${morador.nome}`} onClick={aoEditar}>
            <Editar />
          </IconButton>
          {!ehVoce &&
            (morador.ativo ? (
              <IconButton rotulo={`Desativar ${morador.nome}`} variante="perigo">
                <Desativar />
              </IconButton>
            ) : (
              <IconButton rotulo={`Reativar ${morador.nome}`}>
                <Ativar />
              </IconButton>
            ))}
        </span>
      </td>
    </tr>
  );
}
