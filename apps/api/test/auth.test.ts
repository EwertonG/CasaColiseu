import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { requireAdmin, requireAuth } from '../src/middlewares/auth';
import { tratarErros } from '../src/middlewares/erros';
import { COOKIE_SESSAO } from '../src/lib/sessao';
import { SENHA_TESTE, criarUsuario, limparUsuarios } from './helpers';

const app = createApp();

function logar(login: string, senha = SENHA_TESTE) {
  return request(app).post('/auth/login').send({ login, senha });
}

function cookiesDe(res: request.Response): string[] {
  const valor = res.headers['set-cookie'] as string[] | string | undefined;
  if (!valor) return [];
  return Array.isArray(valor) ? valor : [valor];
}

function cookieSessao(res: request.Response): string {
  const sessao = cookiesDe(res).find((c) => c.startsWith(`${COOKIE_SESSAO}=`));
  if (!sessao) throw new Error('Resposta sem cookie de sessão');
  return sessao.split(';')[0];
}

afterEach(limparUsuarios);
afterAll(() => prisma.$disconnect());

describe('POST /auth/login', () => {
  it('entra com o usuário e devolve o cookie httpOnly', async () => {
    const usuario = await criarUsuario();
    const res = await logar(usuario.usuario);

    expect(res.status).toBe(200);
    expect(res.body.usuario).toMatchObject({ id: usuario.id, perfil: 'MORADOR' });
    expect(res.body.usuario).not.toHaveProperty('senhaHash');
    expect(cookiesDe(res).join(';')).toMatch(/HttpOnly/i);
  });

  it('aceita e-mail e ignora maiúsculas', async () => {
    const usuario = await criarUsuario({ email: `pessoa.${Date.now()}@exemplo.com` });
    const res = await logar(usuario.email!.toUpperCase());

    expect(res.status).toBe(200);
    expect(res.body.usuario.id).toBe(usuario.id);
  });

  it('recusa senha errada com mensagem genérica', async () => {
    const usuario = await criarUsuario();
    const res = await logar(usuario.usuario, 'errada');

    expect(res.status).toBe(401);
    expect(res.body.erro).toBe('Usuário ou senha incorretos.');
    expect(cookiesDe(res)).toHaveLength(0);
  });

  it('recusa usuário que não existe com a mesma mensagem', async () => {
    const res = await logar('ninguem_aqui');

    expect(res.status).toBe(401);
    expect(res.body.erro).toBe('Usuário ou senha incorretos.');
  });

  it('valida campos vazios', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body.campos).toEqual(
      expect.arrayContaining([
        { campo: 'login', mensagem: 'Informe seu usuário ou e-mail.' },
        { campo: 'senha', mensagem: 'Informe sua senha.' },
      ]),
    );
  });

  it('bloqueia morador inativo', async () => {
    const usuario = await criarUsuario({ ativo: false });
    const res = await logar(usuario.usuario);

    expect(res.status).toBe(403);
    expect(cookiesDe(res)).toHaveLength(0);
  });
});

describe('GET /auth/me e POST /auth/logout', () => {
  it('devolve o usuário logado', async () => {
    const usuario = await criarUsuario();
    const cookie = cookieSessao(await logar(usuario.usuario));

    const res = await request(app).get('/auth/me').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.usuario.id).toBe(usuario.id);
  });

  it('exige login', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('recusa token inválido', async () => {
    const res = await request(app).get('/auth/me').set('Cookie', `${COOKIE_SESSAO}=falso`);
    expect(res.status).toBe(401);
  });

  it('derruba a sessão de quem foi desativado', async () => {
    const usuario = await criarUsuario();
    const cookie = cookieSessao(await logar(usuario.usuario));
    await prisma.user.update({ where: { id: usuario.id }, data: { ativo: false } });

    const res = await request(app).get('/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(401);
  });

  it('logout apaga o cookie', async () => {
    const res = await request(app).post('/auth/logout');

    expect(res.status).toBe(204);
    expect(cookiesDe(res)[0]).toMatch(new RegExp(`^${COOKIE_SESSAO}=;`));
  });
});

describe('requireAdmin', () => {
  const appAdmin = express()
    .use(cookieParser())
    .get('/so-admin', requireAuth, requireAdmin, (_req, res) => {
      res.json({ ok: true });
    })
    .use(tratarErros);

  it('deixa o administrador passar', async () => {
    const admin = await criarUsuario({ perfil: 'ADMIN' });
    const cookie = cookieSessao(await logar(admin.usuario));

    const res = await request(appAdmin).get('/so-admin').set('Cookie', cookie);
    expect(res.status).toBe(200);
  });

  it('barra o morador comum', async () => {
    const morador = await criarUsuario();
    const cookie = cookieSessao(await logar(morador.usuario));

    const res = await request(appAdmin).get('/so-admin').set('Cookie', cookie);
    expect(res.status).toBe(403);
  });

  it('barra quem não está logado', async () => {
    const res = await request(appAdmin).get('/so-admin');
    expect(res.status).toBe(401);
  });
});
