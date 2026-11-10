import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error';

export const rotaNaoEncontrada: RequestHandler = (_req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
};

export const tratarErros: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      erro: 'Dados inválidos.',
      campos: err.issues.map((i) => ({ campo: i.path.join('.'), mensagem: i.message })),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ erro: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ erro: 'Erro interno. Tente novamente.' });
};
