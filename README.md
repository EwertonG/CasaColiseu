# CasaColiseu

[![CI](https://github.com/EwertonG/CasaColiseu/actions/workflows/ci.yml/badge.svg)](https://github.com/EwertonG/CasaColiseu/actions/workflows/ci.yml)

Sistema de gestão da **República Coliseu**: contas da casa com divisão automática, escala da máquina de lavar, tarefas, compras, documentos e moradores — além de uma página pública para quem quer conhecer a república.

## Estrutura

```
apps/
  web/      # Front-end (React + Vite + TypeScript)
  api/      # Back-end (Node + Express + TypeScript)
packages/
  shared/   # Tipos e validações compartilhados
```

## Módulos

Cada módulo do sistema tem uma pasta na API e outra no site:

| Módulo           | API                                                                  | Site                                                                 |
| ---------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Login            | [`apps/api/src/modules/auth`](apps/api/src/modules/auth)             | [`apps/web/src/modules/auth`](apps/web/src/modules/auth)             |
| Início           | —                                                                    | [`apps/web/src/modules/inicio`](apps/web/src/modules/inicio)         |
| Moradores        | [`apps/api/src/modules/moradores`](apps/api/src/modules/moradores)   | [`apps/web/src/modules/moradores`](apps/web/src/modules/moradores)   |
| Contas           | [`apps/api/src/modules/contas`](apps/api/src/modules/contas)         | [`apps/web/src/modules/contas`](apps/web/src/modules/contas)         |
| Máquina de lavar | [`apps/api/src/modules/maquina`](apps/api/src/modules/maquina)       | [`apps/web/src/modules/maquina`](apps/web/src/modules/maquina)       |
| Tarefas          | [`apps/api/src/modules/tarefas`](apps/api/src/modules/tarefas)       | [`apps/web/src/modules/tarefas`](apps/web/src/modules/tarefas)       |
| Compras          | [`apps/api/src/modules/compras`](apps/api/src/modules/compras)       | [`apps/web/src/modules/compras`](apps/web/src/modules/compras)       |
| Documentos       | [`apps/api/src/modules/documentos`](apps/api/src/modules/documentos) | [`apps/web/src/modules/documentos`](apps/web/src/modules/documentos) |
| Página pública   | —                                                                    | [`apps/web/src/modules/publico`](apps/web/src/modules/publico)       |

Código comum aos dois lados (validações e tipos) fica em [`packages/shared`](packages/shared).

## Como rodar

Pré-requisitos: Node.js 20+ e npm 10+.

```bash
npm install
npm run dev      # sobe web (http://localhost:5173) e api (http://localhost:3333)
```

Outros scripts:

| Script           | O que faz                        |
| ---------------- | -------------------------------- |
| `npm run build`  | Gera o build de todos os pacotes |
| `npm run lint`   | Verifica o código com ESLint     |
| `npm run format` | Formata o código com Prettier    |

## Banco de dados

O Postgres roda em Docker, na porta **5433** (para não conflitar com outro Postgres local).

```bash
npm run db:up      # sobe o banco
npm run db:down    # derruba o banco (os dados ficam no volume)
npm run db:migrate # aplica as migrations
npm run db:seed    # cria o administrador inicial
npm run db:studio  # abre o Prisma Studio para ver os dados
```

Primeira vez:

```bash
cp apps/api/.env.example apps/api/.env
npm install
npm run db:up
npm run db:migrate
npm run db:seed
```

No `apps/api/.env`, gere um `JWT_SECRET` (o comando está no `.env.example`). Antes do `db:seed`, preencha `ADMIN_NOME`, `ADMIN_USUARIO`, `ADMIN_SENHA` (e opcionalmente `ADMIN_EMAIL`) no `apps/api/.env`. O seed cria só esse administrador; os demais moradores são cadastrados por ele pelo sistema.

## Testes

```bash
npm run db:up
npm test
```

Os testes da API usam um banco separado (`casacoliseu_test`), criado automaticamente na primeira execução. Cada teste apaga os dados que criou; o banco principal nunca é usado.
