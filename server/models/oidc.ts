import type { Context } from 'hono';
import type { OIDCState } from '@atomicjolt/lti/src/types';
import { ALLOWED_LAUNCH_TIME } from '../../definitions';

export async function setOIDC(c: Context, state: string, oidcState: OIDCState) {
  await c.env.OIDC.put(
    state,
    JSON.stringify(oidcState),
    { expirationTtl: ALLOWED_LAUNCH_TIME }
  );
}

export async function getOIDC(c: Context, state: string) {
  const kvState = await c.env.OIDC.get(state);
  if (!kvState) {
    throw new Error('Missing LTI state. Please launch the application again.');
  }

  const oidcState = JSON.parse(kvState) as OIDCState;
  return oidcState;
}