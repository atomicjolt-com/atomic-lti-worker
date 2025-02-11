import type { Context } from 'hono';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono/cloudflare-pages'
import { etag } from 'hono/etag';
import { EnvBindings } from '@atomicjolt/lti-endpoints';
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
import metafile from '../../public/dist/metafile.json';
import dynamicRegistrationFinishHtml, { dynamicRegistrationHtml } from '../../server/html/dynamic_registration_html';
import {
  getToolConfiguration
} from '../../server/config';
import {
  APPLICATION_NAME,
  LTI_INIT_PATH,
  LTI_REDIRECT_PATH,
  LTI_LAUNCH_PATH,
  LTI_JWKS_PATH,
  LTI_REGISTRATION_PATH,
  LTI_REGISTRATION_FINISH_PATH,
  LTI_NAMES_AND_ROLES_PATH,
  LTI_SIGN_DEEP_LINK_PATH,
} from '../../definitions';
import { getToolJwt } from '../../server/tool_jwt';
import { handlePlatformResponse } from '../../server/register';

// Export app for testing
export const app = new Hono<{ Bindings: EnvBindings }>();

app.use('/*', etag());

app.get('/', (c) => c.text(APPLICATION_NAME));
app.get('/up', (c) => c.json({ up: true }));

const initHashedScriptName = metafile["client/app-init.ts"];
const launchhashedScriptName = metafile["client/app.ts"];

// All routes must be nested below /lti

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
