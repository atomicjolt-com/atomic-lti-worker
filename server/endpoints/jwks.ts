import { Hono } from 'hono';

import { EnvBindings } from '../../types';
import { getJwks } from '../libs/jwt';

const jwks = new Hono<{ Bindings: EnvBindings }>();

jwks.get('/', async (c) => {
  const jwks = await getJwks(c.env.JWKS);
  const json = JSON.stringify(jwks);
  return new Response(json, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

export { jwks };
