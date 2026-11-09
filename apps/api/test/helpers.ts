import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import type { Perfil } from '../src/generated/prisma/enums';

export const SENHA_TESTE = 'senha-de-teste';
const hash = bcrypt.hashSync(SENHA_TESTE, 4);

const criados: string[] = [];

type Opcoes = { perfil?: Perfil; ativo?: boolean; email?: string };

/** Cria um usuário temporário. Apague com limparUsuarios() no afterEach. */
export async function criarUsuario({ perfil = 'MORADOR', ativo = true, email }: Opcoes = {}) {
  const sufixo = Math.random().toString(36).slice(2, 10);
  const usuario = await prisma.user.create({
    data: {
      nome: `Teste ${sufixo}`,
      usuario: `teste_${sufixo}`,
      email: email ?? null,
      senhaHash: hash,
      perfil,
      ativo,
    },
  });
  criados.push(usuario.id);
  return usuario;
}

export async function limparUsuarios() {
  if (criados.length === 0) return;
  await prisma.user.deleteMany({ where: { id: { in: criados.splice(0) } } });
}
