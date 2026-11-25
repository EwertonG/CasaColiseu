import bcrypt from 'bcryptjs';
import type { criarMoradorSchema, editarMoradorSchema, Morador } from '@casacoliseu/shared';
import type { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../lib/http-error';
import type { User } from '../../generated/prisma/client';

type NovoMorador = z.output<typeof criarMoradorSchema>;
type EdicaoMorador = z.output<typeof editarMoradorSchema>;

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

export async function garantirUnico(usuario: string, email: string | null, ignorarId?: string) {
  const existente = await prisma.user.findFirst({
    where: {
      id: ignorarId ? { not: ignorarId } : undefined,
      OR: [
        { usuario },
        ...(email ? [{ email: { equals: email, mode: 'insensitive' as const } }] : []),
      ],
    },
  });
  if (!existente) return;
  if (existente.usuario === usuario) {
    throw new HttpError(409, 'Já existe um morador com esse usuário.');
  }
  throw new HttpError(409, 'Já existe um morador com esse e-mail.');
}

export async function criarMorador({ senha, ...dados }: NovoMorador): Promise<Morador> {
  await garantirUnico(dados.usuario, dados.email);
  const usuario = await prisma.user.create({
    data: { ...dados, senhaHash: await bcrypt.hash(senha, 10) },
  });
  return paraMorador(usuario);
}

export async function buscarMorador(id: string): Promise<User> {
  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) throw new HttpError(404, 'Morador não encontrado.');
  return usuario;
}

export async function editarMorador(
  id: string,
  dados: EdicaoMorador,
  quemEdita: User,
): Promise<Morador> {
  await buscarMorador(id);
  if (id === quemEdita.id && dados.perfil !== 'ADMIN') {
    throw new HttpError(400, 'Você não pode tirar o seu próprio perfil de administrador.');
  }
  await garantirUnico(dados.usuario, dados.email, id);
  const usuario = await prisma.user.update({ where: { id }, data: dados });
  return paraMorador(usuario);
}
