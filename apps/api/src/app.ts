import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { APP_NAME } from '@casacoliseu/shared';
import { env } from './env';
import { prisma } from './lib/prisma';
import { authRoutes } from './modules/auth/auth.routes';
import { rotaNaoEncontrada, tratarErros } from './middlewares/erros';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', async (_req, res) => {
    let db = 'ok';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'fora do ar';
    }
    res.json({ status: 'ok', app: APP_NAME, db });
  });

  app.use('/auth', authRoutes);

  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  return app;
}
