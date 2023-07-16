import { API_HOST } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const dto: User = await request.json();
	console.log("dto",dto);
	const response = await fetch(API_HOST + '/auth/signup', {
		method: 'POST',
		body: JSON.stringify(dto),
		headers: {
			'Content-type': 'application/json'
		}
	});

	return response.clone();
};
