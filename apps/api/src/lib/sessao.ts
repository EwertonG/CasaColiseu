import jwt from 'jsonwebtoken';
import type { CookieOptions } from 'express';
import { env } from '../env';

export const COOKIE_SESSAO = 'cc_sessao';

const duracaoMs = env.SESSAO_DIAS * 24 * 60 * 60 * 1000;

export const opcoesCookie: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  path: '/',
};

export function criarToken(usuarioId: string): string {
  return jwt.sign({}, env.JWT_SECRET, { subject: usuarioId, expiresIn: `${env.SESSAO_DIAS}d` });
}

/** Devolve o id do usuário do token, ou null se o token for inválido/expirado. */
export function lerToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return typeof payload === 'object' && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}

export const maxAgeCookie = duracaoMs;
