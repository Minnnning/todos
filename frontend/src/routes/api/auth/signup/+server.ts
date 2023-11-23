import { PUBLIC_API_HOST } from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const dto: User = await request.json();
	console.log("dto",dto);
	const response = await fetch(PUBLIC_API_HOST + '/auth/signup', {
		method: 'POST',
		body: JSON.stringify(dto),
		headers: {
			'Content-type': 'application/json'
		}
	});

	return response.clone();
};
