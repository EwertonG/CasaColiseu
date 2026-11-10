# Como contribuir

Guia rápido para qualquer integrante trabalhar no CasaColiseu. Para instalar e rodar o projeto, siga os **Primeiros passos** do [README](README.md).

## Fluxo de trabalho

1. **Atualize a `main`** antes de começar:

   ```bash
   git switch main
   git pull
   ```

2. **Crie uma branch** a partir dela. Uma branch por tarefa:

   ```bash
   git switch -c feat/nome-curto-da-tarefa
   ```

   | Prefixo  | Quando usar                            | Exemplo                   |
   | -------- | -------------------------------------- | ------------------------- |
   | `feat/`  | Funcionalidade nova                    | `feat/moradores-api`      |
   | `fix/`   | Correção de erro                       | `fix/login-maiusculas`    |
   | `chore/` | Configuração, ferramentas, organização | `chore/ci-e-contribuicao` |
   | `docs/`  | Só documentação                        | `docs/readme-setup`       |

3. **Faça commits pequenos**, um assunto por commit (veja o padrão abaixo).

4. **Antes de abrir o PR**, rode:

   ```bash
   npm run lint
   npm run format    # corrige a formatação
   npm run typecheck
   npm test
   ```

   E confira no navegador (`npm run dev`) se o que você fez funciona.

5. **Envie a branch e abra o pull request** para a `main`:

   ```bash
   git push -u origin feat/nome-curto-da-tarefa
   ```

   No GitHub, abra o PR, escreva o que mudou e como testar, e **peça revisão a outro integrante**.

6. **Depois da aprovação e com o CI verde**, faça o merge e apague a branch.

## Padrão de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/), **em português** e **só com a linha de título**:

```
tipo(escopo): o que foi feito
```

- **Tipos:** `feat` (funcionalidade), `fix` (correção), `test` (testes), `docs` (documentação), `chore` (configuração/organização), `ci` (integração contínua), `refactor` (reorganização sem mudar comportamento).
- **Escopos:** `api`, `web`, `shared` (ou nenhum, se mexer em tudo).

Exemplos:

```
feat(api): POST /moradores com senha inicial
fix(web): botão link sem espaçamento lateral
test(api): testes das rotas de auth
```

## Regras da `main`

A `main` é protegida:

- Ninguém faz push direto nela. Toda mudança entra por **pull request**.
- Todo PR precisa de **1 aprovação de outro integrante**. O autor não pode aprovar o próprio PR.
- O **CI precisa estar verde** (lint, formatação, tipos, build e testes).
- Se entrar um commit novo depois da aprovação, o PR precisa ser revisado de novo.

## Revisando um PR

Ao revisar, confira:

- [ ] O CI está verde.
- [ ] O código faz o que o PR diz, e o nome das coisas está claro.
- [ ] Rotas novas da API usam `requireAuth` (e `requireAdmin` quando for só do administrador).
- [ ] Valores em dinheiro estão em **centavos** (inteiro), nunca com casas decimais.
- [ ] Testes novos limpam os dados que criam.
- [ ] Se possível, baixe a branch e teste:

  ```bash
  git fetch
  git switch nome-da-branch
  npm install
  npm run dev
  ```

Aprove em **Files changed → Review changes → Approve**, ou peça alterações com comentários nas linhas.

## Dados no banco

Não deixe pessoas ou registros fictícios no banco. Se criar algo para testar, apague depois. O seed cria só o administrador real, a partir do `apps/api/.env`.

## Entregas

Cada entrega ao professor ganha uma **tag anotada** no commit da `main` entregue (`etapa-2`, `etapa-3`…), criada depois do último PR aprovado e com o CI verde:

```bash
git switch main && git pull
git tag -a etapa-2 -m "Entrega da etapa 2"
git push origin etapa-2
```
