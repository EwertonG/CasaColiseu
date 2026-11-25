import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CriarMoradorInput, EditarMoradorInput, Morador } from '@casacoliseu/shared';
import { api } from '../../lib/api';

const CHAVE = ['moradores'] as const;

export function useMoradores() {
  return useQuery({
    queryKey: CHAVE,
    queryFn: async () => (await api<{ moradores: Morador[] }>('/moradores')).moradores,
  });
}

function useAtualizarLista() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: CHAVE });
}

export function useCriarMorador() {
  const atualizar = useAtualizarLista();
  return useMutation({
    mutationFn: (dados: CriarMoradorInput) =>
      api<{ morador: Morador }>('/moradores', { method: 'POST', body: dados }),
    onSuccess: atualizar,
  });
}

export function useEditarMorador() {
  const atualizar = useAtualizarLista();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: EditarMoradorInput }) =>
      api<{ morador: Morador }>(`/moradores/${id}`, { method: 'PATCH', body: dados }),
    onSuccess: atualizar,
  });
}

export function useAlterarStatus() {
  const atualizar = useAtualizarLista();
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) =>
      api<{ morador: Morador }>(`/moradores/${id}/status`, { method: 'PATCH', body: { ativo } }),
    onSuccess: atualizar,
  });
}
