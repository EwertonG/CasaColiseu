import bcrypt from 'bcryptjs';
import type { UsuarioSessao } from '@casacoliseu/shared';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../lib/http-error';
import type { User } from '../../generated/prisma/client';

// Hash usado quando o login não existe, para a resposta demorar o mesmo tempo
// e não revelar quais usuários existem.
const HASH_FALSO = bcrypt.hashSync('senha-que-nao-existe', 10);

export function paraSessao(usuario: User): UsuarioSessao {
  return {
    id: usuario.id,
    nome: usuario.nome,
    usuario: usuario.usuario,
    email: usuario.email,
    perfil: usuario.perfil,
  };
}

export async function autenticar(login: string, senha: string): Promise<User> {
  const termo = login.trim().toLowerCase();
  const usuario = await prisma.user.findFirst({
    where: {
      OR: [{ usuario: termo }, { email: { equals: termo, mode: 'insensitive' } }],
    },
  });

  const senhaOk = await bcrypt.compare(senha, usuario?.senhaHash ?? HASH_FALSO);
  if (!usuario || !senhaOk) {
    throw new HttpError(401, 'Usuário ou senha incorretos.');
  }

  if (!usuario.ativo) {
    throw new HttpError(403, 'Seu acesso está desativado. Fale com o administrador da república.');
  }

  return usuario;
}
