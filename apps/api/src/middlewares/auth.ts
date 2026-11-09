import type { Request, RequestHandler } from 'express';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http-error';
import { COOKIE_SESSAO, lerToken, opcoesCookie } from '../lib/sessao';
import type { User } from '../generated/prisma/client';

/**
 * Exige um usuário logado e ativo. Coloca o usuário em req.usuario.
 * Quem for desativado perde o acesso na hora, mesmo com sessão aberta.
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  const token: unknown = req.cookies?.[COOKIE_SESSAO];
  const usuarioId = typeof token === 'string' ? lerToken(token) : null;
  const usuario = usuarioId ? await prisma.user.findUnique({ where: { id: usuarioId } }) : null;

  if (!usuario || !usuario.ativo) {
    if (token) res.clearCookie(COOKIE_SESSAO, opcoesCookie);
    throw new HttpError(401, 'Faça login para continuar.');
  }

  req.usuario = usuario;
  next();
};

/** Exige perfil de administrador. Usar depois de requireAuth. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (usuarioLogado(req).perfil !== 'ADMIN') {
    throw new HttpError(403, 'Só o administrador pode fazer isso.');
  }
  next();
};

/** Usuário logado da requisição (para rotas que já passaram por requireAuth). */
export function usuarioLogado(req: Request): User {
  if (!req.usuario) throw new HttpError(401, 'Faça login para continuar.');
  return req.usuario;
}
