import type { Context, Next } from 'hono';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { etag } from 'hono/etag';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import {
  handleInit,
  handleJwks,
  handleRedirect,
  handleDynamicRegistrationInit,
  handleDynamicRegistrationFinish,
  handleNamesAndRoles,
  handleSignDeepLink,
  validateLaunchRequest,
} from '@atomicjolt/lti-endpoints';
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
import launchHtml from './html/launch_html';
import { getClientAssetPath } from './libs/manifest';

// Export durable objects
export { OIDCStateDurableObject } from '@atomicjolt/lti-endpoints';

// Define context variables type
type Variables = {
  requestId: string;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// Initialize asset paths once at startup
const homeScriptName = getClientAssetPath("client/home.ts");
const initScriptName = getClientAssetPath("client/app-init.ts");
const launchScriptName = getClientAssetPath("client/app.ts");

// Request logging middleware
app.use('/*', logger());

// ETag middleware for caching
app.use('/*', etag());

// CORS configuration for LTI services
app.use('/lti/*', cors({
  origin: '*', // LTI tools need to work across different LMS domains
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400,
  credentials: true,
}));

// Security headers middleware
app.use('/*', async (c: Context, next: Next) => {
  // Generate request ID for tracking
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);

  await next();

  // Security headers
  c.header('X-Frame-Options', 'ALLOWALL'); // Required for LTI iframe embedding
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy - adjust as needed
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for some LMS platforms
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors *" // Allow embedding in any domain for LTI
  ].join('; ');
  c.header('Content-Security-Policy', csp);
});

// Health check and monitoring endpoints
app.get('/', (c) => c.html(indexHtml(homeScriptName)));

app.get('/up', (c) => {
  const requestId = c.get('requestId') || 'unknown';
  return c.json({
    up: true,
    version: '1.3.3',
    timestamp: new Date().toISOString(),
    requestId,
  });
});

// LTI routes
app.get(LTI_JWKS_PATH, (c) => handleJwks(c));
app.post(LTI_INIT_PATH, (c) => handleInit(c, initScriptName));
app.post(LTI_REDIRECT_PATH, (c) => handleRedirect(c));

app.post(LTI_LAUNCH_PATH, async (c) => {
  // validateLaunchRequest will throw an exception if the request is invalid
  // and will return the idTokenWrapper and launchSettings
  // which allow the application to retrive values from the LTI launch
  const { launchSettings } = await validateLaunchRequest(c, getToolJwt);
  return c.html(launchHtml(launchSettings, launchScriptName));
});


// LTI Dynamic Registration routes
app.get(LTI_REGISTRATION_PATH, (c) => handleDynamicRegistrationInit(c, dynamicRegistrationHtml));
app.post(LTI_REGISTRATION_FINISH_PATH, (c) =>
  handleDynamicRegistrationFinish(c, getToolConfiguration, handlePlatformResponse)
);

// LTI services
app.get(LTI_NAMES_AND_ROLES_PATH, (c) => handleNamesAndRoles(c));
app.post(LTI_SIGN_DEEP_LINK_PATH, (c) => handleSignDeepLink(c));

// Error handling
app.onError((err: Error, c) => {
  const requestId = c.get('requestId') || 'unknown';
  const timestamp = new Date().toISOString();

  // Structured error logging
  const errorLog = {
    requestId,
    timestamp,
    method: c.req.method,
    path: c.req.path,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  };

  console.error('Request error:', JSON.stringify(errorLog));

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // Determine if it's a client or server error
  const isClientError = err.message.includes('validation') ||
    err.message.includes('invalid') ||
    err.message.includes('required');

  const statusCode = isClientError ? 400 : 500;
  const errorMessage = isClientError ? err.message : 'Internal server error';

  return c.json({
    error: errorMessage,
    requestId,
    timestamp
  }, statusCode);
});

app.notFound((c) => {
  const requestId = c.get('requestId') || 'unknown';
  return c.json({
    error: 'Not found',
    path: c.req.path,
    requestId
  }, 404);
});

export default app;