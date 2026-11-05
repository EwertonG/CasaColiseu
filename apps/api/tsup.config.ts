import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: 'esm',
  target: 'node20',
  clean: true,
  // O pacote shared é TypeScript puro: precisa entrar no bundle.
  noExternal: ['@casacoliseu/shared'],
});
