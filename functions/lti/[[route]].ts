import { Hono } from 'hono';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono/cloudflare-pages'
import { etag } from 'hono/etag';

import { EnvBindings } from '../../server/types';
import { jwks } from '../../server/endpoints/jwks';
import { init } from '../../server/endpoints/init';
import { redirect } from '../../server/endpoints/redirect';
import { launch } from '../../server/endpoints/launch';

// Export app for testing
export const app = new Hono<{ Bindings: EnvBindings }>().basePath('/lti')

app.use('/*', etag());

app.get('/', (c) => c.text('Atomic LTI'));
app.get('/up', (c) => c.json({ up: true }));

// LTI routes
app.route('/jwks', jwks);
app.route('/init', init);
app.route('/redirect', redirect);
app.route('/launch', launch);


// app.onError((err, c) => {
//   console.error(`${err}`);
//   return c.text(err.toString());
// });

// Error handling
app.onError((err, c) => {
  console.log('handling on error')
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  console.error(`${err}`)
  return c.text(err.toString());
})



app.notFound(c => c.text('Not found', 404));

app.use('/*', async (c: Context, next: Function) => {
  await next()
  c.header('x-frame-options', 'ALLOWALL');
});

export const onRequest = handle(app);
