import { z } from 'zod';

z.config(z.locales.ptBR());

export const APP_NAME = 'CasaColiseu';

export * from './auth';
