import type { RequestHandler } from './$types';
import { PUBLIC_API_HOST } from '$env/static/public';

export const POST: RequestHandler = async ({ fetch, cookies }) => {
	const refreshToken = cookies.get('refreshToken');
	const data = { refreshToken };

	await fetch(PUBLIC_API_HOST+ '/auth/logout', {
		method: 'POST',
		body: JSON.stringify(data)
	});

	cookies.delete('refreshToken', { path: '/' });
	cookies.delete('accessToken', { path: '/' });

	return new Response();
};
