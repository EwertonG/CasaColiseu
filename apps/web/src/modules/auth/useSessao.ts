import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CHAVE_SESSAO, buscarSessao, entrar, sair } from './sessao';

export function useSessao() {
  const {
    data: usuario,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: CHAVE_SESSAO,
    queryFn: buscarSessao,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    usuario: usuario ?? null,
    carregando: isPending,
    erro: isError,
    tentarDeNovo: refetch,
    ehAdmin: usuario?.perfil === 'ADMIN',
  };
}

export function useEntrar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entrar,
    onSuccess: (usuario) => queryClient.setQueryData(CHAVE_SESSAO, usuario),
  });
}

export function useSair() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sair,
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData(CHAVE_SESSAO, null);
    },
  });
}
