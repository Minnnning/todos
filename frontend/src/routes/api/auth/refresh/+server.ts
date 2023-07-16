import { dev } from '$app/environment';
import { API_HOST } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('refreshToken');
	const response = await fetch(API_HOST + '/auth/token/refresh', {
		method: 'POST',
		body: JSON.stringify({ refreshToken: token }),
		headers: {
			'Content-type': 'application/json'
		}
	});

	const { status } = response;
	const data = await response.json();

	if (!response.ok) {
		cookies.delete('accessToken', { path: '/' });
		cookies.delete('refreshToken', { path: '/' });
		return new Response(JSON.stringify(data), { status });
	}

    const {accessToken, refreshToken} = data;
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
};


