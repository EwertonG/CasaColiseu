import { z } from 'zod';
import { PERFIS, type Perfil } from './auth';

const nome = z
  .string({ error: 'Informe o nome.' })
  .trim()
  .min(2, 'O nome precisa ter pelo menos 2 letras.')
  .max(60, 'O nome pode ter no máximo 60 caracteres.');

const usuario = z
  .string({ error: 'Informe o usuário.' })
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9._-]{3,30}$/,
    'Use de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou _.',
  );

const email = z
  .union([z.literal(''), z.email('E-mail inválido.').trim().toLowerCase()])
  .nullish()
  .transform((valor) => valor || null);

const senha = z
  .string({ error: 'Informe a senha inicial.' })
  .min(6, 'A senha precisa ter pelo menos 6 caracteres.')
  .max(72, 'A senha pode ter no máximo 72 caracteres.');

const perfil = z.enum(PERFIS, { error: 'Perfil inválido.' });

export const criarMoradorSchema = z.object({
  nome,
  usuario,
  email,
  senha,
  perfil: perfil.default('MORADOR'),
});

export const editarMoradorSchema = z.object({
  nome,
  usuario,
  email,
  perfil,
});

export const alterarStatusSchema = z.object({
  ativo: z.boolean({ error: 'Informe se o morador está ativo.' }),
});

export type CriarMoradorInput = z.input<typeof criarMoradorSchema>;
export type EditarMoradorInput = z.input<typeof editarMoradorSchema>;

export type Morador = {
  id: string;
  nome: string;
  usuario: string;
  email: string | null;
  perfil: Perfil;
  ativo: boolean;
};
