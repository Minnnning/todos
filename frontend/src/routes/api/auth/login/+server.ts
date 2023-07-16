import type { RequestHandler } from './$types';
import { API_HOST } from '$env/static/private';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
	const dto: LoginDto = await request.json();
	const response = await fetch(API_HOST + '/auth/login', {
		method: 'POST',
		body: JSON.stringify(dto),
		headers: {
			'Content-type': 'application/json'
		}
	});

	const { status } = response;

	if (response.ok) {
		const responseData = await response.json();
		const { accessToken, refreshToken } = responseData;
		const cookieOptions = {
			httpOnly: true,
			path: '/',
			secure: !dev
		};
		cookies.set('accessToken', accessToken, cookieOptions);
		cookies.set('refreshToken', refreshToken, cookieOptions);
		return new Response(JSON.stringify({ accessToken }), {
			status,
			headers: { 'Content-type': 'application/json' }
		});
	}
	return response.clone();
};
