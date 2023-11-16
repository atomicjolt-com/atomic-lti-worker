import type { Context } from 'hono';
import type { ToolConfiguration } from '@atomicjolt/lti-types';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono/cloudflare-pages'
import { etag } from 'hono/etag';
import { EnvBindings } from '@atomicjolt/lti-endpoints/types';
import {
  handleInit, handleJwks, handleRedirect, handleLaunch,
  handleDynamicRegistrationInit,
  handleDynamicRegistrationFinish,
} from '@atomicjolt/lti-endpoints';
import metafile from '../../public/dist/metafile.json';
import { dynamicRegistrationHtml } from '../../server/html/dynamic_registration_html';
import {
  initPath,
  redirectPath,
  launchPath, jwksPath, registrationPath,
  registrationFinishPath,
  getToolConfiguration
} from '../../server/tool_configuration';

// Export app for testing
export const app = new Hono<{ Bindings: EnvBindings }>();

app.use('/*', etag());

app.get('/', (c) => c.text('Atomic LTI'));
app.get('/up', (c) => c.json({ up: true }));

const initHashedScriptName = metafile["client/app-init.ts"];
const launchhashedScriptName = metafile["client/app.ts"];

// LTI routes
app.get(jwksPath, (c) => handleJwks(c));
app.post(initPath, (c) => handleInit(c, initHashedScriptName));
app.post(redirectPath, (c) => handleRedirect(c));
app.post(launchPath, (c) => handleLaunch(c, launchhashedScriptName));

// LTI Dyanmic Registration routes
const handlePlatformResponse = (config: ToolConfiguration) => { };
app.get(registrationPath, (c) => handleDynamicRegistrationInit(c, dynamicRegistrationHtml));
app.post(registrationFinishPath, (c) => handleDynamicRegistrationFinish(c, getToolConfiguration, handlePlatformResponse));

// app.onError((err, c) => {
//   console.error(`${err}`);
//   return c.text(err.toString());
// });

// Error handling
app.onError((err, c) => {
  console.error('handling on error', err);
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  console.error(`${err}`)
  return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));

app.use('/*', async (c: Context, next: Function) => {
  await next()
  c.header('x-frame-options', 'ALLOWALL');
});

export const onRequest = handle(app);
