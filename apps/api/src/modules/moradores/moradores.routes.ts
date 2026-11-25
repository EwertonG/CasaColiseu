import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../middlewares/auth';
import { listarMoradores } from './moradores.service';

export const moradoresRoutes = Router();

moradoresRoutes.use(requireAuth, requireAdmin);

moradoresRoutes.get('/', async (_req, res) => {
  res.json({ moradores: await listarMoradores() });
});
