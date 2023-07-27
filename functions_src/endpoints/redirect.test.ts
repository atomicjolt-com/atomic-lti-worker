import { expect, it, describe } from 'vitest';
import { OPEN_ID_STORAGE_COOKIE } from '@atomicjolt/lti/src/libs/constants';

import { app } from '../../functions/lti/[[route]]';
import { setupValidState } from '../test/state_helper';
import { test_id_token } from '../libs/jwt.test';

const env = getMiniflareBindings();

describe('redirect request', () => {
  it('returns 200 for a POST to /redirect', async () => {
    const { body } = await setupValidState(env, test_id_token);
    const req = new Request(
      `http://example.com/lti/redirect`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          Cookie: `${OPEN_ID_STORAGE_COOKIE}=1`,
        },
        body: body,
      },
    );
    const resp = await app.fetch(req, env);
    expect(resp.status).toBe(200);
  });
});
