import { z } from 'zod';

// Mensagens de validação padrão em português (site e API).
z.config(z.locales.ptBR());

export const APP_NAME = 'CasaColiseu';

export * from './auth';
