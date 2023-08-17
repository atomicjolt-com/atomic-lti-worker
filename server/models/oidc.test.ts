import { test } from 'vitest';
import { getOIDC } from './oidc';

test('getOIDC returns OIDC state', async (t) => {
  const state = 'test-state';
  const oidcState = {
    state,
    targetLinkUri: 'test-target-link-uri',
    ltiMessageHint: 'test-lti-message-hint',
    loginHint: 'test-login-hint',
    clientId: 'test-client-id',
    iss: 'test-iss',
  };
  const kvState = JSON.stringify(oidcState);
  const c = {
    env: {
      OIDC: {
        async get(key: string) {
          return kvState;
        },
      },
    },
  } as any;

  const result = await getOIDC(c, state);

  t.deepEqual(result, oidcState);
});

test('getOIDC throws error for missing OIDC state', async (t) => {
  const state = 'test-state';
  const c = {
    env: {
      OIDC: {
        async get(key: string) {
          return null;
        },
      },
    },
  } as any;

  try {
    await getOIDC(c, state);
    t.fail('Expected getOIDC to throw an error');
  } catch (err) {
    t.equal(err.message, 'Missing LTI state. Please launch the application again.');
  }
});