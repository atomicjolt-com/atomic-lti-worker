import { Hono } from 'hono';
import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { buildOIDCState } from '@atomicjolt/lti/src/libs/oidc';
import { OPEN_ID_COOKIE_PREFIX, OPEN_ID_STORAGE_COOKIE } from '@atomicjolt/lti/src/libs/constants';

import type { EnvBindings } from '../types';
import { getPlatformOIDCUrl } from '../libs/platforms';
import initHtml from '../html/init_html';
import { setOIDC } from '../models/oidc';

const init = new Hono<{ Bindings: EnvBindings }>();

function writeCookies(c: Context, state: string) {
	setCookie(c, OPEN_ID_STORAGE_COOKIE, '1', {
		path: '/',
		secure: true,
		httpOnly: false,
		maxAge: 356 * 24 * 60 * 60,
		expires: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
		sameSite: 'None',
	});

	setCookie(c, `${OPEN_ID_COOKIE_PREFIX}${state}`, '1', {
		path: '/',
		secure: true,
		httpOnly: false,
		maxAge: 60,
		sameSite: 'None',
	});
}

init.post('/', async (c: Context) => {
	const requestUrl = c.req.url;
	const formData = await c.req.formData();
	const target = formData.get('lti_storage_target') as string;
	const ltiMessageHint = formData.get('lti_message_hint') as string;
	const loginHint = formData.get('login_hint') as string;
	const clientId = formData.get('client_id') as string;
	const iss = formData.get('iss') as string;
	if (iss === null) {
		return new Response('Request is missing required field iss', {
			status: 401,
		});
	};
	const platformOIDCUrl = getPlatformOIDCUrl(iss);
	const { state, oidcState, url, settings } = buildOIDCState(requestUrl, clientId, loginHint, ltiMessageHint, target, platformOIDCUrl);

	await setOIDC(c, state, oidcState);

	writeCookies(c, state);

	const canUseCookies = getCookie(c, OPEN_ID_STORAGE_COOKIE);
	if (canUseCookies) {
		return c.redirect(url.toString(), 302);
	} else {
		// Send an HTML page that will attempt to write a cookie
		return c.html(initHtml(settings));
	}
});

export { init };
