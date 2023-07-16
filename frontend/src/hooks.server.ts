import { API_HOST, HOST } from '$env/static/private';
import type { Handle, HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('page', event.url.pathname);
	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	console.log('fetch', request.url);
	const cloneRequest = request.clone();

	if (!request.url.startsWith(HOST) && !request.url.startsWith(API_HOST)) return fetch(request);

	const accessToken = event.cookies.get('accessToken');
	//console.log(accessToken);
	if (accessToken) {
		cloneRequest.headers.set('Authorization', `Bearer ${accessToken}`);
		let response = await fetch(cloneRequest);

		if (response.status === 401) {
			const data = await response.json();
			if (data.message == 'ACCESS_TOKEN_EXPIRED') {
				response = await fetch('/api/auth/refresh');

				if (!response.ok) return new Response(response.body, { ...response });
				const { accessToken } = await response.json();
				const cloneRequest = request.clone();
				cloneRequest.headers.set('Authorization', `Bearer ${accessToken}`);

				return fetch(cloneRequest);
			}
		}
	}

	return fetch(request);
};
