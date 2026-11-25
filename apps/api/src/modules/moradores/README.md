# Moradores (API)

Rotas só do administrador (`requireAuth` + `requireAdmin`):

- `GET /moradores`: lista (ativos primeiro)
- `POST /moradores`: cadastra com senha inicial
- `PATCH /moradores/:id`: edita nome, usuário, e-mail e perfil
- `PATCH /moradores/:id/status`: ativa ou desativa

Implementado no **Dia 6**.
