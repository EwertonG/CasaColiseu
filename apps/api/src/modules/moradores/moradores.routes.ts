import { Router } from 'express';
import { criarMoradorSchema } from '@casacoliseu/shared';
import { requireAdmin, requireAuth } from '../../middlewares/auth';
import { criarMorador, listarMoradores } from './moradores.service';

export const moradoresRoutes = Router();

moradoresRoutes.use(requireAuth, requireAdmin);

moradoresRoutes.get('/', async (_req, res) => {
  res.json({ moradores: await listarMoradores() });
});

moradoresRoutes.post('/', async (req, res) => {
  const dados = criarMoradorSchema.parse(req.body);
  res.status(201).json({ morador: await criarMorador(dados) });
});
