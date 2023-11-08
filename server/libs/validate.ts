import type { Context } from 'hono';
import type { IdTokenResult } from '@atomicjolt/lti-server/types';
import { validateNonce } from '@atomicjolt/lti-server';
import { validateIdToken } from './jwt';
import { getOIDC } from '../models/oidc';

export async function validateRequest(
  c: Context,
  state: string,
  idToken: string
): Promise<IdTokenResult> {

  if (!state) {
    throw new Error('Missing state. Please launch the application again.');
  }

  const idTokenResult = await validateIdToken(idToken, c.env.REMOTE_JWKS);
  const oidcState = await getOIDC(c, state);
  if (state !== oidcState.state) {
    throw new Error('Incorrect LTI state. Please launch the application again.');
  }
  validateNonce(oidcState, idTokenResult);
  return idTokenResult;
}
