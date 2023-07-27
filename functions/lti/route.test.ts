import { describe, expect, it } from 'vitest';

import { app } from './[[route]]';

describe('index requests', () => {
	it('should return 200 response for GET to /', async () => {
		const resp = await app.request(
			'http://example.com/lti',
			{ method: 'GET' },
		);
		expect(resp.status).toBe(200);

		const text = await resp.text();
		expect(text).toBe('Atomic LTI');
	});

	it('should return 200 response for GET to /up', async () => {
		const resp = await app.request(
			'http://example.com/lti/up',
			{ method: 'GET' },
		);
		expect(resp.status).toBe(200);

		const json = await resp.json();
		expect(json).toEqual({ up: true });
	});

	it('should return 404 Not Found', async () => {
		const resp = await app.request(
			'http://example.com/not_real',
			{ method: 'GET' },
		);
		expect(resp.status).toBe(404);

		const text = await resp.text();
		expect(text).toBe('Not found');
	});
});
