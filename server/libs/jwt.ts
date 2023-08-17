import { KVNamespace } from '@cloudflare/workers-types';
import {
  generateKeyPair,
  importSPKI,
  exportSPKI,
  exportPKCS8,
  importPKCS8,
  SignJWT,
  exportJWK,
  calculateJwkThumbprint,
  jwtVerify,
  createLocalJWKSet,
  KeyLike,
  JSONWebKeySet,
  JWTPayload,
} from 'jose';
import { IdToken } from '@atomicjolt/lti-client/src/libs/lti_definitions';

import { getJwkServer } from './platforms';
import { APP_NAME } from '../../definitions';
import type { IdTokenResult, KeySet, JWKS_RESULT } from '@atomicjolt/lti-server/src/types';
export const JWKS_KV_KEY = 'current_jwks';

export const alg = 'RS256';
const iss: string = APP_NAME;
const aud: string = APP_NAME;

export async function getCurrentKey(jwksKV: KVNamespace): Promise<KeySet> {
  const keySets = await getKeySets(jwksKV);
  const keySet = keySets[keySets.length - 1];
  return keySet;
}

export async function getCurrentPrivateKey(jwksKV: KVNamespace): Promise<KeyLike> {
  const keySet = await getCurrentKey(jwksKV);
  const pri = await importPKCS8(keySet.privateKey, alg);
  return pri;
}

export async function generateKeySet(): Promise<KeySet> {
  const { publicKey, privateKey } = await generateKeyPair(alg, { extractable: true });
  const pub = await exportSPKI(publicKey);
  const pri = await exportPKCS8(privateKey);

  return {
    publicKey: pub,
    privateKey: pri,
  };
}

export async function getKeySets(jwksKV: KVNamespace): Promise<KeySet[]> {
  let data = await jwksKV.get(JWKS_KV_KEY);
  if (data && data.length > 2) { // 2 in case jwks is '{}'
    return JSON.parse(data);
  } else {
    const keySet = await generateKeySet();
    await jwksKV.put(JWKS_KV_KEY, JSON.stringify([keySet]));
    return [keySet];
  }
}

export async function rotateKeys(jwksKV: KVNamespace): Promise<KeySet[]> {
  const keySets = await getKeySets(jwksKV);
  const keySet = await generateKeySet();
  keySets.push(keySet);

  // Remove oldest keys
  while (keySets.length > 3) {
    keySets.shift();
  }

  await jwksKV.put(JWKS_KV_KEY, JSON.stringify(keySets));
  return keySets;
}

export async function keySetsToJwks(keySets: KeySet[]): Promise<JSONWebKeySet> {
  const jwks = await Promise.all(keySets.map(async (ks) => {
    const pub = await importSPKI(ks.publicKey, alg, { extractable: true });
    const publicJwk = await exportJWK(pub);
    const kid = await calculateJwkThumbprint(publicJwk);
    return {
      ...publicJwk,
      kid,
      use: 'sig',
      alg,
    };
  }));

  const result: JSONWebKeySet = {
    keys: jwks,
  };

  return result;
}

export async function getJwks(jwksKV: KVNamespace): Promise<JSONWebKeySet> {
  const keySets = await getKeySets(jwksKV);
  return keySetsToJwks(keySets);
}

export async function fetchRemoteJwks(jwksUrl: string): Promise<JWKS_RESULT> {
  const resp = await fetch(jwksUrl);
  if (resp.ok) {
    const jwks = await resp.json();
    return jwks as JWKS_RESULT;
  }
  throw (`Unable to retrieve JWKS from ${jwksUrl}`);
}

export async function verifyRemoteJwt(remoteJwksKV: KVNamespace, jwksUrl: string, jwt: string): Promise<IdTokenResult> {
  const storedJWKS = await remoteJwksKV.get(jwksUrl);
  let jwks;

  if (storedJWKS) {
    jwks = JSON.parse(storedJWKS)
  } else {
    jwks = await fetchRemoteJwks(jwksUrl);
    await remoteJwksKV.put(jwksUrl, JSON.stringify(jwks));
  }

  const localJwks = createLocalJWKSet(jwks);
  const { payload } = await jwtVerify(jwt, localJwks);

  return {
    verified: true,
    token: payload as IdToken,
    error: null,
  };
}

export async function verifyJwtPublic(jwks: JSONWebKeySet, jwt: string): Promise<IdTokenResult> {
  const localJwks = createLocalJWKSet(jwks);
  try {
    const { payload } = await jwtVerify(jwt, localJwks);
    return {
      verified: true,
      token: payload as IdToken,
      error: null,
    };
  } catch (e) {
    const error = (e as Error).toString();
    return {
      verified: false,
      token: null,
      error,
    };
  }
}

export async function signJwtPrivate(privateKey: KeyLike, payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(privateKey)

  return jwt;
}

const jwtKeyName = 'jwt_secret_key';
export async function getJwtSecretKey(jwtKeyKV: KVNamespace): Promise<string> {
  let key = await jwtKeyKV.get(jwtKeyName);
  if (!key) {
    key = crypto.randomUUID();
    await jwtKeyKV.put(jwtKeyName, key);
  }
  return key;
}

export async function signJwt(payload: JWTPayload, secretKey: string, expiresIn: string = '10m'): Promise<string> {
  const secret = new TextEncoder().encode(secretKey);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(iss)
    .setAudience(aud)
    .setExpirationTime(expiresIn)
    .sign(secret)

  return jwt;
}

export async function verifyJwt(jwt: string, secretKey: string): Promise<JWTPayload> {
  const secret = new TextEncoder().encode(secretKey);

  const { payload } = await jwtVerify(jwt, secret, {
    issuer: iss,
    audience: aud,
  });

  return payload;
}

export async function validateIdToken(idToken: string, jwks_kv: KVNamespace): Promise<IdTokenResult> {
  try {
    const jwksUrl = await getJwkServer(idToken);
    const idTokenResult = await verifyRemoteJwt(jwks_kv, jwksUrl, idToken);
    if (!idTokenResult.token || !idTokenResult.verified) {
      throw new Error('Invalid tool launch. Please launch the application again.');
    }
    return idTokenResult;
  } catch (error: any) {
    if (error.name === 'JWSSignatureVerificationFailed') {
      throw new Error(`Unsecured tool launch. Please launch the application again. ${error.name}: ${error.message}.`);
    }
    throw new Error(`An error occured while launching the tool. Please launch the application again. ${error.name}: ${error.message}.`);
  }
}
