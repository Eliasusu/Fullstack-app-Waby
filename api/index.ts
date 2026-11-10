import { env } from './shared/env.js';
import { syncSchema } from './shared/db/orm.js';
import { createApp } from './app.js';

await syncSchema();
createApp().listen(env.PORT, () => {
    console.log(`API escuchando en http://localhost:${env.PORT}/api/v1`);
});
