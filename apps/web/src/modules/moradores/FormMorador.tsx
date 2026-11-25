import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  criarMoradorSchema,
  editarMoradorSchema,
  type Morador,
  type Perfil,
} from '@casacoliseu/shared';
import { Button, Input, Select } from '../../components/ui';
import { ApiError } from '../../lib/api';
import { useCriarMorador, useEditarMorador } from './api';

type Valores = {
  nome: string;
  usuario: string;
  email: string;
  senha?: string;
  perfil: Perfil;
};

type FormMoradorProps = {
  morador?: Morador;
  ehVoce?: boolean;
  aoConcluir: () => void;
};

export function FormMorador({ morador, ehVoce, aoConcluir }: FormMoradorProps) {
  const editando = Boolean(morador);
  const criar = useCriarMorador();
  const editar = useEditarMorador();
  const mutacao = editando ? editar : criar;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Valores>({
    resolver: zodResolver(editando ? editarMoradorSchema : criarMoradorSchema) as Resolver<Valores>,
    defaultValues: {
      nome: morador?.nome ?? '',
      usuario: morador?.usuario ?? '',
      email: morador?.email ?? '',
      senha: '',
      perfil: morador?.perfil ?? 'MORADOR',
    },
  });

  const mostrarErrosDaApi = (erro: Error) => {
    if (!(erro instanceof ApiError)) return;
    for (const { campo, mensagem } of erro.campos) {
      setError(campo as keyof Valores, { message: mensagem });
    }
  };

  const enviar = handleSubmit((dados) => {
    const opcoes = { onSuccess: aoConcluir, onError: mostrarErrosDaApi };
    if (morador) {
      const { nome, usuario, email, perfil } = dados;
      editar.mutate({ id: morador.id, dados: { nome, usuario, email, perfil } }, opcoes);
    } else {
      criar.mutate({ ...dados, senha: dados.senha ?? '' }, opcoes);
    }
  });

  const erroGeral =
    mutacao.error instanceof ApiError && mutacao.error.campos.length > 0
      ? null
      : mutacao.error?.message;

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <Input id="morador-nome" label="Nome" erro={errors.nome?.message} {...register('nome')} />
      <Input
        id="morador-usuario"
        label="Usuário"
        placeholder="ex.: bruno"
        autoCapitalize="none"
        autoComplete="off"
        erro={errors.usuario?.message}
        {...register('usuario')}
      />
      <Input
        id="morador-email"
        label="E-mail (opcional)"
        type="email"
        autoComplete="off"
        erro={errors.email?.message}
        {...register('email')}
      />
      {!editando && (
        <Input
          id="morador-senha"
          label="Senha inicial"
          type="password"
          autoComplete="new-password"
          erro={errors.senha?.message}
          {...register('senha')}
        />
      )}
      <Select
        id="morador-perfil"
        label="Perfil"
        erro={errors.perfil?.message}
        {...register('perfil')}
      >
        {!ehVoce && <option value="MORADOR">Morador</option>}
        <option value="ADMIN">Administrador</option>
      </Select>
      {ehVoce && (
        <p className="-mt-2 text-sm text-texto-suave">
          Você não pode tirar o seu próprio perfil de administrador.
        </p>
      )}

      {erroGeral && (
        <p role="alert" className="rounded-lg bg-perigo-claro px-3 py-2 text-sm text-perigo">
          {erroGeral}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <Button variante="secundario" onClick={aoConcluir}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutacao.isPending}>
          {mutacao.isPending ? 'Salvando...' : editando ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}
