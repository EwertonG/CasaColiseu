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

## Primeiros passos

Pré-requisitos: [Git](https://git-scm.com/), [Node.js 24](https://nodejs.org/) (npm 10+) e [Docker Desktop](https://www.docker.com/products/docker-desktop/) aberto.

```bash
# 1. Clonar
git clone https://github.com/EwertonG/CasaColiseu.git
cd CasaColiseu

# 2. Criar o arquivo de configuração da API
cp apps/api/.env.example apps/api/.env      # PowerShell: Copy-Item apps/api/.env.example apps/api/.env

# 3. Instalar as dependências
npm install

# 4. Subir o banco e criar as tabelas
npm run db:up
npm run db:migrate

# 5. (Opcional) Criar o administrador inicial
#    Preencha ADMIN_NOME, ADMIN_USUARIO e ADMIN_SENHA no apps/api/.env antes.
npm run db:seed

# 6. Rodar
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:3333/health (deve responder `"db": "ok"`)

O `.env.example` já funciona para desenvolvimento. Para um ambiente real, gere um `JWT_SECRET` próprio (o comando está no arquivo).

Para contribuir (branches, commits e pull requests), leia o [CONTRIBUTING.md](CONTRIBUTING.md).

## Scripts

| Script               | O que faz                                                |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Sobe o site e a API juntos, recarregando ao salvar       |
| `npm run build`      | Gera o build de produção de todos os pacotes             |
| `npm test`           | Roda os testes automáticos                               |
| `npm run lint`       | Verifica o código com ESLint                             |
| `npm run typecheck`  | Verifica os tipos do TypeScript                          |
| `npm run format`     | Formata o código com Prettier                            |
| `npm run db:up`      | Sobe o Postgres no Docker                                |
| `npm run db:down`    | Derruba o Postgres (os dados ficam guardados no volume)  |
| `npm run db:migrate` | Aplica as migrations do banco                            |
| `npm run db:seed`    | Cria o administrador inicial a partir do `apps/api/.env` |
| `npm run db:studio`  | Abre o Prisma Studio para ver os dados                   |

## Banco de dados

O Postgres roda em Docker, na porta **5433** (para não conflitar com outro Postgres local). O seed cria só o administrador; os demais moradores são cadastrados por ele pelo sistema.

## Testes

```bash
npm run db:up
npm test
```

Os testes da API usam um banco separado (`casacoliseu_test`), criado automaticamente na primeira execução. Cada teste apaga os dados que criou; o banco principal nunca é usado.

## Integração contínua

A cada pull request e a cada merge na `main`, o [GitHub Actions](.github/workflows/ci.yml) roda lint, formatação, tipos, build e testes (com um Postgres temporário). Um PR só pode entrar na `main` com o CI verde e a aprovação de outro integrante.
