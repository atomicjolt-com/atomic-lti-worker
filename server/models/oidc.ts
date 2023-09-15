import type { Context } from 'hono';
import type { OIDCState } from '@atomicjolt/lti-server/types';
import { ALLOWED_LAUNCH_TIME } from '../../definitions';

export async function setOIDC(c: Context, oidcState: OIDCState) {
  // const id = c.env.OIDC_STATE.idFromName(oidcState.state);
  // const obj = c.env.OIDC_STATE.get(id);
  // const resp = await obj.fetch(c.req.url);
  await c.env.OIDC.put(
    oidcState.state,
    JSON.stringify(oidcState),
    { expirationTtl: ALLOWED_LAUNCH_TIME }
  );
}

export async function getOIDC(c: Context, state: string) {
  // const id = c.env.OIDC_STATE.idFromName(state);
  // const obj = c.env.OIDC_STATE.get(id);
  // const resp = await obj.fetch(c.req.url);
  const kvState = await c.env.OIDC.get(state);
  if (!kvState) {
    throw new Error('Missing LTI state. Please launch the application again.');
  }

  const oidcState = JSON.parse(kvState) as OIDCState;
  return oidcState;
}