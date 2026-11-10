import { Router } from 'express';
import { loginSchema } from '@casacoliseu/shared';
import { autenticar, paraSessao } from './auth.service';
import { COOKIE_SESSAO, criarToken, maxAgeCookie, opcoesCookie } from '../../lib/sessao';
import { requireAuth, usuarioLogado } from '../../middlewares/auth';

export const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
  const { login, senha } = loginSchema.parse(req.body);
  const usuario = await autenticar(login, senha);

  res.cookie(COOKIE_SESSAO, criarToken(usuario.id), { ...opcoesCookie, maxAge: maxAgeCookie });
  res.json({ usuario: paraSessao(usuario) });
});

authRoutes.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_SESSAO, opcoesCookie);
  res.status(204).end();
});

authRoutes.get('/me', requireAuth, (req, res) => {
  res.json({ usuario: paraSessao(usuarioLogado(req)) });
});
