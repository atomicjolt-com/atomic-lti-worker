import type { DurableObjectState } from '@cloudflare/workers-types';
import type { DurableObjectId, DurableObjectStorage } from '@cloudflare/workers-types';
export class OIDCState {

	state: DurableObjectState;

	constructor(state: DurableObjectState) {
		this.state = state;
	}

	async fetch(request: Request) {
		let id = '';
		if (request.url === 'init') {
			let storagePromise = this.state.storage.put(this.state.id.toString(), this.state.id.toString());
			await storagePromise;
		} else if (request.url === 'check') {
			id = await this.state.storage.get(this.state.id.toString()) || '';
		}


		// Return the id
		return new Response(
			JSON.stringify({
				id: id,
			}),
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		);
	}
}
