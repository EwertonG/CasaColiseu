import type { ReactNode } from 'react';
import { Badge, Button, Card, CardHeader, IconButton, Input, Select } from '../components/ui';
import { Logo, Marca } from '../components/Logo';
import { iconesAcao, iconesMenu } from '../lib/icones';

const cores = [
  ['creme', 'bg-creme'],
  ['creme-escuro', 'bg-creme-escuro'],
  ['tinta', 'bg-tinta'],
  ['amarelo', 'bg-amarelo'],
  ['amarelo-claro', 'bg-amarelo-claro'],
  ['borda', 'bg-borda'],
  ['texto-suave', 'bg-texto-suave'],
  ['perigo', 'bg-perigo'],
  ['sucesso', 'bg-sucesso'],
  ['aviso', 'bg-aviso'],
] as const;

const menu = [
  { rotulo: 'Início', Icone: iconesMenu.inicio, ativo: true },
  { rotulo: 'Contas', Icone: iconesMenu.contas },
  { rotulo: 'Máquina de lavar', Icone: iconesMenu.maquina },
  { rotulo: 'Tarefas', Icone: iconesMenu.tarefas },
  { rotulo: 'Compras', Icone: iconesMenu.compras },
  { rotulo: 'Documentos', Icone: iconesMenu.documentos },
  { rotulo: 'Moradores', Icone: iconesMenu.moradores },
];

/** Página só de desenvolvimento (/ui) para conferir os componentes com os protótipos. */
export function Vitrine() {
  const {
    concluir: Concluir,
    abrir: Abrir,
    editar: Editar,
    desfazer: Desfazer,
    avisar: Avisar,
    recusar: Recusar,
    desativar: Desativar,
    ativar: Ativar,
  } = iconesAcao;

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-10">
      <header>
        <h1 className="text-5xl">Vitrine de componentes</h1>
        <p className="mt-1 text-texto-suave">
          Só aparece em desenvolvimento. Compare com os protótipos.
        </p>
      </header>

      <Secao titulo="Cores">
        <div className="flex flex-wrap gap-3">
          {cores.map(([nome, classe]) => (
            <div key={nome} className="w-28 text-sm">
              <div className={`h-14 rounded-lg border border-borda ${classe}`} />
              <p className="mt-1 text-texto-suave">{nome}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao titulo="Tipografia">
        <h1 className="text-5xl">Olá, Rafael. Uma tarefa vence hoje.</h1>
        <p className="text-lg text-texto-suave">
          Terça-feira, 3 de novembro · você tem 3 pendências e lava roupa na quinta.
        </p>
        <p className="text-3xl font-semibold">Contas da casa</p>
      </Secao>

      <Secao titulo="Logo e menu">
        <div className="flex flex-wrap items-start gap-6">
          <nav className="w-64 space-y-1 rounded-card bg-tinta p-3 text-creme">
            <Marca className="mb-4 px-2 pt-2" />
            {menu.map(({ rotulo, Icone, ativo }) => (
              <div
                key={rotulo}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium ${
                  ativo ? 'bg-amarelo text-tinta' : ''
                }`}
              >
                <Icone className="size-4" />
                {rotulo}
              </div>
            ))}
          </nav>
          <div className="flex items-end gap-4">
            <Logo tamanho={200} />
            <Logo tamanho={96} />
            <Logo tamanho={40} />
          </div>
        </div>
      </Secao>

      <Secao titulo="Botões">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Entrar</Button>
          <Button variante="destaque">Ver minhas contas</Button>
          <Button variante="secundario">Ver lista de compras</Button>
          <Button variante="link">Ver todas as tarefas</Button>
          <Button tamanho="sm">Enviar pedido de troca</Button>
          <Button disabled>Desabilitado</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton rotulo="Concluir">
            <Concluir />
          </IconButton>
          <IconButton rotulo="Concluir" variante="escuro">
            <Concluir />
          </IconButton>
          <IconButton rotulo="Abrir">
            <Abrir />
          </IconButton>
          <IconButton rotulo="Editar">
            <Editar />
          </IconButton>
          <IconButton rotulo="Desfazer">
            <Desfazer />
          </IconButton>
          <IconButton rotulo="Avisar que acabou">
            <Avisar />
          </IconButton>
          <IconButton rotulo="Recusar">
            <Recusar />
          </IconButton>
          <IconButton rotulo="Desativar morador" variante="perigo">
            <Desativar />
          </IconButton>
          <IconButton rotulo="Reativar morador">
            <Ativar />
          </IconButton>
        </div>
      </Secao>

      <Secao titulo="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge tom="perigo">Vence hoje</Badge>
          <Badge>Até 06/11</Badge>
          <Badge>A pagar R$ 481,59</Badge>
          <Badge tom="aviso">Pendente</Badge>
          <Badge tom="sucesso">Feita</Badge>
          <Badge tom="perigo">Em falta</Badge>
          <Badge>Em estoque</Badge>
          <Badge tom="aviso">Movido</Badge>
          <Badge tom="perigo">Excluído</Badge>
        </div>
      </Secao>

      <Secao titulo="Campos">
        <div className="grid max-w-xl gap-4">
          <Input id="vitrine-usuario" label="Usuário ou e-mail" placeholder="ex.: bruno" />
          <Input
            id="vitrine-senha"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            erro="Usuário ou senha incorretos."
          />
          <Select id="vitrine-troca" label="Trocar com quem?" defaultValue="seg">
            <option value="seg">Bruno · segunda, 02/11</option>
            <option value="qua">Lucas · quarta, 04/11</option>
          </Select>
        </div>
      </Secao>

      <Secao titulo="Cards">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader titulo="Suas pendências" lateral="3 em aberto" />
            <ul className="divide-y divide-borda border-t border-borda">
              <Linha titulo="Levar o lixo reciclável para fora" sub="Tarefa da casa">
                <Badge tom="perigo">Vence hoje</Badge>
                <IconButton rotulo="Concluir">
                  <Concluir />
                </IconButton>
              </Linha>
              <Linha titulo="Limpar a cozinha" sub="Tarefa da casa">
                <Badge>Até 06/11</Badge>
                <IconButton rotulo="Concluir">
                  <Concluir />
                </IconButton>
              </Linha>
            </ul>
            <Button variante="link" className="mt-4">
              Ver todas as tarefas
            </Button>
          </Card>
          <Card escuro>
            <CardHeader titulo="Seu saldo em novembro" />
            <p className="text-4xl text-amarelo">R$ 481,59</p>
            <p className="mt-2 text-sm text-creme/80">
              a pagar à república via Pix. Seu débito é R$ 575,59; você pagou R$ 94,00 em notinhas.
            </p>
            <div className="mt-4 h-1.5 rounded-full bg-creme/20">
              <div className="h-full w-1/6 rounded-full bg-amarelo" />
            </div>
            <Button variante="destaque" tamanho="sm" larguraTotal className="mt-4">
              Ver minhas contas
            </Button>
          </Card>
        </div>
      </Secao>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-borda pb-2 text-sm font-semibold tracking-wide text-texto-suave uppercase">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Linha({ titulo, sub, children }: { titulo: string; sub: string; children: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[15px] font-medium">{titulo}</p>
        <p className="text-sm text-texto-suave">{sub}</p>
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </li>
  );
}
