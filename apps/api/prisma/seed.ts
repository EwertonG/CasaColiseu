import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import { Perfil } from '../src/generated/prisma/enums';

function obrigatoria(nome: string): string {
  const valor = process.env[nome]?.trim();
  if (!valor) {
    throw new Error(`Defina ${nome} no apps/api/.env para criar o administrador.`);
  }
  return valor;
}

async function main() {
  const nome = obrigatoria('ADMIN_NOME');
  const usuario = obrigatoria('ADMIN_USUARIO').toLowerCase();
  const senha = obrigatoria('ADMIN_SENHA');
  const email = process.env.ADMIN_EMAIL?.trim() || null;

  const existente = await prisma.user.findUnique({ where: { usuario } });
  if (existente) {
    console.log(`Administrador "${usuario}" já existe. Nada a fazer.`);
    return;
  }

  await prisma.user.create({
    data: {
      nome,
      usuario,
      email,
      senhaHash: await bcrypt.hash(senha, 10),
      perfil: Perfil.ADMIN,
    },
  });

  console.log(`Administrador "${usuario}" criado.`);
}

main()
  .catch((erro) => {
    console.error(erro instanceof Error ? erro.message : erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
