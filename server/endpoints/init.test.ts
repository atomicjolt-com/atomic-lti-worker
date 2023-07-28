import { expect, it, describe } from 'vitest';

const env = getMiniflareBindings();
import { app } from '../../functions/lti/[[route]]';
import { OPEN_ID_COOKIE_PREFIX, OPEN_ID_STORAGE_COOKIE } from '@atomicjolt/lti/src/libs/constants';

describe('init OIDC request', () => {
	it('returns 302 for a POST to /init', async () => {
		const iss = 'https://lms.example.com';
		const targetLinkUri = 'https://oidc.example.com/lti/launch';
		const ltiMessageHint = 'the_secure_message_hint';
		const loginHint = 'the_secure_login_hint';
		const clientId = '1234';

		const body: BodyInit = new FormData();
		body.set('iss', iss);
		body.set('login_hint', loginHint);
		body.set('client_id', clientId);
		body.set('target_link_uri', targetLinkUri);
		body.set('lti_message_hint', ltiMessageHint);
		body.set('lti_storage_target', '_parent');

		const req = new Request(
			'http://example.com/lti/init',
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
		const text = await resp.text();
		expect(resp.status).toBe(302);
		expect(resp.headers.get('Set-Cookie')).toContain(OPEN_ID_COOKIE_PREFIX);
		const redirectUrl = new URL(resp.headers.get('Location') || '');
		expect(redirectUrl.searchParams.get('response_type')).toEqual('id_token');
		expect(redirectUrl.searchParams.get('client_id')).toEqual(clientId);
		expect(redirectUrl.searchParams.get('scope')).toEqual('openid');
		expect(redirectUrl.searchParams.get('login_hint')).toEqual(loginHint);
		expect(redirectUrl.searchParams.get('lti_message_hint')).toEqual(ltiMessageHint);
	});

	it('returns 200 for a POST to /init', async () => {
		const iss = 'https://lms.example.com';
		const targetLinkUri = 'https://oicd.example.com/lti';
		const ltiMessageHint = 'the_secure_message_hint';
		const loginHint = 'the_secure_login_hint';
		const clientId = '1234';

		const body: BodyInit = new FormData();
		body.set('iss', iss);
		body.set('login_hint', loginHint);
		body.set('client_id', clientId);
		body.set('target_link_uri', targetLinkUri);
		body.set('lti_message_hint', ltiMessageHint);
		body.set('lti_storage_target', '_parent');

		const req = new Request(
			'http://example.com/lti/init',
			{
				method: 'POST',
				headers: {
					Accept: '*/*',
				},
				body: body,
			},
		);
		const resp = await app.fetch(req, env);

		expect(resp.status).toBe(200);
		expect(resp.headers.get('Set-Cookie')).toContain(OPEN_ID_COOKIE_PREFIX);
	});

});
