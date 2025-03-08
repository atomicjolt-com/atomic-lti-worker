import type { Context } from 'hono';
import { IdToken, } from '@atomicjolt/lti-types';
import { signToolJwt, getBasicToolJwt } from '@atomicjolt/lti-endpoints';

// getToolJwt is called by the launch handler to generate a tool jwt
// Pass any information that will be required for API or other calls in the tool jwt 
export async function getToolJwt(c: Context, idToken: IdToken): Promise<string> {
  const jwt = await getBasicToolJwt(c, idToken);

  // Create a different jwt or modify the existing jwt here

  const signed = await signToolJwt(c.env, jwt);
  return signed;
}