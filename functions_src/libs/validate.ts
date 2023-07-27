import type { Context } from 'hono';
import type { OIDCState, IdTokenResult } from '@atomicjolt/lti/src/types';

import { validateIdToken } from './jwt';
import { ALLOWED_LAUNCH_TIME } from '../../definitions';
import { getOIDC } from '../models/oidc';

export async function validateNonce(oidcState: OIDCState, idTokenResult: IdTokenResult) {
  // Check the nonce and make sure the state is not older than 10 minutes
  const datetime = new Date(oidcState.datetime);
  const tenMinutesAgo = new Date().getTime() - ALLOWED_LAUNCH_TIME;
  const expired = datetime.getTime() < tenMinutesAgo;
  if (expired) {
    throw new Error('Allowed time has expired. Please launch the application again.');
  }

  const nonce = idTokenResult.token?.nonce;
  if (nonce && nonce !== oidcState.nonce) {
    throw new Error('Duplicate LTI launch. Please launch the application again.');
  }
}

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
  console.log('idTokenResult is valid')
  validateNonce(oidcState, idTokenResult);
  console.log('nonce is valid')
  return idTokenResult;
}
