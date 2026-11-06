import express from 'express';
import cors from 'cors';
import { APP_NAME } from '@casacoliseu/shared';
import { prisma } from './lib/prisma';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173', credentials: true }));
  app.use(express.json());

  app.get('/health', async (_req, res) => {
    let db = 'ok';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'fora do ar';
    }
    res.json({ status: 'ok', app: APP_NAME, db });
  });

  return app;
}
