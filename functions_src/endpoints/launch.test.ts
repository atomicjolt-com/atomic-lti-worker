import { expect, it, describe } from 'vitest';
import {
  LTI_VERSION,
  MESSAGE_TYPE,
} from '@atomicjolt/lti/src/libs/lti_definitions';
import { OPEN_ID_COOKIE_PREFIX } from '@atomicjolt/lti/src/libs/constants';

import { app } from '../../functions/lti/[[route]]';
import { signJwtPrivate } from '../libs/jwt';
import { test_id_token, genJwt } from '../libs/jwt.test';
import { setupValidState, storeState } from '../test/state_helper';

const env = getMiniflareBindings();

describe('launch', () => {
  it('returns a 200 with verified false when state is not present', async () => {
    const { body, state } = await setupValidState(env, test_id_token);
    const req = new Request(
      'http://example.com/lti/launch',
      {
        method: 'POST',
        body: body,
      },
    );
    const resp = await app.fetch(req, env);

    const text = await resp.text();
    expect(resp.status).toBe(200);
    expect(text).toContain('"stateVerified":false');

    // Clean up
    await env.OIDC.delete(state);
  });

  it('returns a 401 when cookie is not present and lti_storage_target is empty', async () => {
    const { body, state } = await setupValidState(env, test_id_token);
    body.delete('lti_storage_target');

    const req = new Request(
      'http://example.com/lti/launch',
      {
        method: 'POST',
        body: body,
      },
    );
    const resp = await app.fetch(req, env);

    const text = await resp.text();
    expect(resp.status).toBe(401);
    expect(text).toContain('Unable to securely launch tool. Please ensure cookies are enabled');

    // Clean up
    await env.OIDC.delete(state);
  });

  it('fails when the state value in the cookie cannot be found in KV', async () => {
    const { body, state } = await setupValidState(env, test_id_token);

    // Remove state from KV for test
    await env.OIDC.delete(state);
    const req = new Request(
      'http://example.com/lti/launch',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
        },
        body: body,
      },
    );
    const resp = await app.fetch(req, env);

    expect(resp.status).toBe(401);
    const text = await resp.text();
    expect(text).toContain('Missing LTI state. Please launch the application again.');
  });

  it('fails when the state value does not exist in KV', async () => {
    const { body, state } = await setupValidState(env, test_id_token);
    body.set('state', 'fake_state');

    const req = new Request(
      'http://example.com/lti/launch',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
        },
        body: body,
      },
    );
    const resp = await app.fetch(req, env);

    expect(resp.status).toBe(401);
    const text = await resp.text();
    expect(text).toBe('Missing LTI state. Please launch the application again.');
  });

  describe('JWT tests', () => {
    const state = crypto.randomUUID();
    it('fails when the KID is not present in the JWT header', async () => {
      const body = new FormData();

      // Generate a new jwt that will have a KID not present
      // in c.env.REMOTE_JWKS
      const { signed } = await genJwt();
      body.set('id_token', signed);
      body.set('state', state);

      const req = new Request(
        'http://example.com/lti/launch',
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
          },
          body: body,
        },
      );
      const resp = await app.fetch(req, env);

      expect(resp.status).toBe(401);
      const text = await resp.text();
      expect(text).toBe('Unsecured tool launch. Please launch the application again. JWSSignatureVerificationFailed: signature verification failed.');
    });

    // Test Description: Incorrect KID passed in JWT Header
    // Test Verifies Correct KID Required in Header

    // Test Description: LTI version passed is not 1.3
    // Test Sends LTI Version that is NOT 1.3
    it('returns an invalid version message', async () => {
      const token = { ...test_id_token };
      token[LTI_VERSION] = '11.2.0';
      const body: BodyInit = new FormData();
      const { signed } = await genJwt(token);
      body.set('id_token', signed);
      body.set('state', state);

      const req = new Request(
        'http://example.com/lti/launch',
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
          },
          body: body,
        },
      );
      const resp = await app.fetch(req, env);
      const text = await resp.text();
      expect(resp.status).toBe(401);
      expect(text).toBe('Unsecured tool launch. Please launch the application again. JWSSignatureVerificationFailed: signature verification failed.');
    });

    // Test Description: No LTI Version Passed in JWT
    // Test Delivers Launch Without LTI Version
    it('returns an invalid version message when version is empty', async () => {
      const token = { ...test_id_token };
      token[LTI_VERSION] = '';
      const { state } = await setupValidState(env, test_id_token);
      const body: BodyInit = new FormData();
      const { signed } = await genJwt(token);
      body.set('id_token', signed);
      body.set('state', state);

      const req = new Request(
        'http://example.com/lti/launch',
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
          },
          body: body,
        },
      );
      const resp = await app.fetch(req, env);
      const text = await resp.text();
      expect(resp.status).toBe(401);
      expect(text).toBe('Unsecured tool launch. Please launch the application again. JWSSignatureVerificationFailed: signature verification failed.');
    });

    // Test Description: JWT Passed is Not LTI 1.3 JWT
    // Test Delivers Launch WithoutCorrect JWT
    it('fails when the id_token is not an LTI 1.3 JWT', async () => {
      const { state, body, privateKey } = await setupValidState(env, test_id_token);
      const nonce = crypto.randomUUID();
      const not_id_token = {
        'aud': 'fake',
        'azp': 'fake',
        nonce,
      }
      const signed = await signJwtPrivate(privateKey, not_id_token);
      body.set('id_token', signed);

      await storeState(env, state, nonce);

      const req = new Request(
        'http://example.com/lti/launch',
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
          },
          body: body,
        },
      );
      const resp = await app.fetch(req, env);
      const text = await resp.text();

      expect(resp.status).toBe(401);
      expect(text).toContain('An error occured while launching the tool. Please launch the application again.');

      // Clean up
      await env.OIDC.delete(state);
    });

    // Test Description: One or more JWT fields missing
    // Test Sends JWT with One or More Required Claims Missing
    // Test Description: message_type Claim Missing
    // Test Sends JWT without Required message_type
    it('fails when the LTI 1.3 JWT is missing required claims', async () => {
      const { state, body, privateKey } = await setupValidState(env, test_id_token);
      const runTest = async (field: string | number) => {
        const new_id_token = { ...test_id_token };
        delete new_id_token[field];

        const signed = await signJwtPrivate(privateKey, new_id_token);

        body.set('state', state);
        body.set('id_token', signed);

        await storeState(env, state, new_id_token.nonce);

        const req = new Request(
          'http://example.com/lti/launch',
          {
            method: 'POST',
            headers: {
              Accept: '*/*',
              Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
            },
            body: body,
          },
        );
        const resp = await app.fetch(req, env);
        const text = await resp.text();
        expect(resp.status).toBe(401);
        expect(text).toContain('LTI token is missing required');
        expect(text).toContain(field);

        // Clean up
        await env.OIDC.delete(state);
      }

      await runTest('iss');
      await runTest('sub');
      await runTest('aud');
      await runTest('sub');
      await runTest(MESSAGE_TYPE);

      // Clean up
      await env.OIDC.delete(state);
    });
  });

  it('succeeds when the id_token is valid', async () => {
    const { state, body } = await setupValidState(env, test_id_token);
    const req = new Request(
      'http://example.com/lti/launch',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          Cookie: `${OPEN_ID_COOKIE_PREFIX}${state}`,
        },
        body: body,
      },
    );
    const resp = await app.fetch(req, env);

    expect(resp.status).toBe(200);
    const text = await resp.text();
    expect(text).toContain('"stateVerified":true');

    // Clean up
    await env.OIDC.delete(state);
  });
});
