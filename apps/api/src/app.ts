import express from 'express';
import cors from 'cors';
import { APP_NAME } from '@casacoliseu/shared';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173', credentials: true }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', app: APP_NAME });
  });

  return app;
}
