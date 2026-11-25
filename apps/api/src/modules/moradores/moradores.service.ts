import type { Morador } from '@casacoliseu/shared';
import { prisma } from '../../lib/prisma';
import type { User } from '../../generated/prisma/client';

export function paraMorador(usuario: User): Morador {
  return {
    id: usuario.id,
    nome: usuario.nome,
    usuario: usuario.usuario,
    email: usuario.email,
    perfil: usuario.perfil,
    ativo: usuario.ativo,
  };
}

export async function listarMoradores(): Promise<Morador[]> {
  const usuarios = await prisma.user.findMany({
    orderBy: [{ ativo: 'desc' }, { perfil: 'asc' }, { nome: 'asc' }],
  });
  return usuarios.map(paraMorador);
}
