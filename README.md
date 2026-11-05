# CasaColiseu

Sistema de gestão da **República Coliseu**: contas da casa com divisão automática, escala da máquina de lavar, tarefas, compras, documentos e moradores — além de uma página pública para quem quer conhecer a república.

## Estrutura

```
apps/
  web/      # Front-end (React + Vite + TypeScript)
  api/      # Back-end (Node + Express + TypeScript)
packages/
  shared/   # Tipos e validações compartilhados
```

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
npm run db:up    # sobe o banco
npm run db:down  # derruba o banco (os dados ficam no volume)
```
