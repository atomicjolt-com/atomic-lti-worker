import 'vite/client';
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';
import type { InitSettings, LaunchSettings } from '@atomicjolt/lti-client/types';

export type EnvBindings = {
  OIDC: KVNamespace;
  JWKS: KVNamespace;
  REMOTE_JWKS: KVNamespace;
  JWT_KEYS: KVNamespace;
  OIDC_STATE: DurableObjectNamespace;
}

export interface ResponseError {
  message: string;
}

declare global {
  function setupMiniflareIsolatedStorage(): Function;
  function getMiniflareBindings(): EnvBindings;
  interface Window {
    INIT_SETTINGS: InitSettings;
    LAUNCH_SETTINGS: LaunchSettings;
  }
}

