import * as jose from 'jose';
import type { Platform } from '@atomicjolt/lti/src/types';

import { PLATFORMS } from '../../definitions';

export async function getJwkServer(jwt: string): Promise<string> {
  const decoded = jose.decodeJwt(jwt);
  const iss = decoded?.iss;
  if (!iss) {
    throw new Error('LTI token is missing required field iss.');
  }
  const platform = PLATFORMS[iss];
  if (!platform) {
    throw new Error(`Unable to resolve platform information for iss: ${iss}`);
  }
  return platform.jwksUrl;
}

export function getPlatformOIDCUrl(iss: string): string {
  // Use the iss to get the platform OIDC
  const platform: Platform = PLATFORMS[iss];
  return platform.oidcUrl;
}

