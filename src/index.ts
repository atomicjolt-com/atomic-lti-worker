import type { Context } from 'hono';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { etag } from 'hono/etag';
import {
  handleInit,
  handleJwks,
  handleRedirect,
  handleLaunch,
  handleDynamicRegistrationInit,
  handleDynamicRegistrationFinish,
  handleNamesAndRoles,
  handleSignDeepLink,
} from '@atomicjolt/lti-endpoints';
import metafile from '../public/dist/metafile.json';
import { dynamicRegistrationHtml } from './html/dynamic_registration_html';
import {
  getToolConfiguration
} from './config';
import {
  LTI_INIT_PATH,
  LTI_REDIRECT_PATH,
  LTI_LAUNCH_PATH,
  LTI_JWKS_PATH,
  LTI_REGISTRATION_PATH,
  LTI_REGISTRATION_FINISH_PATH,
  LTI_NAMES_AND_ROLES_PATH,
  LTI_SIGN_DEEP_LINK_PATH,
} from '../definitions';
import { getToolJwt } from './tool_jwt';
import { handlePlatformResponse } from './register';
import indexHtml from './html/index_html';

// Export durable objects
export { OIDCStateDurableObject } from '@atomicjolt/lti-endpoints';


const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use('/*', etag());

app.use('/*', async (c: Context, next: Function) => {
  await next()
  c.header('x-frame-options', 'ALLOWALL');
});

app.get('/', (c) => c.html(indexHtml()));
app.get('/up', (c) => c.json({ up: true }));

const initHashedScriptName = metafile["client/app-init.ts"];
const launchhashedScriptName = metafile["client/app.ts"];

// LTI routes
app.get(LTI_JWKS_PATH, (c) => handleJwks(c));
app.post(LTI_INIT_PATH, (c) => handleInit(c, initHashedScriptName));
app.post(LTI_REDIRECT_PATH, (c) => handleRedirect(c));
app.post(LTI_LAUNCH_PATH, (c) => handleLaunch(c, launchhashedScriptName, getToolJwt));

// LTI Dynamic Registration routes
app.get(LTI_REGISTRATION_PATH, (c) => handleDynamicRegistrationInit(c, dynamicRegistrationHtml));
app.post(LTI_REGISTRATION_FINISH_PATH, (c) =>
  handleDynamicRegistrationFinish(c, getToolConfiguration, handlePlatformResponse)
);

// LTI services
app.get(LTI_NAMES_AND_ROLES_PATH, (c) => handleNamesAndRoles(c));
app.post(LTI_SIGN_DEEP_LINK_PATH, (c) => handleSignDeepLink(c));

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

export default app;