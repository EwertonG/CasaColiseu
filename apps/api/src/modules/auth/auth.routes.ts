import { Router } from 'express';
import { loginSchema } from '@casacoliseu/shared';
import { autenticar, paraSessao } from './auth.service';
import { COOKIE_SESSAO, criarToken, maxAgeCookie, opcoesCookie } from '../../lib/sessao';

export const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
  const { login, senha } = loginSchema.parse(req.body);
  const usuario = await autenticar(login, senha);

  res.cookie(COOKIE_SESSAO, criarToken(usuario.id), { ...opcoesCookie, maxAge: maxAgeCookie });
  res.json({ usuario: paraSessao(usuario) });
});
