import request from 'supertest';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { COOKIE_SESSAO } from '../src/lib/sessao';
import {
  SENHA_TESTE,
  criarUsuario,
  limparUsuarios,
  rastrearUsuario,
  sufixoAleatorio,
} from './helpers';

const app = createApp();

async function cookieDe(usuario: string, senha = SENHA_TESTE) {
  const res = await request(app).post('/auth/login').send({ login: usuario, senha });
  const valor = res.headers['set-cookie'] as string[] | string | undefined;
  const cookies = Array.isArray(valor) ? valor : valor ? [valor] : [];
  const sessao = cookies.find((c) => c.startsWith(`${COOKIE_SESSAO}=`));
  if (!sessao) throw new Error(`Login falhou para ${usuario}: ${res.status}`);
  return sessao.split(';')[0];
}

function novoMorador(extra: Record<string, unknown> = {}) {
  const sufixo = sufixoAleatorio();
  return {
    nome: `Morador ${sufixo}`,
    usuario: `morador_${sufixo}`,
    senha: 'senha-inicial',
    ...extra,
  };
}

let admin: Awaited<ReturnType<typeof criarUsuario>>;
let cookieAdmin: string;

beforeEach(async () => {
  admin = await criarUsuario({ perfil: 'ADMIN' });
  cookieAdmin = await cookieDe(admin.usuario);
});

afterEach(limparUsuarios);
afterAll(() => prisma.$disconnect());

async function cadastrar(dados: Record<string, unknown>) {
  const res = await request(app).post('/moradores').set('Cookie', cookieAdmin).send(dados);
  if (res.body.morador?.id) rastrearUsuario(res.body.morador.id);
  return res;
}

describe('permissões', () => {
  it('exige login', async () => {
    expect((await request(app).get('/moradores')).status).toBe(401);
    expect((await request(app).post('/moradores').send(novoMorador())).status).toBe(401);
  });

  it('barra morador comum em todas as rotas', async () => {
    const morador = await criarUsuario();
    const cookie = await cookieDe(morador.usuario);

    const respostas = await Promise.all([
      request(app).get('/moradores').set('Cookie', cookie),
      request(app).post('/moradores').set('Cookie', cookie).send(novoMorador()),
      request(app)
        .patch(`/moradores/${morador.id}`)
        .set('Cookie', cookie)
        .send({ nome: 'Outro', usuario: morador.usuario, perfil: 'ADMIN' }),
      request(app)
        .patch(`/moradores/${morador.id}/status`)
        .set('Cookie', cookie)
        .send({ ativo: false }),
    ]);

    expect(respostas.map((r) => r.status)).toEqual([403, 403, 403, 403]);
    const noBanco = await prisma.user.findUniqueOrThrow({ where: { id: morador.id } });
    expect(noBanco).toMatchObject({ perfil: 'MORADOR', ativo: true });
  });
});

describe('GET /moradores', () => {
  it('lista os moradores sem expor a senha', async () => {
    const morador = await criarUsuario();
    const res = await request(app).get('/moradores').set('Cookie', cookieAdmin);

    expect(res.status).toBe(200);
    const ids = res.body.moradores.map((m: { id: string }) => m.id);
    expect(ids).toEqual(expect.arrayContaining([admin.id, morador.id]));
    expect(res.body.moradores[0]).not.toHaveProperty('senhaHash');
  });

  it('mostra os ativos antes dos inativos', async () => {
    const inativo = await criarUsuario({ ativo: false });
    await criarUsuario();
    const res = await request(app).get('/moradores').set('Cookie', cookieAdmin);

    const lista: { id: string; ativo: boolean }[] = res.body.moradores;
    const primeiroInativo = lista.findIndex((m) => !m.ativo);
    expect(lista.slice(primeiroInativo).every((m) => !m.ativo)).toBe(true);
    expect(lista.some((m) => m.id === inativo.id)).toBe(true);
  });
});

describe('POST /moradores', () => {
  it('cadastra o morador e ele consegue entrar com a senha inicial', async () => {
    const email = `Pessoa.${sufixoAleatorio()}@Exemplo.com`;
    const dados = novoMorador({ email });
    const res = await cadastrar(dados);

    expect(res.status).toBe(201);
    expect(res.body.morador).toMatchObject({
      nome: dados.nome,
      usuario: dados.usuario,
      email: email.toLowerCase(),
      perfil: 'MORADOR',
      ativo: true,
    });

    const login = await request(app)
      .post('/auth/login')
      .send({ login: dados.usuario, senha: 'senha-inicial' });
    expect(login.status).toBe(200);
  });

  it('normaliza o usuário para minúsculas e aceita e-mail vazio', async () => {
    const dados = novoMorador({ email: '' });
    const res = await cadastrar({ ...dados, usuario: dados.usuario.toUpperCase() });

    expect(res.status).toBe(201);
    expect(res.body.morador.usuario).toBe(dados.usuario);
    expect(res.body.morador.email).toBeNull();
  });

  it('recusa usuário repetido', async () => {
    const existente = await criarUsuario();
    const res = await cadastrar(novoMorador({ usuario: existente.usuario }));

    expect(res.status).toBe(409);
    expect(res.body.erro).toBe('Já existe um morador com esse usuário.');
  });

  it('recusa e-mail repetido', async () => {
    const email = `repetido.${sufixoAleatorio()}@exemplo.com`;
    await criarUsuario({ email });
    const res = await cadastrar(novoMorador({ email: email.toUpperCase() }));

    expect(res.status).toBe(409);
    expect(res.body.erro).toBe('Já existe um morador com esse e-mail.');
  });

  it('valida os campos', async () => {
    const res = await cadastrar({ nome: 'A', usuario: 'com espaço', email: 'x', senha: '123' });

    expect(res.status).toBe(400);
    const campos = res.body.campos.map((c: { campo: string }) => c.campo);
    expect(campos).toEqual(expect.arrayContaining(['nome', 'usuario', 'email', 'senha']));
  });
});

describe('PATCH /moradores/:id', () => {
  it('edita nome, usuário, e-mail e perfil', async () => {
    const morador = await criarUsuario();
    const novo = { nome: 'Nome Editado', usuario: `editado_${sufixoAleatorio()}`, perfil: 'ADMIN' };
    const res = await request(app)
      .patch(`/moradores/${morador.id}`)
      .set('Cookie', cookieAdmin)
      .send(novo);

    expect(res.status).toBe(200);
    expect(res.body.morador).toMatchObject({ ...novo, email: null });
  });

  it('recusa usuário que já pertence a outra pessoa', async () => {
    const [a, b] = await Promise.all([criarUsuario(), criarUsuario()]);
    const res = await request(app)
      .patch(`/moradores/${a.id}`)
      .set('Cookie', cookieAdmin)
      .send({ nome: a.nome, usuario: b.usuario, perfil: 'MORADOR' });

    expect(res.status).toBe(409);
  });

  it('impede o administrador de tirar o próprio perfil', async () => {
    const res = await request(app)
      .patch(`/moradores/${admin.id}`)
      .set('Cookie', cookieAdmin)
      .send({ nome: admin.nome, usuario: admin.usuario, perfil: 'MORADOR' });

    expect(res.status).toBe(400);
  });

  it('responde 404 para morador inexistente', async () => {
    const res = await request(app)
      .patch('/moradores/nao-existe')
      .set('Cookie', cookieAdmin)
      .send({ nome: 'Alguém', usuario: 'alguem_x', perfil: 'MORADOR' });

    expect(res.status).toBe(404);
  });
});

describe('PATCH /moradores/:id/status', () => {
  it('desativa: o morador perde o acesso na hora e não consegue entrar', async () => {
    const morador = await criarUsuario();
    const cookieMorador = await cookieDe(morador.usuario);

    const res = await request(app)
      .patch(`/moradores/${morador.id}/status`)
      .set('Cookie', cookieAdmin)
      .send({ ativo: false });
    expect(res.status).toBe(200);
    expect(res.body.morador.ativo).toBe(false);

    expect((await request(app).get('/auth/me').set('Cookie', cookieMorador)).status).toBe(401);
    const login = await request(app)
      .post('/auth/login')
      .send({ login: morador.usuario, senha: SENHA_TESTE });
    expect(login.status).toBe(403);
  });

  it('reativa: o morador volta a entrar', async () => {
    const morador = await criarUsuario({ ativo: false });
    const res = await request(app)
      .patch(`/moradores/${morador.id}/status`)
      .set('Cookie', cookieAdmin)
      .send({ ativo: true });

    expect(res.status).toBe(200);
    await expect(cookieDe(morador.usuario)).resolves.toContain(COOKIE_SESSAO);
  });

  it('impede o administrador de desativar a si mesmo', async () => {
    const res = await request(app)
      .patch(`/moradores/${admin.id}/status`)
      .set('Cookie', cookieAdmin)
      .send({ ativo: false });

    expect(res.status).toBe(400);
  });
});
