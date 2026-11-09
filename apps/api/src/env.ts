import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL não definida'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET precisa ter pelo menos 32 caracteres'),
  SESSAO_DIAS: z.coerce.number().int().positive().default(7),
});

const resultado = schema.safeParse(process.env);

if (!resultado.success) {
  const problemas = resultado.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`);
  throw new Error(`Variáveis de ambiente inválidas:\n${problemas.join('\n')}`);
}

export const env = resultado.data;
