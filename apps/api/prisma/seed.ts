import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import { Perfil } from '../src/generated/prisma/enums';

const SENHA_PADRAO = process.env.SEED_SENHA ?? 'coliseu123';

const moradores = [
  { nome: 'Rafael', usuario: 'rafael', perfil: Perfil.ADMIN, ativo: true },
  { nome: 'Bruno', usuario: 'bruno', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Thiago', usuario: 'thiago', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Lucas', usuario: 'lucas', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Davi', usuario: 'davi', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Pedro', usuario: 'pedro', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Caio', usuario: 'caio', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Vitor', usuario: 'vitor', perfil: Perfil.MORADOR, ativo: true },
  { nome: 'Otávio', usuario: 'otavio', perfil: Perfil.MORADOR, ativo: false },
];

async function main() {
  const senhaHash = await bcrypt.hash(SENHA_PADRAO, 10);

  for (const morador of moradores) {
    await prisma.user.upsert({
      where: { usuario: morador.usuario },
      update: { nome: morador.nome, perfil: morador.perfil, ativo: morador.ativo },
      create: { ...morador, senhaHash },
    });
  }

  console.log(`Seed concluído: ${moradores.length} moradores (senha padrão: ${SENHA_PADRAO}).`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
