import type { Context } from 'hono';
import { signToolJwt, getBasicToolJwt } from '@atomicjolt/lti-endpoints';
import { IdTokenWrapper } from '@atomicjolt/lti-server';

// getToolJwt is called by the launch handler to generate a tool jwt
// Pass any information that will be required for API or other calls in the tool jwt
export async function getToolJwt(c: Context, idTokenWrapper: IdTokenWrapper): Promise<string> {
  const idToken = idTokenWrapper.rawToken;
  const jwt = await getBasicToolJwt(c, idToken);

  // Create a different jwt or modify the existing jwt here

  const signed = await signToolJwt(c.env, jwt);
  return signed;
}