import { defineConfig } from 'vitest/config';

export const DATABASE_URL_TESTE =
  process.env.DATABASE_URL_TESTE ?? 'postgresql://coliseu:coliseu@localhost:5433/casacoliseu_test';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./test/global-setup.ts'],
    // Os testes usam o mesmo banco de teste: rodar um arquivo por vez.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: DATABASE_URL_TESTE,
      JWT_SECRET: 'segredo-so-para-testes-com-mais-de-32-caracteres',
    },
  },
});
