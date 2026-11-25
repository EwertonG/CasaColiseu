import { Router } from 'express';
import { alterarStatusSchema, criarMoradorSchema, editarMoradorSchema } from '@casacoliseu/shared';
import { requireAdmin, requireAuth, usuarioLogado } from '../../middlewares/auth';
import { alterarStatus, criarMorador, editarMorador, listarMoradores } from './moradores.service';

export const moradoresRoutes = Router();

moradoresRoutes.use(requireAuth, requireAdmin);

moradoresRoutes.get('/', async (_req, res) => {
  res.json({ moradores: await listarMoradores() });
});

moradoresRoutes.post('/', async (req, res) => {
  const dados = criarMoradorSchema.parse(req.body);
  res.status(201).json({ morador: await criarMorador(dados) });
});

moradoresRoutes.patch('/:id', async (req, res) => {
  const dados = editarMoradorSchema.parse(req.body);
  const morador = await editarMorador(req.params.id, dados, usuarioLogado(req));
  res.json({ morador });
});

moradoresRoutes.patch('/:id/status', async (req, res) => {
  const { ativo } = alterarStatusSchema.parse(req.body);
  const morador = await alterarStatus(req.params.id, ativo, usuarioLogado(req));
  res.json({ morador });
});
