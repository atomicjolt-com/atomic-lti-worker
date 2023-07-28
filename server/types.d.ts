import 'vite/client';
import { KVNamespace } from '@cloudflare/workers-types';

export type EnvBindings = {
  OIDC: KVNamespace;
  JWKS: KVNamespace;
  REMOTE_JWKS: KVNamespace;
  JWT_KEYS: KVNamespace;
  // OIDC_STATE: DurableObjectNamespace;
}

export interface ResponseError {
  message: string;
}

declare global {
  function setupMiniflareIsolatedStorage(): Function;
  function getMiniflareBindings(): EnvBindings;
}

