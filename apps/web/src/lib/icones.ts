import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  Folder,
  House,
  ListChecks,
  LogOut,
  Pencil,
  ShoppingCart,
  Undo2,
  UserMinus,
  UserPlus,
  Users,
  WashingMachine,
  Wallet,
  X,
} from 'lucide-react';

export const iconesMenu = {
  inicio: House,
  contas: Wallet,
  maquina: WashingMachine,
  tarefas: ListChecks,
  compras: ShoppingCart,
  documentos: Folder,
  moradores: Users,
} as const;

export const iconesAcao = {
  concluir: Check,
  abrir: ChevronRight,
  editar: Pencil,
  desfazer: Undo2,
  avisar: Bell,
  recusar: X,
  desativar: UserMinus,
  ativar: UserPlus,
  arquivo: FileText,
  sair: LogOut,
} as const;
