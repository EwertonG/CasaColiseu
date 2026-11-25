import type { LoginInput, UsuarioSessao } from '@casacoliseu/shared';
import { api, ApiError } from '../../lib/api';

export const CHAVE_SESSAO = ['sessao'] as const;

export async function buscarSessao(): Promise<UsuarioSessao | null> {
  try {
    const { usuario } = await api<{ usuario: UsuarioSessao }>('/auth/me');
    return usuario;
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 401) return null;
    throw erro;
  }
}

export async function entrar(dados: LoginInput): Promise<UsuarioSessao> {
  const { usuario } = await api<{ usuario: UsuarioSessao }>('/auth/login', {
    method: 'POST',
    body: dados,
  });
  return usuario;
}

export function sair(): Promise<void> {
  return api<void>('/auth/logout', { method: 'POST' });
}
