import { createApp } from './app';
import { env } from './env';

createApp().listen(env.PORT, () => {
  console.log(`API rodando em http://localhost:${env.PORT}`);
});
