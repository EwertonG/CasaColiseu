import { z } from 'zod';

export const PERFIS = ['ADMIN', 'MORADOR'] as const;
export type Perfil = (typeof PERFIS)[number];

export const loginSchema = z.object({
  login: z
    .string({ error: 'Informe seu usuário ou e-mail.' })
    .trim()
    .min(1, 'Informe seu usuário ou e-mail.'),
  senha: z.string({ error: 'Informe sua senha.' }).min(1, 'Informe sua senha.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Dados do usuário logado que a API devolve para o site. */
export type UsuarioSessao = {
  id: string;
  nome: string;
  usuario: string;
  email: string | null;
  perfil: Perfil;
};
