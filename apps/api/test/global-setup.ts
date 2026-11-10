import { execSync } from 'node:child_process';
import pg from 'pg';
import { DATABASE_URL_TESTE } from '../vitest.config';

/** Cria o banco de teste (se não existir) e aplica as migrations nele. */
export default async function setup() {
  const nomeBanco = new URL(DATABASE_URL_TESTE).pathname.slice(1);

  const urlAdmin = new URL(DATABASE_URL_TESTE);
  urlAdmin.pathname = '/postgres';
  const cliente = new pg.Client({ connectionString: urlAdmin.toString() });
  await cliente.connect();
  const existe = await cliente.query('SELECT 1 FROM pg_database WHERE datname = $1', [nomeBanco]);
  if (existe.rowCount === 0) {
    await cliente.query(`CREATE DATABASE "${nomeBanco}"`);
  }
  await cliente.end();

  execSync('npx prisma migrate deploy', {
    stdio: 'ignore',
    env: { ...process.env, DATABASE_URL: DATABASE_URL_TESTE },
  });
}
