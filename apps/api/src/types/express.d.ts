import type { User } from '../generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Usuário logado. Preenchido pelo middleware requireAuth. */
      usuario?: User;
    }
  }
}

export {};
